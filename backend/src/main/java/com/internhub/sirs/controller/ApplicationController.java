package com.internhub.sirs.controller;

import com.internhub.sirs.dto.ApplicationRequest;
import com.internhub.sirs.dto.ApplicationStatusUpdateRequest;
import com.internhub.sirs.model.Application;
import com.internhub.sirs.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
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
 * REST controller exposing the Internship Application endpoints.
 *
 * Base path: /api/applications
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Internship application submission and tracking")
public class ApplicationController {

    private final ApplicationService applicationService;

    // ------------------------------------------------------------------ //
    //  POST /api/applications  — submit a new application                 //
    // ------------------------------------------------------------------ //

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') or isAnonymous()")
    @Operation(
        summary = "Submit an internship application",
        description = """
            A student submits an application for an internship.

            Rules enforced:
            - Both studentId and internshipId must refer to existing records.
            - The internship's applicationDeadline must not be in the past
              (applications on the deadline date itself are still accepted).
            - A student may not apply to the same internship twice (HTTP 409 Conflict).
            - The initial status is always set to APPLIED automatically.
            """
    )
    public ResponseEntity<Application> apply(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {
        String studentEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        Application saved = applicationService.apply(request, studentEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ------------------------------------------------------------------ //
    //  GET /api/applications  — list all applications                     //
    // ------------------------------------------------------------------ //

    @GetMapping
    @Operation(
        summary = "List all applications",
        description = "Returns every application in the system, regardless of status."
    )
    public ResponseEntity<List<Application>> findAll() {
        return ResponseEntity.ok(applicationService.findAll());
    }

    // ------------------------------------------------------------------ //
    //  GET /api/applications/{id}  — get one application                  //
    // ------------------------------------------------------------------ //

    @GetMapping("/{id}")
    @Operation(
        summary = "Get application by ID",
        description = "Returns a single application. Returns 404 if not found."
    )
    public ResponseEntity<Application> findById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.findById(id));
    }

    // ------------------------------------------------------------------ //
    //  GET /api/applications/hr/my  — get applications for HR's postings  //
    // ------------------------------------------------------------------ //

    @GetMapping("/hr/my")
    @PreAuthorize("hasRole('HR')")
    @Operation(
        summary = "Get all applications for current HR recruiter",
        description = "Returns every application received for internships posted by the authenticated HR user."
    )
    public ResponseEntity<List<Application>> findMyHrApplications(Authentication authentication) {
        String hrEmail = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(applicationService.findByHrEmail(hrEmail));
    }

    // ------------------------------------------------------------------ //
    //  GET /api/applications/student/my  — get current student's apps     //
    // ------------------------------------------------------------------ //

    @GetMapping("/student/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(
        summary = "Get all applications for currently authenticated student",
        description = "Returns every application submitted by the authenticated student based on their JWT token."
    )
    public ResponseEntity<List<Application>> findMyStudentApplications(Authentication authentication) {
        String studentEmail = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(applicationService.findByStudentEmail(studentEmail));
    }

    // ------------------------------------------------------------------ //
    //  GET /api/applications/student/{studentId}                          //
    // ------------------------------------------------------------------ //

    @GetMapping("/student/{studentId}")
    @Operation(
        summary = "Get all applications for a student",
        description = "Returns every application submitted by the given student. Returns 404 if the student does not exist."
    )
    public ResponseEntity<List<Application>> findByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.findByStudent(studentId));
    }

    // ------------------------------------------------------------------ //
    //  GET /api/applications/internship/{internshipId}                    //
    // ------------------------------------------------------------------ //

    @GetMapping("/internship/{internshipId}")
    @Operation(
        summary = "Get all applications for an internship",
        description = "Returns every application received for the given internship. Returns 404 if the internship does not exist."
    )
    public ResponseEntity<List<Application>> findByInternship(@PathVariable Long internshipId) {
        return ResponseEntity.ok(applicationService.findByInternship(internshipId));
    }

    // ------------------------------------------------------------------ //
    //  PATCH /api/applications/{id}/status  — update status               //
    // ------------------------------------------------------------------ //

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('HR') or isAnonymous()")
    @Operation(
        summary = "Update application status",
        description = """
            Updates the status of an existing application.

            Valid status values: APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED
            """
    )
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request,
            Authentication authentication) {
        String hrEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        Application updated = applicationService.updateStatus(id, request.getStatus(), hrEmail);
        return ResponseEntity.ok(updated);
    }

    // ------------------------------------------------------------------ //
    //  DELETE /api/applications/{id}                                      //
    // ------------------------------------------------------------------ //

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete an application",
        description = "Permanently removes an application. Returns 204 No Content on success, 404 if not found."
    )
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        applicationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
