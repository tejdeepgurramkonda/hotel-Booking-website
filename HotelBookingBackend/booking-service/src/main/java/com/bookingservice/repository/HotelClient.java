package com.bookingservice.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "hotel-service")
public interface HotelClient {

    @GetMapping("/hotel/{id}")
    @CircuitBreaker(name = "hotelService", fallbackMethod = "getHotelFallback") 
    @Retry(name = "hotelService", fallbackMethod = "getHotelFallback")
    Object getHotel(@PathVariable("id") Long id, @RequestHeader("Authorization") String authorization);

    // OLD ENDPOINTS (DEPRECATED - kept for backward compatibility)
    @PutMapping("/hotel/{id}/book")
    @CircuitBreaker(name = "hotelService", fallbackMethod = "bookRoomFallback")
    String bookRoom(@PathVariable("id") Long id, @RequestHeader("Authorization") String authorization);

    @PutMapping("/hotel/{id}/cancel")
    @CircuitBreaker(name = "hotelService", fallbackMethod = "cancelRoomFallback")
    String cancelRoomBooking(@PathVariable("id") Long id, @RequestHeader("Authorization") String authorization);

    // NEW ENDPOINTS FOR ROOM AVAILABILITY
    
    /**
     * Check if rooms are available for the entire date range
     */
    @GetMapping("/hotel/{id}/check-availability")
    @CircuitBreaker(name = "hotelService", fallbackMethod = "checkAvailabilityFallback")
    @Retry(name = "hotelService", fallbackMethod = "checkAvailabilityFallback")
    Boolean checkAvailability(
            @PathVariable("id") Long id,
            @RequestParam String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestHeader("Authorization") String authorization);

    /**
     * Reserve room for a date range
     */
    @PutMapping("/hotel/{id}/room/{roomType}/book")
    @CircuitBreaker(name = "hotelService", fallbackMethod = "reserveRoomFallback")
    @Retry(name = "hotelService", fallbackMethod = "reserveRoomFallback")
    String reserveRoom(
            @PathVariable("id") Long id,
            @PathVariable("roomType") String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam(required = false) Long bookingId,
            @RequestHeader("Authorization") String authorization);

    /**
     * Release room for a date range
     */
    @PutMapping("/hotel/{id}/room/{roomType}/cancel")
    @CircuitBreaker(name = "hotelService", fallbackMethod = "releaseRoomFallback")
    @Retry(name = "hotelService", fallbackMethod = "releaseRoomFallback")
    String releaseRoom(
            @PathVariable("id") Long id,
            @PathVariable("roomType") String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam(required = false) Long bookingId,
            @RequestHeader("Authorization") String authorization);

    // FALLBACK METHODS
    default Object getHotelFallback(Long id, String authorization, Throwable throwable) {
        System.err.println("getHotel failed: " + throwable.getMessage());
        return "Hotel Service is unavailable. Please try again later.";
    }

    default String bookRoomFallback(Long id, String authorization, Throwable throwable) {
        throw new RuntimeException("Could not book room: " + throwable.getMessage());
    }

    default String cancelRoomFallback(Long id, String authorization, Throwable throwable) {
        throw new RuntimeException("Could not cancel room: " + throwable.getMessage());
    }

    default Boolean checkAvailabilityFallback(Long id, String roomType, String checkIn, String checkOut, 
                                              String authorization, Throwable throwable) {
        System.err.println("checkAvailability failed: " + throwable.getMessage());
        throw new RuntimeException("Could not check room availability: " + throwable.getMessage());
    }

    default String reserveRoomFallback(Long id, String roomType, String checkIn, String checkOut, 
                                       Long bookingId, String authorization, Throwable throwable) {
        throw new RuntimeException("Could not reserve room: " + throwable.getMessage());
    }

    default String releaseRoomFallback(Long id, String roomType, String checkIn, String checkOut, 
                                       Long bookingId, String authorization, Throwable throwable) {
        throw new RuntimeException("Could not release room: " + throwable.getMessage());
    }
}

