package com.telusko.hotelservice.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_availability", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"hotel_id", "room_type", "date"}))
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hotel_id", nullable = false)
    private Long hotelId;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "total_rooms", nullable = false)
    private Integer totalRooms;

    @Column(name = "booked_rooms", nullable = false)
    private Integer bookedRooms;

    /**
     * Calculate available rooms as totalRooms - bookedRooms
     */
    @Transient
    public Integer getAvailableRooms() {
        return this.totalRooms - this.bookedRooms;
    }

    public RoomAvailability(Long hotelId, RoomType roomType, LocalDate date, Integer totalRooms) {
        this.hotelId = hotelId;
        this.roomType = roomType;
        this.date = date;
        this.totalRooms = totalRooms;
        this.bookedRooms = 0;
    }
}
