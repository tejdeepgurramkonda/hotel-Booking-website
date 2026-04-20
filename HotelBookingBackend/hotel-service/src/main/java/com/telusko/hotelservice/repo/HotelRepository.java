package com.telusko.hotelservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.telusko.hotelservice.model.Hotel;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    @Query("SELECT h FROM Hotel h WHERE LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Hotel> searchHotels(@Param("keyword") String keyword);

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:minPrice IS NULL OR h.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR h.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR h.rating >= :minRating) AND " +
           "(:maxRating IS NULL OR h.rating <= :maxRating) AND " +
           "(:keyword IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Hotel> filterHotels(
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minRating") Double minRating,
            @Param("maxRating") Double maxRating,
            @Param("keyword") String keyword);

    @Modifying
    @Query("UPDATE Hotel h SET h.availableRooms = h.availableRooms - 1 WHERE h.id = :id AND h.availableRooms > 0")
    int decrementAvailability(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Hotel h SET h.availableRooms = h.availableRooms + 1 WHERE h.id = :id")
    int incrementAvailability(@Param("id") Long id);
}
