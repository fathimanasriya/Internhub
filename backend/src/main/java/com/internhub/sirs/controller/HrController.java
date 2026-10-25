package com.internhub.sirs.controller;

import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.repository.HrUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for HR profile operations.
 */
@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
@Tag(name = "HR Profile", description = "Endpoints for authenticated HR recruiter profiles")
public class HrController {

    private final HrUserRepository hrUserRepository;

    /**
     * GET /api/hr/me - Retrieves current authenticated HR profile.
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Get current HR profile", description = "Returns the authenticated HR user's profile based on the JWT token.")
    public ResponseEntity<HrUser> getCurrentHr(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResourceNotFoundException("No authenticated HR user in current context");
        }

        String email = authentication.getName();
        HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("HR user profile not found for email: " + email));

        return ResponseEntity.ok(hrUser);
    }
}
