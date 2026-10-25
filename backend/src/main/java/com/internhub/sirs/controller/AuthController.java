package com.internhub.sirs.controller;

import com.internhub.sirs.dto.AuthResponse;
import com.internhub.sirs.dto.HrLoginRequest;
import com.internhub.sirs.dto.HrRegisterRequest;
import com.internhub.sirs.dto.StudentLoginRequest;
import com.internhub.sirs.dto.StudentRegisterRequest;
import com.internhub.sirs.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing authentication endpoints for Student and HR registration and login.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Student and HR Registration and Login APIs")
public class AuthController {

    private final AuthService authService;

    // Student Auth
    @PostMapping("/student/register")
    @Operation(summary = "Register student", description = "Creates a new student account with securely hashed password and returns a JWT token.")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/student/login")
    @Operation(summary = "Student login", description = "Validates student credentials and returns a signed JWT token.")
    public ResponseEntity<AuthResponse> loginStudent(@Valid @RequestBody StudentLoginRequest request) {
        AuthResponse response = authService.loginStudent(request);
        return ResponseEntity.ok(response);
    }

    // HR Auth
    @PostMapping("/hr/register")
    @Operation(summary = "Register HR user", description = "Creates a new HR employer account with securely hashed password and returns a JWT token.")
    public ResponseEntity<AuthResponse> registerHr(@Valid @RequestBody HrRegisterRequest request) {
        AuthResponse response = authService.registerHr(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/hr/login")
    @Operation(summary = "HR login", description = "Validates HR credentials and returns a signed JWT token.")
    public ResponseEntity<AuthResponse> loginHr(@Valid @RequestBody HrLoginRequest request) {
        AuthResponse response = authService.loginHr(request);
        return ResponseEntity.ok(response);
    }
}
