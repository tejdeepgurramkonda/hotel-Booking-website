package com.telusko.hotelservice.event;

import java.time.LocalDate;

import org.springframework.context.ApplicationEvent;

import com.telusko.hotelservice.model.RoomType;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class RoomBookedEvent extends ApplicationEvent {
    private Long hotelId;
    private RoomType roomType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Long bookingId;

    public RoomBookedEvent(Object source, Long hotelId, RoomType roomType, 
                          LocalDate checkIn, LocalDate checkOut, Long bookingId) {
        super(source);
        this.hotelId = hotelId;
        this.roomType = roomType;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.bookingId = bookingId;
    }
}
