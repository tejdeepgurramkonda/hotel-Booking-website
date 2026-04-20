# Hotel Booking Backend

This repository contains a Spring Boot microservices backend for a hotel booking system.

## Repository Structure

```text
HotelBookingBackend/
|-- .idea/
|-- api-gateway/
|   |-- .mvn/
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- pom.xml
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   `-- org/hotelbooking/apigateway/
|   |   |   |       |-- ApiGatewayApplication.java
|   |   |   |       |-- config/
|   |   |   |       |   |-- CorsConfig.java
|   |   |   |       |   `-- SwaggerConfig.java
|   |   |   |       `-- filter/
|   |   |   |           `-- AuthenticationFilter.java
|   |   |   `-- resources/
|   |   `-- test/
|   |       `-- java/
|   `-- target/
|-- auth-service/
|   |-- .mvn/
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- pom.xml
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   `-- org/hotelbooking/authservice/
|   |   |   |       |-- AuthServiceApplication.java
|   |   |   |       |-- config/
|   |   |   |       |   `-- SwaggerConfig.java
|   |   |   |       |-- controller/
|   |   |   |       |   `-- AuthController.java
|   |   |   |       |-- dto/
|   |   |   |       |   |-- AuthResponse.java
|   |   |   |       |   |-- LoginRequest.java
|   |   |   |       |   `-- RegisterRequest.java
|   |   |   |       |-- entitiy/
|   |   |   |       |   |-- Auth.java
|   |   |   |       |   `-- Role.java
|   |   |   |       |-- exception/
|   |   |   |       |   |-- ApiError.java
|   |   |   |       |   |-- GlobalExceptionHandler.java
|   |   |   |       |   `-- ResourceNotFoundException.java
|   |   |   |       |-- repository/
|   |   |   |       |   `-- AuthRepository.java
|   |   |   |       |-- security/
|   |   |   |       |   |-- JwtUtil.java
|   |   |   |       |   |-- OAuth2LoginSuccessHandler.java
|   |   |   |       |   `-- SecurityConfig.java
|   |   |   |       `-- service/
|   |   |   |           `-- AuthService.java
|   |   |   `-- resources/
|   |   `-- test/
|   |       `-- java/
|   `-- target/
|-- booking-service/
|   |-- .mvn/
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- pom.xml
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   `-- com/bookingservice/
|   |   |   |       |-- BookingServiceApplication.java
|   |   |   |       |-- config/
|   |   |   |       |   `-- SwaggerConfig.java
|   |   |   |       |-- controller/
|   |   |   |       |   `-- BookingController.java
|   |   |   |       |-- dto/
|   |   |   |       |   `-- BookingDTO.java
|   |   |   |       |-- entity/
|   |   |   |       |   `-- Bookings.java
|   |   |   |       |-- exception/
|   |   |   |       |   |-- ApiError.java
|   |   |   |       |   |-- BadRequestException.java
|   |   |   |       |   |-- GlobalExceptionHandler.java
|   |   |   |       |   `-- ResourceNotFoundException.java
|   |   |   |       |-- repository/
|   |   |   |       |   |-- BookingRepository.java
|   |   |   |       |   |-- HotelClient.java
|   |   |   |       |   `-- UserClient.java
|   |   |   |       |-- security/
|   |   |   |       |   `-- JwtUtil.java
|   |   |   |       `-- service/
|   |   |   |           `-- BookingService.java
|   |   |   `-- resources/
|   |   `-- test/
|   |       `-- java/
|   `-- target/
|-- hotel-service/
|   |-- .mvn/
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- pom.xml
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   `-- com/telusko/hotelservice/
|   |   |   |       |-- HotelServiceApplication.java
|   |   |   |       |-- config/
|   |   |   |       |   |-- JwtAuthenticationFilter.java
|   |   |   |       |   `-- SwaggerConfig.java
|   |   |   |       |-- controller/
|   |   |   |       |   `-- HotelController.java
|   |   |   |       |-- dto/
|   |   |   |       |   `-- HotelDTO.java
|   |   |   |       |-- exception/
|   |   |   |       |   |-- ApiError.java
|   |   |   |       |   |-- GlobalExceptionHandler.java
|   |   |   |       |   `-- ResourceNotFoundException.java
|   |   |   |       |-- mapper/
|   |   |   |       |   `-- HotelMapper.java
|   |   |   |       |-- model/
|   |   |   |       |   `-- Hotel.java
|   |   |   |       |-- repo/
|   |   |   |       |   `-- HotelRepository.java
|   |   |   |       |-- seeder/
|   |   |   |       |   `-- HotelDataSeeder.java
|   |   |   |       `-- service/
|   |   |   |           `-- HotelService.java
|   |   |   `-- resources/
|   |   `-- test/
|   |       `-- java/
|   `-- target/
|-- service-registry/
|   |-- .mvn/
|   |-- mvnw
|   |-- mvnw.cmd
|   |-- pom.xml
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   `-- com/serviceregistry/serviceregistry/
|   |   |   |       `-- ServiceRegistryApplication.java
|   |   |   `-- resources/
|   |   `-- test/
|   |       `-- java/
|   `-- target/
`-- user-service/
    |-- .mvn/
    |-- mvnw
    |-- mvnw.cmd
    |-- pom.xml
    |-- src/
    |   |-- main/
    |   |   |-- java/
    |   |   |   `-- org/example/userservice/
    |   |   |       |-- UserServiceApplication.java
    |   |   |       |-- config/
    |   |   |       |   `-- SwaggerConfig.java
    |   |   |       |-- controller/
    |   |   |       |   `-- UserController.java
    |   |   |       |-- dto/
    |   |   |       |   `-- UserDto.java
    |   |   |       |-- exception/
    |   |   |       |   |-- ApiError.java
    |   |   |       |   |-- GlobalExceptionHandler.java
    |   |   |       |   `-- ResourceNotFoundException.java
    |   |   |       |-- modal/
    |   |   |       |   `-- User.java
    |   |   |       |-- repository/
    |   |   |       |   |-- AuthClient.java
    |   |   |       |   `-- UserRepo.java
    |   |   |       |-- security/
    |   |   |       |   `-- JwtUtil.java
    |   |   |       `-- service/
    |   |   |           `-- UserService.java
    |   |   `-- resources/
    |   `-- test/
    |       `-- java/
    `-- target/
```

## Service Modules

- `api-gateway`: Entry point for client requests and routing.
- `auth-service`: Authentication and authorization logic (for example roles like `ADMIN` and `USER`).
- `booking-service`: Booking workflow and booking-related APIs.
- `hotel-service`: Hotel inventory and hotel-related APIs.
- `service-registry`: Service discovery module for registering and locating microservices.
- `user-service`: User profile and user management APIs.

## Notes

- Each module is an independent Maven project with its own `pom.xml` and Maven wrapper scripts.
- `target/` directories contain generated build artifacts.
- Main application code is under `src/main/java`, configuration under `src/main/resources`, and tests under `src/test/java`.
