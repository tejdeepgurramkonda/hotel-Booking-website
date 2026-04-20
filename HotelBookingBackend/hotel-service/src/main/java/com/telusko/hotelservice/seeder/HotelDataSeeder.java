package com.telusko.hotelservice.seeder;

import java.util.Arrays;
import java.util.List;

import com.telusko.hotelservice.repo.HotelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.telusko.hotelservice.model.Hotel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Order(1)
@Slf4j
public class HotelDataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepository;

    @Override
    public void run(String... args) throws Exception {
        if (hotelRepository.count() == 0) {
            List<Hotel> hotels = Arrays.asList(
                    new Hotel(null, "The Taj Mahal Palace", "Mumbai", "Apollo Bunder", 15000.0, 4.9, "Legendary sea-facing landmark near the Gateway of India.", 80),
                    new Hotel(null, "Oberoi Trident", "Mumbai", "Nariman Point", 12000.0, 4.8, "Luxury hotel offering stunning views of Marine Drive.", 60),
                    new Hotel(null, "ITC Maratha", "Mumbai", "Sahar Airport Road", 10000.0, 4.6, "Premium luxury hotel close to the international airport.", 100),
                    new Hotel(null, "The Leela", "Mumbai", "Andheri East", 11000.0, 4.6, "Resort-style business hotel with lush gardens.", 75),
                    new Hotel(null, "St. Regis", "Mumbai", "Lower Parel", 16000.0, 4.7, "The tallest hotel tower in India with premium amenities.", 50),
                    new Hotel(null, "The Imperial", "Delhi", "Janpath", 14000.0, 4.8, "Iconic grand hotel blending Victorian and colonial architecture.", 45),
                    new Hotel(null, "ITC Maurya", "Delhi", "Diplomatic Enclave", 12500.0, 4.7, "Premium luxury stay known for its stellar restaurants.", 65),
                    new Hotel(null, "The Leela Palace", "Delhi", "Chanakyapuri", 18000.0, 4.9, "Modern palace providing lavish luxury.", 40),
                    new Hotel(null, "Taj Palace", "Delhi", "Sardar Patel Marg", 11000.0, 4.7, "Luxurious retreat amid 6 acres of gardens.", 85),
                    new Hotel(null, "JW Marriott", "Delhi", "Aerocity", 9000.0, 4.5, "Sophisticated hotel conveniently near the airport.", 110),
                    new Hotel(null, "Taj West End", "Bangalore", "Race Course Road", 13000.0, 4.8, "Historic hotel set amidst 20 acres of flora.", 55),
                    new Hotel(null, "The Leela Palace", "Bangalore", "Old Airport Road", 15000.0, 4.8, "Luxurious property inspired by the Vijayanagara Empire.", 60),
                    new Hotel(null, "ITC Gardenia", "Bangalore", "Residency Road", 11500.0, 4.7, "Eco-responsible luxury in the heart of the city.", 70),
                    new Hotel(null, "Shangri-La", "Bangalore", "Palace Road", 9500.0, 4.6, "Modern luxury with panoramic city views.", 80),
                    new Hotel(null, "Rambagh Palace", "Jaipur", "Bhawani Singh Road", 35000.0, 4.9, "The Former residence of the Maharaja of Jaipur.", 35),
                    new Hotel(null, "Taj Jai Mahal Palace", "Jaipur", "Jacob Road", 18000.0, 4.8, "A stunning heritage palace property.", 40),
                    new Hotel(null, "The Oberoi Rajvilas", "Jaipur", "Goner Road", 32000.0, 4.9, "Luxury tents and villas in a fort setting.", 25),
                    new Hotel(null, "Fairmont", "Jaipur", "Riico Industrial Area", 12000.0, 4.6, "Opulent luxury reflecting the majestic Mughal palaces.", 90),
                    new Hotel(null, "Taj Lake Palace", "Udaipur", "Lake Pichola", 45000.0, 4.9, "Iconic white marble palace floating on Lake Pichola.", 20),
                    new Hotel(null, "The Oberoi Udaivilas", "Udaipur", "Haridasji Ki Magri", 40000.0, 4.9, "Spectacular resort spread over 30 acres on the banks of Lake Pichola.", 30),
                    new Hotel(null, "The Leela Palace", "Udaipur", "Lake Pichola", 38000.0, 4.8, "Ornate luxury combining Mewari traditions with modern elegance.", 35),
                    new Hotel(null, "Taj Exotica Resort & Spa", "Goa", "Benaulim", 18000.0, 4.7, "Mediterranean-inspired luxury resort by the Arabian Sea.", 65),
                    new Hotel(null, "The Leela", "Goa", "Cavelossim", 22000.0, 4.8, "Beachfront property featuring a 12-hole golf course.", 50),
                    new Hotel(null, "W", "Goa", "Vagator", 16000.0, 4.6, "Vibrant lifestyle retreat steps from Vagator Beach.", 60),
                    new Hotel(null, "ITC Grand Goa", "Goa", "Arossim Beach", 14000.0, 4.7, "Idyllic resort seamlessly blending Goan and Portuguese heritage.", 75),
                    new Hotel(null, "Taj Coromandel", "Chennai", "Nungambakkam", 10000.0, 4.6, "A grand luxury hotel fusing South Indian design and classic elegance.", 80),
                    new Hotel(null, "ITC Grand Chola", "Chennai", "Guindy", 12000.0, 4.8, "Palatial tribute to Southern India's greatest empires.", 100),
                    new Hotel(null, "The Leela Palace", "Chennai", "Adyar Seaface", 14000.0, 4.7, "Chennai's only sea-facing luxury hotel.", 60),
                    new Hotel(null, "Taj Bengal", "Kolkata", "Alipore", 11000.0, 4.7, "Landmark hotel known for its rich heritage and distinctive architecture.", 55),
                    new Hotel(null, "The Oberoi Grand", "Kolkata", "Jawaharlal Nehru Road", 13000.0, 4.8, "Fondly referred to as the 'Grande Dame of Chowringhee'.", 45),
                    new Hotel(null, "ITC Sonar", "Kolkata", "JBS Haldane Avenue", 9000.0, 4.6, "A luxury business resort nestled in lush greenery.", 70),
                    new Hotel(null, "Taj Falaknuma Palace", "Hyderabad", "Engine Bowli", 35000.0, 4.9, "A jewel in the clouds offering a glimpse into the Nizam's lifestyle.", 30),
                    new Hotel(null, "ITC Kohenur", "Hyderabad", "HITEC City", 12000.0, 4.7, "Modern luxury celebrating the region's rich culture and diamonds.", 65),
                    new Hotel(null, "Park Hyatt", "Hyderabad", "Banjara Hills", 11000.0, 4.6, "Contemporary luxury in an upscale neighborhood.", 75),
                    new Hotel(null, "The Oberoi Amarvilas", "Agra", "Taj East Gate Road", 45000.0, 4.9, "Unrestricted views of the Taj Mahal from every room.", 40),
                    new Hotel(null, "ITC Mughal", "Agra", "Taj Ganj", 10000.0, 4.6, "Sprawling luxury resort inspired by Mughal architecture.", 80),
                    new Hotel(null, "Taj Malabar Resort & Spa", "Kochi", "Willingdon Island", 14000.0, 4.8, "Historic hotel offering spectacular views of the harbor.", 50),
                    new Hotel(null, "Grand Hyatt", "Kochi", "Bolgatty Oasis", 12000.0, 4.7, "Stunning waterfront resort overlooking Vembanad Lake.", 60),
                    new Hotel(null, "Taj Ganges", "Varanasi", "Nadesar Palace Grounds", 9500.0, 4.6, "A tranquil retreat amidst 40 acres of lush gardens in the holy city.", 55),
                    new Hotel(null, "BrijRama Palace", "Varanasi", "Darbhanga Ghat", 18000.0, 4.8, "One of the oldest landmarks on the Ganges, offering heritage luxury.", 30),
                    new Hotel(null, "JW Marriott", "Pune", "Senapati Bapat Road", 11000.0, 4.7, "Premier luxury hotel known for its excellent dining and amenities.", 85),
                    new Hotel(null, "Conrad", "Pune", "Koregaon Park", 10000.0, 4.6, "Sophisticated stay located in the heart of the city's dynamic district.", 75),
                    new Hotel(null, "Ananda In The Himalayas", "Rishikesh", "Narendra Nagar", 42000.0, 4.9, "Award-winning luxury spa resort.", 25),
                    new Hotel(null, "Taj Rishikesh Resort & Spa", "Rishikesh", "Singthali", 25000.0, 4.8, "Serene retreat by the Ganges surrounded by nature.", 40),
                    new Hotel(null, "Wildflower Hall", "Shimla", "Chharabra", 28000.0, 4.9, "Fairy-tale luxury resort amidst cedar forests.", 35),
                    new Hotel(null, "The Oberoi Cecil", "Shimla", "Chaura Maidan", 16000.0, 4.8, "Grand heritage hotel holding colonial charm.", 45)
            );

            hotelRepository.saveAll(hotels);
            log.info("Hotel database seeded with {} hotels.", hotels.size());
        }
    }
}
