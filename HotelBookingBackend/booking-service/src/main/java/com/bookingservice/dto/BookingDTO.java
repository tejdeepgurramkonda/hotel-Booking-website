package com.bookingservice.dto;

import com.bookingservice.entity.Bookings;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingDTO {

    private Long userId;
    private Long hotelId;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private double price;
    private String status;
    private String roomType;

}
