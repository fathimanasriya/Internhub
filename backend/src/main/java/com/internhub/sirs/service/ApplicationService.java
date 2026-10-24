package com.internhub.sirs.service;

import com.internhub.sirs.dto.ApplicationRequest;
import com.internhub.sirs.exception.DuplicateApplicationException;
import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.Application;
import com.internhub.sirs.model.ApplicationStatus;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.repository.ApplicationRepository;
import com.internhub.sirs.repository.InternshipRepository;
import com.internhub.sirs.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Business-logic layer for Application operations.
 *
 * All database access goes through repositories.
 * @Transactional ensures that if something fails mid-way, the DB rolls back cleanly.
 */
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository     studentRepository;
    private final InternshipRepository  internshipRepository;

    // ------------------------------------------------------------------ //
    //  CREATE                                                              //
    // ------------------------------------------------------------------ //

    /**
     * Submits a new internship application.
     *
     * Business rules enforced here (in order):
     *   1. Student must exist.
     *   2. Internship must exist.
     *   3. The internship application deadline must NOT be before today
     *      (applications ON the deadline date are still accepted).
     *   4. The student must not have already applied for this internship.
     *   5. Initial status is always APPLIED — clients cannot choose it.
     *
     * @param request  validated DTO from the controller
     * @return         the saved Application entity
     */
    @Transactional
    public Application apply(ApplicationRequest request) {

        // 1. Verify the student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + request.getStudentId()));

        // 2. Verify the internship exists
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Internship not found with id: " + request.getInternshipId()));

        // 3. Deadline check — reject if the deadline is strictly before today
        LocalDate today = LocalDate.now();
        if (internship.getApplicationDeadline().isBefore(today)) {
            throw new IllegalArgumentException(
                    "The application deadline for this internship has passed ("
                    + internship.getApplicationDeadline() + "). Applications are no longer accepted.");
        }

        // 4. Duplicate check (service-level, fast path)
        if (applicationRepository.existsByStudentIdAndInternshipId(
                request.getStudentId(), request.getInternshipId())) {
            throw new DuplicateApplicationException(
                    request.getStudentId(), request.getInternshipId());
        }

        // 5. Build and persist the application
        Application application = Application.builder()
                .student(student)
                .internship(internship)
                .status(ApplicationStatus.APPLIED)   // always starts as APPLIED
                .appliedDate(LocalDateTime.now())
                .notes(request.getNotes())
                .build();

        try {
            return applicationRepository.save(application);
        } catch (DataIntegrityViolationException ex) {
            // Safety net: if a race condition slips past the service-level check,
            // the DB unique constraint fires. We translate it to the same 409 response.
            throw new DuplicateApplicationException(
                    request.getStudentId(), request.getInternshipId());
        }
    }

    // ------------------------------------------------------------------ //
    //  READ                                                                //
    // ------------------------------------------------------------------ //

    /** Returns every application in the system. */
    @Transactional(readOnly = true)
    public List<Application> findAll() {
        return applicationRepository.findAll();
    }

    /**
     * Returns one application by its ID, or throws 404.
     */
    @Transactional(readOnly = true)
    public Application findById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));
    }

    /**
     * Returns all applications submitted by a given student.
     * Throws 404 if the student does not exist at all.
     */
    @Transactional(readOnly = true)
    public List<Application> findByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException(
                    "Student not found with id: " + studentId);
        }
        return applicationRepository.findByStudentId(studentId);
    }

    /**
     * Returns all applications for a given internship.
     * Throws 404 if the internship does not exist at all.
     */
    @Transactional(readOnly = true)
    public List<Application> findByInternship(Long internshipId) {
        if (!internshipRepository.existsById(internshipId)) {
            throw new ResourceNotFoundException(
                    "Internship not found with id: " + internshipId);
        }
        return applicationRepository.findByInternshipId(internshipId);
    }

    // ------------------------------------------------------------------ //
    //  UPDATE                                                              //
    // ------------------------------------------------------------------ //

    /**
     * Updates the status of an existing application.
     *
     * NOTE: This endpoint is NOT protected by authentication.
     * In a future milestone, status changes should be restricted to HR/Admin users.
     *
     * @param id      the application ID
     * @param status  the new status to assign
     * @return        the updated Application entity
     */
    @Transactional
    public Application updateStatus(Long id, ApplicationStatus status) {
        Application application = findById(id);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    // ------------------------------------------------------------------ //
    //  DELETE                                                              //
    // ------------------------------------------------------------------ //

    /**
     * Deletes a single application by ID.
     * Throws 404 if the application does not exist.
     */
    @Transactional
    public void delete(Long id) {
        Application application = findById(id);
        applicationRepository.delete(application);
    }

    /**
     * Deletes ALL applications. Used only during automated test cleanup.
     * IMPORTANT: Call this BEFORE deleting students or internships so FK constraints
     * are not violated.
     */
    @Transactional
    public void clearAll() {
        applicationRepository.deleteAll();
    }
}
