package com.internhub.sirs.dto;

import com.internhub.sirs.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Data Transfer Object for updating the status of an existing application.
 *
 * Example JSON body:
 *   { "status": "SHORTLISTED" }
 *
 * Valid values: APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED
 *
 * NOTE: This endpoint is NOT protected by authentication in the current milestone.
 *       In a future milestone, status changes should be restricted to HR/Admin users.
 */
@Data
public class ApplicationStatusUpdateRequest {

    /** The new status to assign. Must be a valid ApplicationStatus value. */
    @NotNull(message = "status is required")
    private ApplicationStatus status;
}
