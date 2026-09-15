package com.jai.resumebuilderapi.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.jai.resumebuilderapi.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // ========================================
    // PASSWORD ENCODER
    // ========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // ========================================
    // SECURITY FILTER CHAIN
    // ========================================

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        http

            // Disable CSRF because JWT is being used
            .csrf(AbstractHttpConfigurer::disable)


            // Enable CORS
            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )


            // ====================================
            // AUTHORIZATION
            // ====================================

            .authorizeHttpRequests(auth -> auth

                // CORS preflight requests
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()


                // ====================================
                // PUBLIC AUTH APIs
                // ====================================

                .requestMatchers(

                    "/api/auth/register",

                    "/api/auth/login",

                    "/api/auth/verify-email",

                    "/api/auth/upload-image",

                    "/api/auth/resend_verification",

                    "/api/auth/forgot-password",

                    "/api/auth/reset-password",

                    "/actuator/**"

                ).permitAll()


                // ====================================
                // ALL OTHER APIs REQUIRE JWT
                // ====================================

                .anyRequest()
                .authenticated()
            )


            // ========================================
            // SESSION MANAGEMENT
            // ========================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )


            // ========================================
            // JWT FILTER
            // ========================================

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }


    // ========================================
    // CORS CONFIGURATION
    // ========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // ========================================
        // ALLOW LOCALHOST ON ANY PORT
        // ========================================

        configuration.setAllowedOriginPatterns(
            Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*"
            )
        );


        // ========================================
        // ALLOWED HTTP METHODS
        // ========================================

        configuration.setAllowedMethods(
            Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );


        // ========================================
        // ALLOWED HEADERS
        // ========================================

        configuration.setAllowedHeaders(
            Arrays.asList("*")
        );


        // ========================================
        // EXPOSED HEADERS
        // ========================================

        configuration.setExposedHeaders(
            Arrays.asList(
                "Authorization"
            )
        );


        // ========================================
        // CREDENTIALS
        // ========================================

        configuration.setAllowCredentials(true);


        // ========================================
        // CORS CACHE
        // ========================================

        configuration.setMaxAge(3600L);


        // ========================================
        // REGISTER CORS CONFIG
        // ========================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
            "/**",
            configuration
        );


        return source;
    }
}