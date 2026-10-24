package com.internhub.sirs.exception;

/**
 * Exception thrown when a requested resource (such as a Student) is not found.
 * Handled by GlobalExceptionHandler to return an HTTP 404 Not Found response.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
