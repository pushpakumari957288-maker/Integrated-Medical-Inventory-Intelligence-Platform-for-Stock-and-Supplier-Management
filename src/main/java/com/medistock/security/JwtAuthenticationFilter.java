package com.medistock.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String token = null;

        // Check if Authorization header contains Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            token = authHeader.substring(7);

            try {
                email = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // Invalid token
            }
        }

        // Validate token and set authentication
        if (email != null
                && SecurityContextHolder.getContext().getAuthentication() == null
                && jwtUtil.validateToken(token)) {

            String role = jwtUtil.extractRole(token);

            List<GrantedAuthority> authorities = role != null
                    ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    : List.of();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}