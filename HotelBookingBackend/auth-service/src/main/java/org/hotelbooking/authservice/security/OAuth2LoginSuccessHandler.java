package org.hotelbooking.authservice.security;

import java.io.IOException;
import java.util.Optional;

import org.hotelbooking.authservice.entitiy.Auth;
import org.hotelbooking.authservice.entitiy.Role;
import org.hotelbooking.authservice.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthRepository authRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            // For GitHub, email might be in a different attribute or requires additional API call
            // But let's assume it's "email" or we fallback to "login"
            email = oAuth2User.getAttribute("login") + "@github.com";
        }

        // Check if user exists
        Optional<Auth> authOptional = authRepository.findByEmail(email);
        Auth auth;
        if (authOptional.isPresent()) {
            auth = authOptional.get();
        } else {
            // Create new OAuth2 user
            auth = new Auth();
            auth.setEmail(email);
            auth.setRole(Role.USER); // Default role
            auth.setPassword(""); // No password for OAuth2 users
            auth = authRepository.save(auth);
        }

        // Generate JWT
        String token = jwtUtil.generateToken(auth);

        // Redirect to frontend
        String redirectUrl = String.format("%s/oauth2/redirect?token=%s&userId=%d&email=%s&role=%s",
                frontendUrl, token, auth.getUserId(), auth.getEmail(), auth.getRole().name());
        
        response.sendRedirect(redirectUrl);
    }
}
