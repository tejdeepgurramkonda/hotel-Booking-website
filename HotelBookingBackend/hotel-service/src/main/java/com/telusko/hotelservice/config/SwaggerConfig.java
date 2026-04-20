package com.telusko.hotelservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI hotelServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hotel Service API")
                        .description("Hotel management, search, and booking endpoints")
                        .version("1.0.0"));
    }
}
