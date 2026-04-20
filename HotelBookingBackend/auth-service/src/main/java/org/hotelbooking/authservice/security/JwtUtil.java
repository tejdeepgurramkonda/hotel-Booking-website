package org.hotelbooking.authservice.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.hotelbooking.authservice.entitiy.Auth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expirationMs}")
    private long expirationMs;

    @PostConstruct
    public void debugSecret() {
        System.out.println(">>> JWT Secret value: [" + secret + "]");

        System.out.println(">>> JWT Secret length: " + (secret != null ? secret.trim().length() : "NULL"));

    }

    private Key getSigningKey(){
        byte[] keyBytes = secret == null ? new byte[0] : secret.trim().getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("Invalid jwt.secret: key must be at least 32 characters (256 bits for HS256)");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Auth auth){
        return Jwts.builder()
                .setSubject(auth.getEmail())
                .addClaims(Map.of(
                        "userId", auth.getUserId(),
                        "email", auth.getEmail(),
                        "role", auth.getRole().name()
                ))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Long extractUserId(String token) {
        Object userId = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("userId");

        if (userId instanceof Integer) {
            return ((Integer) userId).longValue();
        }
        return (Long) userId;
    }

    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }



}
