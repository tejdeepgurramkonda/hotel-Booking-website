# StayEase - Hotel Booking Microservices System

Luxe is a hotel booking platform built with Spring Boot microservices and a React + Vite frontend.

## Architecture

The application follows a service-discovery microservices pattern:

1. Frontend calls the API Gateway.
2. API Gateway routes to individual services.
3. Eureka tracks all service registrations.

## Tech Stack

### Backend

- Spring Boot 3.5.x
- Spring Cloud 2025.x
- Eureka (service registry)
- Spring Cloud Gateway MVC
- Spring Security + JWT
- OpenFeign + Resilience4j
- MySQL
- SpringDoc OpenAPI / Swagger UI

### Frontend

- React 19
- Vite 8
- React Router DOM 7
- Axios
- React Hot Toast

## Services and Ports

- service-registry: 8761
- api-gateway: 8081
- auth-service: 8087
- user-service: 8088
- hotel-service: 8089
- booking-service: 8090
- frontend (Vite dev): 5173

## Databases

Create these MySQL databases before running services:

- auth_db
- user_db
- hotel_db
- booking_db

## Run Locally

Start services in this order:

1. service-registry
2. auth-service
3. user-service
4. hotel-service
5. booking-service
6. api-gateway
7. frontend


### Frontend Commands

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## API Access

Use gateway base URL for client calls:

- http://localhost:8081

Main route groups:

- /auth/**
- /users/**
- /hotel/**
- /bookings/**

Authentication header for protected endpoints:

- Authorization: Bearer <jwt_token>

## Swagger / OpenAPI

Swagger UI:

- API Gateway: http://localhost:8081/swagger-ui.html
- Auth: http://localhost:8087/swagger-ui.html
- User: http://localhost:8088/swagger-ui.html
- Hotel: http://localhost:8089/swagger-ui.html
- Booking: http://localhost:8090/swagger-ui.html

OpenAPI docs:

- Gateway: http://localhost:8081/v3/api-docs
- Auth: http://localhost:8087/v3/api-docs
- User: http://localhost:8088/v3/api-docs
- Hotel: http://localhost:8089/v3/api-docs
- Booking: http://localhost:8090/v3/api-docs

## Notes

- Service configuration values in each module's application.properties are the source of truth.
- Frontend hotel fallbacks currently use direct public image URLs via frontend/src/utils/hotelImages.js.
