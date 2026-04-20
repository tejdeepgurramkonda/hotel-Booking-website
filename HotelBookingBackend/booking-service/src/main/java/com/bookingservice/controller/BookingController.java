package com.bookingservice.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookingservice.dto.BookingDTO;
import com.bookingservice.entity.Bookings;
import com.bookingservice.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Management", description = "Booking creation, management, updates, and cancellations")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create New Booking",
            description = "Create a new hotel booking reservation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid booking data or hotel unavailable"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token")
    })
    public ResponseEntity<Bookings> createBooking(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody BookingDTO dto) {

        return ResponseEntity.ok(bookingService.createBooking(dto, userId, role, authorization));
    }

    @GetMapping
    @Operation(summary = "Get Bookings with Optional Status Filter",
            description = "Retrieve bookings for the authenticated user (ADMIN gets all) with optional status filtering and sorting")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid token")
    })
    public ResponseEntity<List<Bookings>> getBookings(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "checkin_desc") String sortBy) {
        
        List<Bookings> allBookings = bookingService.getAllBookings();
        
        // Filter by user role
        if (!"ADMIN".equalsIgnoreCase(role)) {
            allBookings = allBookings.stream()
                    .filter(b -> b.getUserId().equals(userId))
                    .toList();
        }
        
        // Filter by status if provided
        if (status != null && !status.trim().isEmpty()) {
            allBookings = allBookings.stream()
                    .filter(b -> b.getStatus().equalsIgnoreCase(status))
                    .toList();
        } else if (status == null) {
            // If no status param, filter out cancelled and failed bookings
            allBookings = allBookings.stream()
                    .filter(b -> !("CANCELLED".equalsIgnoreCase(b.getStatus()) || "FAILED".equalsIgnoreCase(b.getStatus())))
                    .toList();
        }
        
        // Server-side sorting
        if ("checkin_desc".equals(sortBy)) {
            allBookings = allBookings.stream()
                    .sorted((a, b) -> {
                        LocalDateTime dateA = a.getCheckIn();
                        LocalDateTime dateB = b.getCheckIn();
                        return dateB.compareTo(dateA); // Most recent first
                    })
                    .toList();
        } else if ("checkin_asc".equals(sortBy)) {
            allBookings = allBookings.stream()
                    .sorted((a, b) -> a.getCheckIn().compareTo(b.getCheckIn()))
                    .toList();
        }
        
        return ResponseEntity.ok(allBookings);
    }

    @PutMapping("/cancel/{id}")
    @Operation(summary = "Cancel Booking",
            description = "Cancel an existing booking. Users can only cancel their own bookings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Cannot cancel other users' bookings"),
            @ApiResponse(responseCode = "404", description = "Booking not found or already cancelled")
    })
    public ResponseEntity<Bookings> cancelBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, authorization, userId, role));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Booking",
            description = "Update booking details (dates). Users can only update their own bookings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking updated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Cannot update other users' bookings"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    public ResponseEntity<Bookings> updateBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody BookingDTO dto) {

        return ResponseEntity.ok(bookingService.updateBooking(id, dto, userId, role));
    }
}
