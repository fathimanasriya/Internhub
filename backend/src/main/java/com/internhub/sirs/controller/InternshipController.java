package com.internhub.sirs.controller;

import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.service.InternshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing CRUD operations for Internship records.
 * Base path: /api/internships
 */
@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@Tag(name = "Internships", description = "Internship Management CRUD APIs")
public class InternshipController {

    private final InternshipService internshipService;

    /**
     * POST /api/internships - Publish a new internship.
     * Restricted to authenticated HR users when authentication is present.
     */
    @PostMapping
    @PreAuthorize("hasRole('HR') or isAnonymous()")
    @Operation(summary = "Create an internship", description = "Publishes a new internship posting and assigns an ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Internship created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed on submitted fields"),
            @ApiResponse(responseCode = "403", description = "Access denied for non-HR role")
    })
    public ResponseEntity<Internship> createInternship(
            @Valid @RequestBody InternshipRequest request,
            Authentication authentication) {
        String hrEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        Internship created = internshipService.createInternship(request, hrEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/internships/my - Get internships posted by current authenticated HR user.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Get HR user's own internships", description = "Returns internships posted by the currently authenticated HR account.")
    public ResponseEntity<List<Internship>> getMyInternships(Authentication authentication) {
        String hrEmail = (authentication != null) ? authentication.getName() : null;
        List<Internship> myInternships = internshipService.getMyInternships(hrEmail);
        return ResponseEntity.ok(myInternships);
    }

    /**
     * GET /api/internships - List all internships, with optional search/filter parameters.
     * Publicly accessible for students and prospective applicants.
     */
    @GetMapping
    @Operation(
        summary = "Get all internships (with optional filters)",
        description = "Returns all internship postings. Supports optional query parameters to filter results."
    )
    @ApiResponse(responseCode = "200", description = "List of matching internships returned")
    public ResponseEntity<List<Internship>> getAllInternships(
            @Parameter(description = "Case-insensitive company name keyword (optional)")
            @RequestParam(required = false) String companyName,

            @Parameter(description = "Case-insensitive role title keyword (optional)")
            @RequestParam(required = false) String role,

            @Parameter(description = "Case-insensitive location keyword (optional)")
            @RequestParam(required = false) String location,

            @Parameter(description = "If true, only includes internships with deadline today or in future")
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {

        List<Internship> internships =
                internshipService.searchInternships(companyName, role, location, activeOnly);
        return ResponseEntity.ok(internships);
    }

    /**
     * GET /api/internships/{id} - Get a specific internship by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get internship by ID", description = "Retrieves an internship matching the given database ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Internship found"),
            @ApiResponse(responseCode = "404", description = "Internship not found with given ID")
    })
    public ResponseEntity<Internship> getInternshipById(
            @Parameter(description = "ID of the internship to retrieve") @PathVariable Long id) {
        Internship internship = internshipService.getInternshipById(id);
        return ResponseEntity.ok(internship);
    }

    /**
     * PUT /api/internships/{id} - Update an existing internship by ID.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR') or isAnonymous()")
    @Operation(summary = "Update an internship", description = "Updates details of an existing internship posting.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Internship updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed on submitted fields"),
            @ApiResponse(responseCode = "403", description = "Forbidden if trying to modify another HR's posting"),
            @ApiResponse(responseCode = "404", description = "Internship not found with given ID")
    })
    public ResponseEntity<Internship> updateInternship(
            @Parameter(description = "ID of the internship to update") @PathVariable Long id,
            @Valid @RequestBody InternshipRequest request,
            Authentication authentication) {
        String hrEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        Internship updated = internshipService.updateInternship(id, request, hrEmail);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/internships/{id} - Delete an internship by ID.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR') or isAnonymous()")
    @Operation(summary = "Delete an internship", description = "Removes an internship posting by its database ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Internship deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden if trying to delete another HR's posting"),
            @ApiResponse(responseCode = "404", description = "Internship not found with given ID")
    })
    public ResponseEntity<Void> deleteInternship(
            @Parameter(description = "ID of the internship to delete") @PathVariable Long id,
            Authentication authentication) {
        String hrEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        internshipService.deleteInternship(id, hrEmail);
        return ResponseEntity.noContent().build();
    }
}
