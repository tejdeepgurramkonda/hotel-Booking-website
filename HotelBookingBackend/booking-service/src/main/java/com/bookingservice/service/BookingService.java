package com.bookingservice.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookingservice.dto.BookingDTO;
import com.bookingservice.entity.Bookings;
import com.bookingservice.exception.BadRequestException;
import com.bookingservice.repository.BookingRepository;
import com.bookingservice.repository.HotelClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelClient hotelClient;

    public Bookings createBooking(BookingDTO dto, Long tokenUserId, String tokenRole, String authorization) {

        // For USER role, always use the userId from the JWT token (ignore body userId)
        // For ADMIN role, allow specifying a userId in the body; fallback to token userId
        Long bookingUserId;

        if ("USER".equalsIgnoreCase(tokenRole)) {
            // Regular users can only book for themselves
            if (dto.getUserId() != null && !dto.getUserId().equals(tokenUserId)) {
                throw new BadRequestException("Users can create bookings only for themselves");
            }
            bookingUserId = tokenUserId;
        } else {
            // Admin can specify userId explicitly, or it defaults to their own
            bookingUserId = (dto.getUserId() != null) ? dto.getUserId() : tokenUserId;
        }

        if (bookingUserId == null) {
            throw new BadRequestException("userId could not be determined");
        }

        // Validate hotel exists via feign (hotel-service is the source of truth for hotels)
        Object hotel = hotelClient.getHotel(dto.getHotelId(), authorization);
        if (hotel != null && hotel.toString().contains("unavailable")) {
            throw new BadRequestException("Hotel Service is unavailable");
        }

        // Validate roomType is provided
        if (dto.getRoomType() == null || dto.getRoomType().trim().isEmpty()) {
            throw new BadRequestException("Room type must be specified");
        }

        // Extract check-in and check-out dates
        LocalDate checkIn = dto.getCheckIn().toLocalDate();
        LocalDate checkOut = dto.getCheckOut().toLocalDate();

        // Validate date range
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        log.info("Creating booking: Hotel {}, Room Type {}, Check-in {}, Check-out {}", 
                dto.getHotelId(), dto.getRoomType(), checkIn, checkOut);

        // PRE-AVAILABILITY CHECK (fail fast)
        try {
            Boolean available = hotelClient.checkAvailability(
                    dto.getHotelId(),
                    dto.getRoomType(),
                    checkIn.toString(),
                    checkOut.toString(),
                    authorization);

            if (!available) {
                log.warn("Room not available for the requested date range");
                throw new BadRequestException("Room not available for the requested date range. Please select different dates.");
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error checking availability: {}", e.getMessage());
            throw new BadRequestException("Could not verify room availability: " + e.getMessage());
        }

        // Pre-save the booking as PENDING
        Bookings booking = new Bookings();
        booking.setUserId(bookingUserId);
        booking.setHotelId(dto.getHotelId());
        booking.setCheckIn(dto.getCheckIn());
        booking.setCheckOut(dto.getCheckOut());
        booking.setPrice(dto.getPrice());
        booking.setStatus("PENDING");
        booking.setRoomType(dto.getRoomType());

        booking = bookingRepository.save(booking);
        log.info("Booking created with PENDING status: {}", booking.getId());

        try {
            // SAGA Step: try to reserve room in hotel-service (atomically decrements availability)
            hotelClient.reserveRoom(
                    dto.getHotelId(),
                    dto.getRoomType(),
                    checkIn.toString(),
                    checkOut.toString(),
                    booking.getId(),
                    authorization);
            
            // If success, update to BOOKED
            booking.setStatus("BOOKED");
            log.info("Booking confirmed: {}", booking.getId());
            return bookingRepository.save(booking);
        } catch (Exception e) {
            // SAGA Compensation / Failure
            log.error("Failed to reserve room, cancelling booking: {}", e.getMessage());
            booking.setStatus("FAILED");
            bookingRepository.save(booking);
            throw new BadRequestException("Booking failed: " + e.getMessage());
        }
    }

    public List<Bookings> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Bookings updateBooking(Long id, BookingDTO dto, Long userId, String role) {

        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("USER".equalsIgnoreCase(role) && !booking.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this booking");
        }

        if (booking.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Cannot update cancelled booking");
        }

        booking.setCheckIn(dto.getCheckIn());
        booking.setCheckOut(dto.getCheckOut());

        return bookingRepository.save(booking);
    }

    public Bookings cancelBooking(Long id, String authorization, Long userId, String role) {

        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("USER".equalsIgnoreCase(role) && !booking.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }

        LocalDate checkIn = booking.getCheckIn().toLocalDate();
        LocalDate checkOut = booking.getCheckOut().toLocalDate();

        booking.setStatus("CANCELLED");
        Bookings updated = bookingRepository.save(booking);

        // Notify hotel-service to increment availability (release room)
        try {
            hotelClient.releaseRoom(
                    booking.getHotelId(),
                    booking.getRoomType(),
                    checkIn.toString(),
                    checkOut.toString(),
                    booking.getId(),
                    authorization);
            log.info("Room released for booking: {}", id);
        } catch (Exception e) {
            // Log error but proceed with cancellation locally
            log.error("Failed to notify hotel service of cancellation: {}", e.getMessage());
        }

        return updated;
    }

}
