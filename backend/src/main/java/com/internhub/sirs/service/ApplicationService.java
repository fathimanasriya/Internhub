package com.internhub.sirs.service;

import com.internhub.sirs.dto.ApplicationRequest;
import com.internhub.sirs.exception.DuplicateApplicationException;
import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.Application;
import com.internhub.sirs.model.ApplicationStatus;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.repository.ApplicationRepository;
import com.internhub.sirs.repository.HrUserRepository;
import com.internhub.sirs.repository.InternshipRepository;
import com.internhub.sirs.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
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
    private final HrUserRepository      hrUserRepository;
    private final NotificationService   notificationService;

    // ------------------------------------------------------------------ //
    //  CREATE                                                              //
    // ------------------------------------------------------------------ //

    /**
     * Submits a new internship application with optional authenticated student email verification.
     *
     * Business rules enforced here (in order):
     *   1. Student must exist (and match authenticated user if authenticated).
     *   2. Internship must exist.
     *   3. The internship application deadline must NOT be before today
     *      (applications ON the deadline date are still accepted).
     *   4. The student must not have already applied for this internship.
     *   5. Initial status is always APPLIED — clients cannot choose it.
     *
     * @param request       validated DTO from the controller
     * @param studentEmail  optional authenticated student email
     * @return              the saved Application entity
     */
    @Transactional
    public Application apply(ApplicationRequest request, String studentEmail) {
        // 1. Verify the student exists
        Student student;
        if (studentEmail != null && !studentEmail.isBlank()) {
            student = studentRepository.findByEmail(studentEmail.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Authenticated student not found: " + studentEmail));
            if (request.getStudentId() != null && !request.getStudentId().equals(student.getId())) {
                throw new AccessDeniedException("You cannot submit an application on behalf of another student.");
            }
        } else {
            if (request.getStudentId() == null) {
                throw new IllegalArgumentException("studentId is required");
            }
            student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + request.getStudentId()));
        }

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
                student.getId(), request.getInternshipId())) {
            throw new DuplicateApplicationException(
                    student.getId(), request.getInternshipId());
        }

        // 5. Build and persist the application
        Application application = Application.builder()
                .student(student)
                .internship(internship)
                .status(ApplicationStatus.APPLIED)   // always starts as APPLIED
                .appliedDate(LocalDateTime.now())
                .notes(request.getNotes())
                .build();

        Application savedApplication;
        try {
            savedApplication = applicationRepository.save(application);
        } catch (DataIntegrityViolationException ex) {
            // Safety net: if a race condition slips past the service-level check,
            // the DB unique constraint fires. We translate it to the same 409 response.
            throw new DuplicateApplicationException(
                    student.getId(), request.getInternshipId());
        }

        // 6. Real-time Notifications:
        // A) Notify the student that their application was submitted
        notificationService.notifyStudent(
                student,
                "Application Submitted",
                "Your application for " + internship.getRole() + " at " + internship.getCompanyName() + " was successfully submitted.",
                internship.getRole(),
                savedApplication.getId(),
                internship.getId()
        );

        // B) Notify the HR owner who posted this internship (if posted by a registered HR)
        if (internship.getPostedByHr() != null) {
            notificationService.notifyHr(
                    internship.getPostedByHr(),
                    "New Application Received",
                    student.getName() + " applied for " + internship.getRole() + ".",
                    internship.getRole(),
                    savedApplication.getId(),
                    internship.getId()
            );
        }

        return savedApplication;
    }

    /**
     * Backward-compatible overload for existing tests and unauthenticated calls.
     */
    @Transactional
    public Application apply(ApplicationRequest request) {
        return apply(request, null);
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

    /**
     * Returns all applications for internships posted by the specified HR user.
     *
     * @param hrEmail the official email of the HR recruiter
     * @return list of applications for the HR user's internships
     */
    @Transactional(readOnly = true)
    public List<Application> findByHrEmail(String hrEmail) {
        HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(hrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("HR user not found with email: " + hrEmail));
        return applicationRepository.findByInternshipPostedByHrId(hrUser.getId());
    }

    /**
     * Updates the status of an existing application with HR ownership verification.
     *
     * @param id      the application ID
     * @param status  the new status to assign
     * @param hrEmail authenticated HR email (or null for backward compatibility)
     * @return the updated Application entity
     */
    @Transactional
    public Application updateStatus(Long id, ApplicationStatus status, String hrEmail) {
        Application application = findById(id);

        if (hrEmail != null && !hrEmail.isBlank()) {
            HrUser owner = application.getInternship() != null ? application.getInternship().getPostedByHr() : null;
            if (owner != null && !owner.getOfficialEmail().equalsIgnoreCase(hrEmail)) {
                throw new AccessDeniedException("You are not authorized to update applications for an internship posted by another recruiter");
            }
        }

        // Avoid duplicate notification if the status did not actually change
        if (application.getStatus() == status) {
            return application;
        }

        application.setStatus(status);
        Application updated = applicationRepository.save(application);

        // Notify student of status update
        String role = updated.getInternship() != null ? updated.getInternship().getRole() : "Internship";
        String company = updated.getInternship() != null ? updated.getInternship().getCompanyName() : "Company";
        String statusTitle;
        String statusMessage;

        switch (status) {
            case SHORTLISTED -> {
                statusTitle = "Application Shortlisted";
                statusMessage = "Congratulations! Your application for " + role + " at " + company + " has been shortlisted.";
            }
            case REJECTED -> {
                statusTitle = "Application Status Update";
                statusMessage = "Your application for " + role + " at " + company + " was not selected at this time.";
            }
            case UNDER_REVIEW -> {
                statusTitle = "Application Under Review";
                statusMessage = "Your application for " + role + " at " + company + " is currently under review.";
            }
            default -> {
                statusTitle = "Application Status Changed";
                statusMessage = "Your application for " + role + " status has changed to " + status + ".";
            }
        }

        notificationService.notifyStudent(
                updated.getStudent(),
                statusTitle,
                statusMessage,
                role,
                updated.getId(),
                updated.getInternship() != null ? updated.getInternship().getId() : null
        );

        return updated;
    }

    /**
     * Updates the status of an existing application.
     * Backward-compatible overload.
     *
     * @param id      the application ID
     * @param status  the new status to assign
     * @return        the updated Application entity
     */
    @Transactional
    public Application updateStatus(Long id, ApplicationStatus status) {
        return updateStatus(id, status, null);
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
