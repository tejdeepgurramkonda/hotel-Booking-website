package com.bookingservice.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    @Retry(name = "userService", fallbackMethod = "getUserFallback")
    Object getUser(@PathVariable Long id, @RequestHeader("Authorization") String authorization);

    default Object getUserFallback(Long id, String authorization, Throwable throwable) {
        return "User Service is unavailable. Please try again later.";
    }
}