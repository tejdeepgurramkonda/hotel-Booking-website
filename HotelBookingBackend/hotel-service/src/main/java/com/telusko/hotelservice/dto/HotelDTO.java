package com.telusko.hotelservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelDTO {

    private Long id;
    private String name;
    private String city;
    private String address;
    private Double price;
    private Double rating;
    private String description;
    private Integer availableRooms;
}
