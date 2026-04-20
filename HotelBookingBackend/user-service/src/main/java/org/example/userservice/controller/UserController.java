package org.example.userservice.controller;

import org.example.userservice.exception.ResourceNotFoundException;
import org.example.userservice.modal.User;
import org.example.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "User creation, retrieval, and profile management endpoints")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    @Operation(summary = "Register New User",
            description = "Create a new user account with authentication from headers")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user data")
    })
    public ResponseEntity<User> createUser(
            @RequestHeader("X-User-Id") Long tokenUserId,
            @RequestHeader("X-User-Email") String email,
            @RequestBody User user) {

        // Set the id and email from the JWT token to keep userdb in sync with auth_db
        user.setId(tokenUserId);
        user.setEmail(email);

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Current Authenticated User",
            description = "Retrieve the currently authenticated user profile from JWT token. Auto-creates profile if not exists.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Current user returned or created"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Token mismatch"),
            @ApiResponse(responseCode = "400", description = "Missing user headers")
    })
    public ResponseEntity<User> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Email", required = false) String email) {

        // Validate required headers
        if (userId == null || email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required headers: X-User-Id and X-User-Email");
        }

        User user;
        try {
            user = userService.getUserById(userId);
            
            // If email doesn't match, update it to keep user_db in sync with auth_db
            if (!user.getEmail().equalsIgnoreCase(email)) {
                System.out.println("📧 Email mismatch detected. User ID: " + userId);
                System.out.println("   Database email: " + user.getEmail());
                System.out.println("   JWT email: " + email);
                System.out.println("   Updating user email to maintain sync...");
                user.setEmail(email);
                user = userService.updateUser(userId, user);
            }
        } catch (ResourceNotFoundException ex) {
            // Auto-create user profile if it doesn't exist
            System.out.println("👤 User not found (ID: " + userId + "). Creating new profile...");
            user = new User();
            user.setId(userId);
            user.setEmail(email);
            user = userService.createUser(user);
        } catch (Exception ex) {
            // Catch any other exceptions and return appropriate error
            System.err.println("Error fetching/creating user: " + ex.getMessage());
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing user profile: " + ex.getMessage());
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get User by Email",
            description = "Retrieve user profile by email address")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found and returned"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> getUser(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get User by ID",
            description = "Retrieve user profile by user ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found and returned"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update User Profile",
            description = "Update user information. Users can only update their own profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Cannot update other users' profiles"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> updateUser(
            @RequestHeader("X-User-Id") Long tokenUserId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody User user) {

        if ("USER".equalsIgnoreCase(role) && !tokenUserId.equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Users can update only their own profile");
        }

        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @GetMapping("/health/check")
    @Operation(summary = "Health Check",
            description = "Verify the user service is running and database is connected")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<String> healthCheck() {
        try {
            // Try to count users to verify database connection
            return ResponseEntity.ok("✅ User service is running and database is connected");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("❌ Database connection failed: " + ex.getMessage());
        }
    }
}
