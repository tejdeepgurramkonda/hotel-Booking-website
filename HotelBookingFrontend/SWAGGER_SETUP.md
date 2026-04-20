# Swagger API Documentation Setup

## Overview
Swagger UI has been successfully integrated into all microservices to enable API endpoint validation and testing. Each service has its own Swagger documentation UI accessible at a dedicated endpoint.

## Accessing Swagger UI

### User Service
- **Port**: 8088
- **Swagger UI URL**: http://localhost:8088/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8088/v3/api-docs
- **Endpoints**: User management, profile updates, authentication

### Hotel Service
- **Port**: 8089
- **Swagger UI URL**: http://localhost:8089/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8089/v3/api-docs
- **Endpoints**: Hotel CRUD operations, hotel search

### Booking Service
- **Port**: 8090
- **Swagger UI URL**: http://localhost:8090/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8090/v3/api-docs
- **Endpoints**: Booking creation, updates, cancellations

### Auth Service
- **Port**: 8087
- **Swagger UI URL**: http://localhost:8087/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8087/v3/api-docs
- **Endpoints**: Authentication, login, registration, OAuth2

### API Gateway
- **Port**: 8081
- **Swagger UI URL**: http://localhost:8081/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8081/v3/api-docs
- **Purpose**: Central routing gateway

## How to Use Swagger UI

1. **Navigate** to any service's Swagger UI URL in your browser
2. **View** all available endpoints organized by tags
3. **Expand** any endpoint to see detailed information:
   - Description
   - Request parameters
   - Request body schema
   - Response codes and schemas
   - Try it out with the "Try it out" button
4. **Test** endpoints directly from the UI by:
   - Filling in required parameters
   - Providing request body (if needed)
   - Clicking "Execute"
5. **View** the response status, headers, and body

## API Documentation Features

Each endpoint is documented with:
- **Operation Summary**: Brief description of what the endpoint does
- **Operation Description**: Detailed explanation
- **API Responses**: Possible response codes with descriptions
- **Request/Response Schemas**: Data structure documentation
- **Authorization**: Required headers and authentication details

## Example Endpoints

### User Service - Create User
- **Method**: POST
- **Path**: `/users`
- **Required Headers**: 
  - `X-User-Id`: User ID from JWT token
  - `X-User-Email`: User email from JWT token
- **Request Body**: User object JSON

### Hotel Service - Get Hotels
- **Method**: GET
- **Path**: `/hotel`
- **Optional Parameters**: `city` (search by city name)
- **Response**: List of hotels matching criteria

### Booking Service - Create Booking
- **Method**: POST
- **Path**: `/bookings`
- **Required Headers**:
  - `Authorization`: Bearer JWT token
  - `X-User-Id`: User ID
  - `X-User-Role`: User role (USER/ADMIN)
- **Request Body**: Booking DTO with hotel ID, check-in/out dates

## Security Notes

- **Authentication**: Most endpoints require JWT token in Authorization header
- **Authorization**: Some endpoints (Admin operations) require specific roles
- **Headers**: JWT token is automatically parsed and headers injected by API Gateway
- **CORS**: Cross-Origin requests may need specific configuration

## Troubleshooting

1. **Swagger UI Not Loading**
   - Verify the service is running on the correct port
   - Check that springdoc-openapi dependency is added to pom.xml
   - Verify `springdoc.swagger-ui.enabled=true` in application.properties

2. **Missing Endpoints**
   - Ensure @Operation and @ApiResponse annotations are added to controller methods
   - Rebuild the service after adding annotations
   - Check that the controller is properly mapped with @RestController

3. **Authentication Issues**
   - Provide valid JWT token in the Authorization header
   - Ensure X-User-Id and X-User-Role headers are set
   - Test with Admin credentials for admin-only endpoints

## Configuration

The following properties are configured in each service's `application.properties`:
```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.operations-sorter=method
```

## Next Steps

1. Start all services (Eureka, API Gateway, all microservices)
2. Navigate to http://localhost:8081/swagger-ui.html (API Gateway Swagger)
3. Test endpoints using the Swagger UI
4. Review error responses and fix any data consistency issues
5. Use Swagger documentation as the source of truth for API contracts
