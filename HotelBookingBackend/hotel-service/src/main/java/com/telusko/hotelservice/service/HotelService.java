package com.telusko.hotelservice.service;

import java.util.List;
import java.util.stream.Collectors;

import com.telusko.hotelservice.repo.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.telusko.hotelservice.dto.HotelDTO;
import com.telusko.hotelservice.mapper.HotelMapper;
import com.telusko.hotelservice.model.Hotel;

@Service
public class HotelService {

    private final HotelRepository repo;

    public HotelService(HotelRepository repo) {
        this.repo = repo;
    }

    public HotelDTO addHotel(HotelDTO dto) {
        Hotel hotel = HotelMapper.toEntity(dto);
        return HotelMapper.toDTO(repo.save(hotel));
    }

    public List<HotelDTO> getAllHotels() {
        return repo.findAll()
                .stream()
                .map(HotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<HotelDTO> searchHotels(String keyword) {
        return repo.searchHotels(keyword)
                .stream()
                .map(HotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<HotelDTO> filterHotels(Double minPrice, Double maxPrice, Double minRating, Double maxRating, String keyword) {
        return repo.filterHotels(minPrice, maxPrice, minRating, maxRating, keyword)
                .stream()
                .map(HotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    public HotelDTO getHotelById(Long id) {
        Hotel hotel = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        return HotelMapper.toDTO(hotel);
    }

    public HotelDTO updateHotel(Long id, HotelDTO dto) {
        Hotel hotel = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setName(dto.getName());
        hotel.setCity(dto.getCity());
        hotel.setAddress(dto.getAddress());
        hotel.setPrice(dto.getPrice());
        hotel.setRating(dto.getRating());
        hotel.setDescription(dto.getDescription());
        hotel.setAvailableRooms(dto.getAvailableRooms());

        return HotelMapper.toDTO(repo.save(hotel));
    }

    public void deleteHotel(Long id) {
        repo.deleteById(id);
    }
    
    @Transactional
    public void decrementAvailability(Long id) {
        Hotel hotel = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + id));
        
        if (hotel.getAvailableRooms() <= 0) {
            throw new RuntimeException("Hotel is fully booked - no rooms available");
        }
        
        int updated = repo.decrementAvailability(id);
        if (updated == 0) {
            throw new RuntimeException("Failed to decrement availability for hotel ID: " + id);
        }
    }

    @Transactional
    public void incrementAvailability(Long id) {
        repo.incrementAvailability(id);
    }
}
