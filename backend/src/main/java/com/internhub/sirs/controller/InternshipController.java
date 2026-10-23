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
     */
    @PostMapping
    @Operation(summary = "Create an internship", description = "Publishes a new internship posting and assigns an ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Internship created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed on submitted fields")
    })
    public ResponseEntity<Internship> createInternship(@Valid @RequestBody InternshipRequest request) {
        Internship created = internshipService.createInternship(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/internships - List all internships, with optional search/filter parameters.
     *
     * All parameters are optional. When none are provided, all internships are returned
     * (same as before Milestone 6 — fully backward-compatible).
     *
     * Query parameters:
     *   companyName  – case-insensitive substring match on company name
     *   role         – case-insensitive substring match on role title
     *   location     – case-insensitive substring match on location
     *   activeOnly   – true = only include internships with deadline today or in the future
     *
     * Blank string parameters (e.g. ?companyName=) are treated as absent and ignored.
     * Multiple filters are combined with AND.
     */
    @GetMapping
    @Operation(
        summary = "Get all internships (with optional filters)",
        description = """
            Returns all internship postings. Supports optional query parameters to filter results:

            - **companyName**: case-insensitive substring search (e.g. `?companyName=tech`)
            - **role**: case-insensitive substring search (e.g. `?role=java`)
            - **location**: case-insensitive substring search (e.g. `?location=bangalore`)
            - **activeOnly**: `true` returns only internships whose deadline is today or in the future

            Multiple filters can be combined: `?companyName=apex&role=intern&activeOnly=true`

            When no parameters are provided, all internships are returned (same as before).
            Blank parameter values are ignored.
            """
    )
    @ApiResponse(responseCode = "200", description = "List of matching internships returned (empty list if no matches)")
    public ResponseEntity<List<Internship>> getAllInternships(
            @Parameter(description = "Case-insensitive company name keyword (optional)")
            @RequestParam(required = false) String companyName,

            @Parameter(description = "Case-insensitive role title keyword (optional)")
            @RequestParam(required = false) String role,

            @Parameter(description = "Case-insensitive location keyword (optional)")
            @RequestParam(required = false) String location,

            @Parameter(description = "If true, only includes internships with deadline today or in future (default: false)")
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
    @Operation(summary = "Update an internship", description = "Updates details of an existing internship posting.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Internship updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed on submitted fields"),
            @ApiResponse(responseCode = "404", description = "Internship not found with given ID")
    })
    public ResponseEntity<Internship> updateInternship(
            @Parameter(description = "ID of the internship to update") @PathVariable Long id,
            @Valid @RequestBody InternshipRequest request) {
        Internship updated = internshipService.updateInternship(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/internships/{id} - Delete an internship by ID.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an internship", description = "Removes an internship posting by its database ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Internship deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Internship not found with given ID")
    })
    public ResponseEntity<Void> deleteInternship(
            @Parameter(description = "ID of the internship to delete") @PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.noContent().build();
    }
}
