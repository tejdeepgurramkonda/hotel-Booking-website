package com.telusko.hotelservice.repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.telusko.hotelservice.model.RoomAvailability;
import com.telusko.hotelservice.model.RoomType;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {

    /**
     * Find availability for a specific date
     */
    Optional<RoomAvailability> findByHotelIdAndRoomTypeAndDate(Long hotelId, RoomType roomType, LocalDate date);

    /**
     * Find availability for a date range (inclusive)
     */
    List<RoomAvailability> findByHotelIdAndRoomTypeAndDateBetween(
            Long hotelId, 
            RoomType roomType, 
            LocalDate startDate, 
            LocalDate endDate
    );

    /**
     * Find all available rooms for a hotel and room type on a specific date
     */
    @Query("SELECT ra FROM RoomAvailability ra WHERE ra.hotelId = :hotelId AND ra.roomType = :roomType AND ra.date = :date")
    Optional<RoomAvailability> findAvailability(
            @Param("hotelId") Long hotelId,
            @Param("roomType") RoomType roomType,
            @Param("date") LocalDate date
    );

    /**
     * Atomically decrement booked rooms (reserve room)
     * Only updates if availableRooms > 0 to prevent overbooking
     */
    @Modifying
    @Transactional
    @Query("UPDATE RoomAvailability ra SET ra.bookedRooms = ra.bookedRooms + 1 " +
            "WHERE ra.hotelId = :hotelId AND ra.roomType = :roomType AND ra.date = :date " +
            "AND (ra.totalRooms - ra.bookedRooms) > 0")
    int decrementAvailability(
            @Param("hotelId") Long hotelId,
            @Param("roomType") RoomType roomType,
            @Param("date") LocalDate date
    );

    /**
     * Atomically increment booked rooms (release room)
     */
    @Modifying
    @Transactional
    @Query("UPDATE RoomAvailability ra SET ra.bookedRooms = ra.bookedRooms - 1 " +
            "WHERE ra.hotelId = :hotelId AND ra.roomType = :roomType AND ra.date = :date " +
            "AND ra.bookedRooms > 0")
    int incrementAvailability(
            @Param("hotelId") Long hotelId,
            @Param("roomType") RoomType roomType,
            @Param("date") LocalDate date
    );

    /**
     * Check if all dates in range have availability
     */
    @Query("SELECT CASE WHEN COUNT(ra) = :totalDays AND COUNT(ra) = " +
            "SUM(CASE WHEN (ra.totalRooms - ra.bookedRooms) > 0 THEN 1 ELSE 0 END) THEN true ELSE false END " +
            "FROM RoomAvailability ra " +
            "WHERE ra.hotelId = :hotelId AND ra.roomType = :roomType " +
            "AND ra.date BETWEEN :startDate AND :endDate")
    boolean hasAvailabilityForRange(
            @Param("hotelId") Long hotelId,
            @Param("roomType") RoomType roomType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("totalDays") Long totalDays
    );

    /**
     * Find all room types for a specific hotel
     */
    @Query("SELECT DISTINCT ra.roomType FROM RoomAvailability ra WHERE ra.hotelId = :hotelId")
    List<RoomType> findDistinctRoomTypesByHotelId(@Param("hotelId") Long hotelId);
}
