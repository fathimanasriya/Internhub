package com.internhub.sirs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for HR / Employer registration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrRegisterRequest {

    @NotBlank(message = "HR name is required")
    @Schema(description = "Full name of HR / Recruiter", example = "Sarah Mitchell")
    private String hrName;

    @NotBlank(message = "Official email is required")
    @Email(message = "Must be a valid email address")
    @Schema(description = "Official corporate email", example = "sarah@novatech.com")
    private String officialEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Schema(description = "Account password", example = "Secret123")
    private String password;

    @NotBlank(message = "Phone is required")
    @Schema(description = "Contact phone number", example = "+91 98765 12345")
    private String phone;

    @NotBlank(message = "Company name is required")
    @Schema(description = "Organization name", example = "NovaTech Labs Pvt Ltd")
    private String companyName;

    @NotBlank(message = "Company location is required")
    @Schema(description = "Corporate location", example = "Bengaluru, Karnataka")
    private String companyLocation;

    private String industry;
    private String designation;
    private String employeeId;
}
