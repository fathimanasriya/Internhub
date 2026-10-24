package com.internhub.sirs.exception;

/**
 * Thrown when a student tries to apply to the same internship more than once.
 * The GlobalExceptionHandler maps this to HTTP 409 Conflict.
 */
public class DuplicateApplicationException extends RuntimeException {

    public DuplicateApplicationException(Long studentId, Long internshipId) {
        super(String.format(
                "Student with id %d has already applied for internship with id %d.",
                studentId, internshipId));
    }
}
