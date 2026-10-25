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
 * DTO for student registration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegisterRequest {

    @NotBlank(message = "Full name is required")
    @Schema(description = "Full name of the student", example = "Alex Johnson")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Schema(description = "Email address of the student", example = "alex.johnson@college.edu")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Schema(description = "Account password", example = "Secret123")
    private String password;

    private String phone;
    private String college;
    private String course;
    private String department;
    private String yearSemester;
    private String studentId;
    private String skills;
    private String preferredRole;
}
