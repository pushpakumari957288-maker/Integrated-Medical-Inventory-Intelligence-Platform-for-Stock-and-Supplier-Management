package com.medistock.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.entity.User;
import com.medistock.repository.UserRepository;
import com.medistock.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse authenticate(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (user.getActive() != null && !user.getActive()) {
            throw new RuntimeException("User account is inactive");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRoleId()
        );

        return new LoginResponse(
                token,
                user.getUserId(),
                user.getUsername(),
                user.getRoleId()
        );
    }
}