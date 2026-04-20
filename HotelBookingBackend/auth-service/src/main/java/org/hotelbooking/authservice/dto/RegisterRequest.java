package org.hotelbooking.authservice.dto;

import lombok.Data;
import org.hotelbooking.authservice.entitiy.Role;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private Role role;
}