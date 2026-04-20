# Hotel Booking System

A full-stack hotel booking platform built with Spring Boot microservices and React + Vite frontend. The system enables users to search for hotels, check room availability, make bookings, and manage their reservations.

## Project Structure

```
Hotel-Booking-System-1/
├── HotelBookingBackend/          # Spring Boot Microservices
│   ├── api-gateway/              # API Gateway (Port: 8081)
│   ├── auth-service/             # Authentication Service (Port: 8087)
│   ├── user-service/             # User Management (Port: 8088)
│   ├── hotel-service/            # Hotel & Room Management (Port: 8089)
│   ├── booking-service/          # Booking Management (Port: 8090)
│   └── service-registry/         # Eureka Service Registry (Port: 8761)
├── HotelBookingFrontend/         # React + Vite Frontend
│   └── frontend/                 # React Application (Port: 5173)
└── README.md
```

## Architecture

The application follows a microservices architecture with service-to-service communication:

1. **Frontend** communicates with the **API Gateway**
2. **API Gateway** routes requests to appropriate microservices
3. **Eureka Service Registry** manages service discovery and registration
4. Services communicate with each other using **OpenFeign** clients
5. **Spring Security** with JWT handles authentication across services

## Tech Stack

### Backend

- **Framework**: Spring Boot 3.x
- **Cloud**: Spring Cloud (Eureka, OpenFeign, Cloud Gateway)
- **Security**: Spring Security + JWT Token
- **Database**: MySQL
- **Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Build Tool**: Maven
- **Additional**: Resilience4j, Spring Data JPA

### Frontend

- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI/UX**: Tailwind CSS, React Hot Toast
- **State Management**: React Context API

## Services Overview

### 1. **Service Registry** (Eureka)
- Port: `8761`
- Manages all microservice registrations and discovery
- URL: `http://localhost:8761`

### 2. **API Gateway**
- Port: `8081`
- Routes all client requests to appropriate microservices
- Handles CORS configuration
- Implements JWT authentication filter
- Swagger UI: `http://localhost:8081/swagger-ui.html`

### 3. **Auth Service**
- Port: `8087`
- User registration and login
- JWT token generation
- OAuth2 integration (Google, GitHub)
- Swagger UI: `http://localhost:8087/swagger-ui.html`

### 4. **User Service**
- Port: `8088`
- User profile management
- User information retrieval
- Swagger UI: `http://localhost:8088/swagger-ui.html`

### 5. **Hotel Service**
- Port: `8089`
- Hotel listings and details
- Room availability management
- Room booking event handling
- Swagger UI: `http://localhost:8089/swagger-ui.html`

### 6. **Booking Service**
- Port: `8090`
- Create and manage bookings
- Booking status tracking
- Integration with hotel and user services
- Swagger UI: `http://localhost:8090/swagger-ui.html`

## Database Setup

Create the following MySQL databases before running the services:

```sql
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE hotel_db;
CREATE DATABASE booking_db;
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+ and npm

## Getting Started

### Backend Setup

1. **Start Service Registry** (first priority)
   ```bash
   cd HotelBookingBackend/service-registry
   ./mvnw spring-boot:run
   ```

2. **Start Microservices** (in any order after service-registry is up)
   ```bash
   # Terminal 1 - Auth Service
   cd HotelBookingBackend/auth-service
   ./mvnw spring-boot:run

   # Terminal 2 - User Service
   cd HotelBookingBackend/user-service
   ./mvnw spring-boot:run

   # Terminal 3 - Hotel Service
   cd HotelBookingBackend/hotel-service
   ./mvnw spring-boot:run

   # Terminal 4 - Booking Service
   cd HotelBookingBackend/booking-service
   ./mvnw spring-boot:run

   # Terminal 5 - API Gateway
   cd HotelBookingBackend/api-gateway
   ./mvnw spring-boot:run
   ```

### Frontend Setup

```bash
cd HotelBookingFrontend/frontend
npm install
npm run dev
```

Access the application at: `http://localhost:5173`

## API Endpoints

### API Gateway Base URL
- `http://localhost:8081`

### Main Route Groups

| Service | Endpoint | Description |
|---------|----------|-------------|
| Auth | `/auth/**` | Login, Registration, OAuth |
| Users | `/users/**` | User profile and management |
| Hotels | `/hotel/**` | Hotel listings and details |
| Bookings | `/bookings/**` | Booking operations |

### Authentication

Protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Swagger/OpenAPI Documentation

View API documentation at these URLs:

- **API Gateway**: `http://localhost:8081/swagger-ui.html`
- **Auth Service**: `http://localhost:8087/swagger-ui.html`
- **User Service**: `http://localhost:8088/swagger-ui.html`
- **Hotel Service**: `http://localhost:8089/swagger-ui.html`
- **Booking Service**: `http://localhost:8090/swagger-ui.html`

## Configuration

### Environment Variables

Create `.env` files in each service's resources folder or set environment variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
```

## Features

- ✅ User Registration & Authentication
- ✅ OAuth2 Social Login (Google, GitHub)
- ✅ Hotel Search & Filtering
- ✅ Room Availability Check
- ✅ Booking Management
- ✅ User Profiles
- ✅ Admin Panel
- ✅ JWT-based Security
- ✅ Microservices Architecture
- ✅ API Documentation (Swagger)

## Development Notes

- Each service runs independently with its own database
- Services communicate through API Gateway or direct OpenFeign calls
- Configuration files are externalized using Spring Boot properties
- Sensitive data should be stored in environment variables, not in version control

## Troubleshooting

### Service Registration Issues
- Ensure Service Registry is running first
- Check if services can reach the registry URL

### Database Connection Errors
- Verify MySQL is running
- Confirm databases exist
- Check database credentials in configuration

### Port Already in Use
- Kill the process using the port or change the port in application.properties

## Future Enhancements

- Payment gateway integration
- Email notifications
- Advanced search filters
- Review and rating system
- Multi-currency support

## License

This project is open source and available under the MIT License.
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
