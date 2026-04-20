package com.telusko.hotelservice.seeder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.telusko.hotelservice.model.RoomAvailability;
import com.telusko.hotelservice.model.RoomType;
import com.telusko.hotelservice.repo.RoomAvailabilityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Order(2)
@Slf4j
public class RoomAvailabilitySeeder implements CommandLineRunner {

    private final RoomAvailabilityRepository roomAvailabilityRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed availability data only if not already populated
        if (roomAvailabilityRepository.count() == 0) {
            log.info("Starting RoomAvailability seeding...");
            
            // Hotel IDs from HotelDataSeeder (1 to 46 hotels)
            long[] hotelIds = new long[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46};

            List<RoomAvailability> availabilities = new ArrayList<>();
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(365);

            // Room type initial counts
            int[] roomCounts = {15, 12, 8}; // DELUXE, HERITAGE, PENTHOUSE

            for (long hotelId : hotelIds) {
                for (int i = 0; i < RoomType.values().length; i++) {
                    RoomType roomType = RoomType.values()[i];
                    
                    // Seed availability for each day in the next 365 days
                    LocalDate currentDate = startDate;
                    while (!currentDate.isAfter(endDate)) {
                        RoomAvailability availability = new RoomAvailability(
                                hotelId,
                                roomType,
                                currentDate,
                                roomCounts[i] // total rooms per type
                        );
                        availabilities.add(availability);
                        currentDate = currentDate.plusDays(1);
                    }
                }
            }

            roomAvailabilityRepository.saveAll(availabilities);
            log.info("Room availability database seeded with {} records for {} hotels and 365 days.",
                    availabilities.size(), hotelIds.length);
        } else {
            log.info("Room availability data already exists. Skipping seeding.");
        }
    }
}
