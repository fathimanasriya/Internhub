package com.internhub.sirs.model;

/**
 * Represents the lifecycle stages of a student's internship application.
 *
 * APPLIED       – The student has just submitted the application (default status).
 * UNDER_REVIEW  – HR or the company is reviewing the application.
 * SHORTLISTED   – The applicant passed the initial screening.
 * REJECTED      – The application was not successful.
 *
 * NOTE: Status transitions are not yet protected by authentication.
 *       In a future milestone this should be restricted so that only HR/Admin
 *       users can change status beyond APPLIED.
 */
public enum ApplicationStatus {
    APPLIED,
    UNDER_REVIEW,
    SHORTLISTED,
    REJECTED
}
