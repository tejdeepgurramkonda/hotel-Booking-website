package com.telusko.hotelservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.telusko.hotelservice.exception.RoomUnavailableException;
import com.telusko.hotelservice.model.RoomAvailability;
import com.telusko.hotelservice.model.RoomType;
import com.telusko.hotelservice.repo.RoomAvailabilityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomAvailabilityService {

    private final RoomAvailabilityRepository roomAvailabilityRepository;

    /**
     * Check if rooms are available for the entire date range
     * @return true if all dates in range have available rooms
     */
    public boolean checkAvailabilityForRange(Long hotelId, RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        log.info("Checking availability for Hotel: {}, RoomType: {}, CheckIn: {}, CheckOut: {}",
                hotelId, roomType, checkIn, checkOut);

        List<RoomAvailability> availabilities = roomAvailabilityRepository
                .findByHotelIdAndRoomTypeAndDateBetween(hotelId, roomType, checkIn, checkOut.minusDays(1));

        if (availabilities.isEmpty()) {
            log.warn("No availability records found for the date range");
            return false;
        }

        // Check if all dates have available rooms
        boolean hasAvailability = availabilities.stream()
                .allMatch(ra -> ra.getAvailableRooms() > 0);

        log.info("Availability check result: {}", hasAvailability);
        return hasAvailability;
    }

    /**
     * Get availability for a specific date
     */
    public Optional<RoomAvailability> getAvailability(Long hotelId, RoomType roomType, LocalDate date) {
        return roomAvailabilityRepository.findByHotelIdAndRoomTypeAndDate(hotelId, roomType, date);
    }

    /**
     * Get availability for a date range
     */
    public List<RoomAvailability> getAvailabilityRange(Long hotelId, RoomType roomType, LocalDate startDate, LocalDate endDate) {
        return roomAvailabilityRepository.findByHotelIdAndRoomTypeAndDateBetween(hotelId, roomType, startDate, endDate);
    }

    /**
     * Reserve room for the entire booking date range (atomically decrements each date)
     * @throws RoomUnavailableException if any date in the range has no availability
     */
    @Transactional
    public void reserveRoom(Long hotelId, RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        log.info("Attempting to reserve room - Hotel: {}, RoomType: {}, CheckIn: {}, CheckOut: {}",
                hotelId, roomType, checkIn, checkOut);

        // First verify availability for all dates
        if (!checkAvailabilityForRange(hotelId, roomType, checkIn, checkOut)) {
            log.warn("Room not available for the requested date range");
            throw new RoomUnavailableException("Room not available for the requested date range");
        }

        // Decrement availability for each date
        LocalDate currentDate = checkIn;
        int successfulDecrements = 0;

        while (!currentDate.isAfter(checkOut.minusDays(1))) {
            int decremented = roomAvailabilityRepository.decrementAvailability(hotelId, roomType, currentDate);
            if (decremented == 0) {
                // Rollback: increment back the dates we already decremented
                LocalDate rollbackDate = checkIn;
                while (!rollbackDate.isAfter(currentDate.minusDays(1))) {
                    roomAvailabilityRepository.incrementAvailability(hotelId, roomType, rollbackDate);
                    rollbackDate = rollbackDate.plusDays(1);
                }
                log.error("Failed to decrement availability on date: {}", currentDate);
                throw new RoomUnavailableException("Room availability changed during booking. Please try again.");
            }
            successfulDecrements++;
            currentDate = currentDate.plusDays(1);
        }

        log.info("Successfully reserved room for {} dates", successfulDecrements);
    }

    /**
     * Release room for the entire booking date range (atomically increments each date)
     */
    @Transactional
    public void releaseRoom(Long hotelId, RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        log.info("Releasing room - Hotel: {}, RoomType: {}, CheckIn: {}, CheckOut: {}",
                hotelId, roomType, checkIn, checkOut);

        LocalDate currentDate = checkIn;
        int successfulIncrements = 0;

        while (!currentDate.isAfter(checkOut.minusDays(1))) {
            int incremented = roomAvailabilityRepository.incrementAvailability(hotelId, roomType, currentDate);
            if (incremented > 0) {
                successfulIncrements++;
            }
            currentDate = currentDate.plusDays(1);
        }

        log.info("Successfully released room for {} dates", successfulIncrements);
    }

    /**
     * Get all distinct room types available for a hotel
     */
    public List<RoomType> getRoomTypesForHotel(Long hotelId) {
        return roomAvailabilityRepository.findDistinctRoomTypesByHotelId(hotelId);
    }
}
