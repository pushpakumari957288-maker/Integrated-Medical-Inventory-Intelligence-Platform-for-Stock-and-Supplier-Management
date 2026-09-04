package com.medistock.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Test GET request
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working");
    }

    // Test POST request
    @PostMapping("/test-post")
    public ResponseEntity<String> testPost() {
        return ResponseEntity.ok("POST request is working");
    }

    // Login API
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        LoginResponse response = authService.authenticate(request);

        return ResponseEntity.ok(response);
    }
}