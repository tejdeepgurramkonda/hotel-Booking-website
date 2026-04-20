package com.telusko.hotelservice.mapper;

import com.telusko.hotelservice.dto.HotelDTO;
import com.telusko.hotelservice.model.Hotel;

public class HotelMapper {
    public static HotelDTO toDTO(Hotel hotel) {
        return new HotelDTO(
                hotel.getId(),
                hotel.getName(),
                hotel.getCity(),
                hotel.getAddress(),
                hotel.getPrice(),
                hotel.getRating(),
                hotel.getDescription(),
                hotel.getAvailableRooms()
        );
    }

    public static Hotel toEntity(HotelDTO dto) {
        return new Hotel(
                dto.getId(),
                dto.getName(),
                dto.getCity(),
                dto.getAddress(),
                dto.getPrice(),
                dto.getRating(),
                dto.getDescription(),
                dto.getAvailableRooms()
        );
    }
}
