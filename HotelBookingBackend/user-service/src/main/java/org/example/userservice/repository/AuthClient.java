package org.example.userservice.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "auth-service")
public interface AuthClient {

    @GetMapping("/auth/{id}")
    @CircuitBreaker(name = "authService", fallbackMethod = "getUserByIdFallback")
    @Retry(name = "authService", fallbackMethod = "getUserByIdFallback")
    Object getUserById(@PathVariable Long id);

    default Object getUserByIdFallback(Long id, Throwable throwable) {
        return "Auth Service is unavailable. Please try again later.";
    }
}
