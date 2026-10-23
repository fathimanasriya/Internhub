package com.internhub.sirs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for creating or updating a student.
 * Uses Jakarta Bean Validation to validate user input before processing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {

    @NotBlank(message = "Name is required")
    @Schema(description = "Full name of the student", example = "Alex Johnson")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Schema(description = "Email address of the student", example = "alex.johnson@college.edu")
    private String email;

    @NotBlank(message = "Preferred role is required")
    @Schema(description = "Internship role preferred by the student", example = "Frontend Developer")
    private String preferredRole;
}
