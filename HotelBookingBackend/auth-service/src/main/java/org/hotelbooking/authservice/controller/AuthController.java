package org.hotelbooking.authservice.controller;


import lombok.RequiredArgsConstructor;
import org.hotelbooking.authservice.dto.AuthResponse;
import org.hotelbooking.authservice.dto.LoginRequest;
import org.hotelbooking.authservice.dto.RegisterRequest;
import org.hotelbooking.authservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request){
        String message = authService.registeruser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        AuthResponse response = authService.loginuser(request);
        return ResponseEntity.ok(response);
    }

}
