package com.internhub.sirs.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Object for submitting a new internship application.
 *
 * The client sends:
 *   - studentId    : which student is applying
 *   - internshipId : which internship they are applying for
 *   - notes        : optional cover-letter / extra info (max 1000 characters)
 *
 * The application STATUS is NOT included here — it is always set to APPLIED
 * automatically by the service. Clients cannot choose the initial status.
 */
@Data
public class ApplicationRequest {

    /** ID of the student who is applying. Must be provided. */
    @NotNull(message = "studentId is required")
    private Long studentId;

    /** ID of the internship being applied for. Must be provided. */
    @NotNull(message = "internshipId is required")
    private Long internshipId;

    /** Optional notes or cover letter text (max 1 000 characters). */
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
