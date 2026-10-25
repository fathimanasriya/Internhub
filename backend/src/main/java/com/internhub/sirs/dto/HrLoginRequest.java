package com.internhub.sirs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for HR / Employer login credentials.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrLoginRequest {

    @NotBlank(message = "Official email is required")
    @Email(message = "Must be a valid email address")
    @Schema(description = "Registered official corporate email", example = "sarah@novatech.com")
    private String officialEmail;

    @NotBlank(message = "Password is required")
    @Schema(description = "Account password", example = "Secret123")
    private String password;
}
