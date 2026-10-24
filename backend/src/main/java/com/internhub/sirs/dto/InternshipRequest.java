package com.internhub.sirs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for creating or updating an internship posting.
 * Uses Jakarta Bean Validation to ensure all required fields and valid dates are provided.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipRequest {

    @NotBlank(message = "Company name is required")
    @Schema(description = "Name of the hiring organization", example = "TechNova Solutions")
    private String companyName;

    @NotBlank(message = "Role is required")
    @Schema(description = "Internship position title", example = "Frontend React Developer Intern")
    private String role;

    @NotBlank(message = "Location is required")
    @Schema(description = "Work location or work mode", example = "Remote / Bangalore")
    private String location;

    @NotBlank(message = "Description is required")
    @Schema(description = "Detailed role overview and responsibilities", example = "Collaborate with engineers to develop responsive web applications.")
    private String description;

    @NotBlank(message = "Eligibility criteria is required")
    @Schema(description = "Candidate qualifications and academic requirements", example = "B.Tech or MCA student with foundational knowledge of React and JavaScript.")
    private String eligibility;

    @NotNull(message = "Application deadline is required")
    @FutureOrPresent(message = "Application deadline must be today or in the future")
    @Schema(description = "Cutoff date for accepting applications (YYYY-MM-DD)", example = "2026-12-31")
    private LocalDate applicationDeadline;
}
