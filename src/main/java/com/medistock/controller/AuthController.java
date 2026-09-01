package com.medistock.controller;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.dto.RegisterRequest;
import com.medistock.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // ME
    @GetMapping("/me")
    public ResponseEntity<?> me(
            org.springframework.security.core.Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                Map.of(
                        "email", email
                )
        );
    }
}