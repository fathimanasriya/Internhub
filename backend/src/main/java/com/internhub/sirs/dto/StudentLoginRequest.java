package com.internhub.sirs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for student login credentials.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentLoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Schema(description = "Registered student email", example = "alex.johnson@college.edu")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "Account password", example = "Secret123")
    private String password;
}
