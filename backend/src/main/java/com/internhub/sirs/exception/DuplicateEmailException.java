package com.internhub.sirs.exception;

/**
 * Thrown when attempting to register or update a student with an email that is already in use.
 * Handled by GlobalExceptionHandler to return HTTP 409 Conflict.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super(String.format("A student with email '%s' already exists.", email));
    }
}
