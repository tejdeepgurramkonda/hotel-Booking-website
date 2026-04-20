package com.telusko.hotelservice.dto;

import java.time.LocalDate;

import com.telusko.hotelservice.model.RoomType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomAvailabilityDTO {
    private Long hotelId;
    private RoomType roomType;
    private LocalDate date;
    private Integer totalRooms;
    private Integer bookedRooms;
    private Integer availableRooms;

    public RoomAvailabilityDTO(Long hotelId, RoomType roomType, LocalDate date, 
                              Integer totalRooms, Integer bookedRooms) {
        this.hotelId = hotelId;
        this.roomType = roomType;
        this.date = date;
        this.totalRooms = totalRooms;
        this.bookedRooms = bookedRooms;
        this.availableRooms = totalRooms - bookedRooms;
    }
}
