package com.telusko.hotelservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.telusko.hotelservice.service.HotelService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.telusko.hotelservice.dto.HotelDTO;
import com.telusko.hotelservice.dto.RoomAvailabilityDTO;
import com.telusko.hotelservice.event.RoomBookedEvent;
import com.telusko.hotelservice.event.RoomReleasedEvent;
import com.telusko.hotelservice.model.RoomAvailability;
import com.telusko.hotelservice.model.RoomType;
import com.telusko.hotelservice.service.RoomAvailabilityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/hotel")
@Tag(name = "Hotel Management", description = "Hotel CRUD operations and search endpoints")
public class HotelController {

    private final HotelService service;
    private final RoomAvailabilityService roomAvailabilityService;
    private final ApplicationEventPublisher eventPublisher;

    public HotelController(HotelService service, RoomAvailabilityService roomAvailabilityService,
                           ApplicationEventPublisher eventPublisher) {
        this.service = service;
        this.roomAvailabilityService = roomAvailabilityService;
        this.eventPublisher = eventPublisher;
    }

    // 🔒 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @Operation(summary = "Add New Hotel",
            description = "Create a new hotel (ADMIN ONLY)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel created successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
    public HotelDTO addHotel(@RequestBody HotelDTO dto) {
        return service.addHotel(dto);
    }

    @GetMapping
    @Operation(summary = "Get All Hotels with Filtering, Sorting, and Search",
            description = "Retrieve hotels with optional price range, rating filter, keyword search, and sorting")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotels returned successfully")
    })
    public ResponseEntity<List<HotelDTO>> getHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false, defaultValue = "popularity") String sortBy) {
        
        List<HotelDTO> hotels;
        
        // Use filtering if any filter param is provided, otherwise use city search or get all
        if (minPrice != null || maxPrice != null || minRating != null || maxRating != null) {
            hotels = service.filterHotels(minPrice, maxPrice, minRating, maxRating, city);
        } else if (city != null && !city.trim().isEmpty()) {
            hotels = service.searchHotels(city.trim());
        } else {
            hotels = service.getAllHotels();
        }
        
        // Server-side sorting
        if ("price_asc".equals(sortBy)) {
            hotels.sort((a, b) -> Double.compare(a.getPrice() != null ? a.getPrice() : 0, 
                                                  b.getPrice() != null ? b.getPrice() : 0));
        } else if ("price_desc".equals(sortBy)) {
            hotels.sort((a, b) -> Double.compare(b.getPrice() != null ? b.getPrice() : 0, 
                                                  a.getPrice() != null ? a.getPrice() : 0));
        } else if ("rating_desc".equals(sortBy)) {
            hotels.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0, 
                                                  a.getRating() != null ? a.getRating() : 0));
        }
        
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Hotel by ID",
            description = "Retrieve a specific hotel by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel found and returned"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public HotelDTO getHotel(@PathVariable Long id) {
        return service.getHotelById(id);
    }

    // 🔒 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @Operation(summary = "Update Hotel",
            description = "Update hotel information (ADMIN ONLY)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel updated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public HotelDTO updateHotel(@PathVariable Long id, @RequestBody HotelDTO dto) {
        return service.updateHotel(id, dto);
    }

    // 🔒 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Hotel",
            description = "Delete a hotel by ID (ADMIN ONLY)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hotel deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public String deleteHotel(@PathVariable Long id) {
        service.deleteHotel(id);
        return "Deleted successfully";
    }

    // For SAGA / Bookings
    @PutMapping("/{id}/book")
    public ResponseEntity<String> bookRoom(@PathVariable Long id) {
        service.decrementAvailability(id);
        return ResponseEntity.ok("Room booked successfully");
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelRoomBooking(@PathVariable Long id) {
        service.incrementAvailability(id);
        return ResponseEntity.ok("Room booking cancelled successfully");
    }

    // ========== NEW AVAILABILITY ENDPOINTS ==========

    /**
     * Get availability for a specific date
     */
    @GetMapping("/{id}/availability")
    @Operation(summary = "Get Room Availability",
            description = "Get room availability for a hotel on a specific date or date range")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Availability retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<List<RoomAvailabilityDTO>> getAvailability(
            @PathVariable Long id,
            @RequestParam String roomType,
            @RequestParam String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : start;
        
        RoomType type = RoomType.valueOf(roomType.toUpperCase());
        List<RoomAvailability> availabilities = roomAvailabilityService
                .getAvailabilityRange(id, type, start, end);
        
        List<RoomAvailabilityDTO> dtos = availabilities.stream()
                .map(ra -> new RoomAvailabilityDTO(ra.getHotelId(), ra.getRoomType(), 
                        ra.getDate(), ra.getTotalRooms(), ra.getBookedRooms()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Check availability for a date range (used before booking)
     */
    @GetMapping("/{id}/check-availability")
    @Operation(summary = "Check Room Availability for Date Range",
            description = "Check if rooms are available for the entire date range")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Availability checked"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable Long id,
            @RequestParam String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        
        LocalDate start = LocalDate.parse(checkIn);
        LocalDate end = LocalDate.parse(checkOut);
        RoomType type = RoomType.valueOf(roomType.toUpperCase());
        
        boolean available = roomAvailabilityService.checkAvailabilityForRange(id, type, start, end);
        return ResponseEntity.ok(available);
    }

    /**
     * Book room for a date range (atomically reserves availability)
     */
    @PutMapping("/{id}/room/{roomType}/book")
    @Operation(summary = "Reserve Room",
            description = "Reserve room(s) for a date range")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Room reserved successfully"),
            @ApiResponse(responseCode = "400", description = "Room not available"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<String> reserveRoom(
            @PathVariable Long id,
            @PathVariable String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam(required = false) Long bookingId) {
        
        LocalDate start = LocalDate.parse(checkIn);
        LocalDate end = LocalDate.parse(checkOut);
        RoomType type = RoomType.valueOf(roomType.toUpperCase());
        
        roomAvailabilityService.reserveRoom(id, type, start, end);
        
        // Publish event for async listeners
        if (bookingId != null) {
            eventPublisher.publishEvent(new RoomBookedEvent(this, id, type, start, end, bookingId));
        }
        
        return ResponseEntity.ok("Room reserved successfully");
    }

    /**
     * Release room for a date range (atomically releases availability)
     */
    @PutMapping("/{id}/room/{roomType}/cancel")
    @Operation(summary = "Release Room",
            description = "Release room(s) for a date range (on cancellation)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Room released successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<String> releaseRoom(
            @PathVariable Long id,
            @PathVariable String roomType,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam(required = false) Long bookingId) {
        
        LocalDate start = LocalDate.parse(checkIn);
        LocalDate end = LocalDate.parse(checkOut);
        RoomType type = RoomType.valueOf(roomType.toUpperCase());
        
        roomAvailabilityService.releaseRoom(id, type, start, end);
        
        // Publish event for async listeners
        if (bookingId != null) {
            eventPublisher.publishEvent(new RoomReleasedEvent(this, id, type, start, end, bookingId));
        }
        
        return ResponseEntity.ok("Room released successfully");
    }

    /**
     * Get all room types available for a hotel
     */
    @GetMapping("/{id}/room-types")
    @Operation(summary = "Get Room Types",
            description = "Get all room types available for a specific hotel")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Room types retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Hotel not found")
    })
    public ResponseEntity<List<String>> getRoomTypes(@PathVariable Long id) {
        List<String> roomTypes = roomAvailabilityService.getRoomTypesForHotel(id)
                .stream()
                .map(RoomType::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roomTypes);
    }
}
