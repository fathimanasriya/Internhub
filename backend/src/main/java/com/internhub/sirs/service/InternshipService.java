package com.internhub.sirs.service;

import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.repository.ApplicationRepository;
import com.internhub.sirs.repository.HrUserRepository;
import com.internhub.sirs.repository.InternshipRepository;
import com.internhub.sirs.repository.InternshipSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer handling Internship business logic and database persistence.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final HrUserRepository hrUserRepository;
    private final ApplicationRepository applicationRepository;

    /**
     * Retrieves all available internships.
     *
     * @return list of all internships
     */
    @Transactional(readOnly = true)
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    /**
     * Retrieves an internship by its database ID.
     *
     * @param id the ID of the internship to retrieve
     * @return the matching Internship entity
     * @throws ResourceNotFoundException if the internship is not found
     */
    @Transactional(readOnly = true)
    public Internship getInternshipById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + id));
    }

    /**
     * Creates and persists a new internship record.
     * Optional userEmail associates the internship with the authenticated HR user.
     *
     * @param request validated internship creation data
     * @param hrEmail optional email of authenticated HR user
     * @return the persisted Internship entity with assigned ID
     */
    public Internship createInternship(InternshipRequest request, String hrEmail) {
        HrUser hrUser = null;
        String companyName = request.getCompanyName().trim();

        if (hrEmail != null && !hrEmail.isBlank()) {
            hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(hrEmail).orElse(null);
            if (hrUser != null && (companyName.isBlank() || companyName.equalsIgnoreCase("string"))) {
                companyName = hrUser.getCompanyName();
            }
        }

        Internship internship = Internship.builder()
                .companyName(companyName)
                .role(request.getRole().trim())
                .location(request.getLocation().trim())
                .description(request.getDescription().trim())
                .eligibility(request.getEligibility().trim())
                .applicationDeadline(request.getApplicationDeadline())
                .postedByHr(hrUser)
                .build();

        return internshipRepository.save(internship);
    }

    /**
     * Overload for backward compatibility with existing tests.
     */
    public Internship createInternship(InternshipRequest request) {
        return createInternship(request, null);
    }

    /**
     * Retrieves all internships posted by a specific HR user.
     *
     * @param hrEmail the email of the HR user
     * @return list of internships owned by the HR user
     */
    @Transactional(readOnly = true)
    public List<Internship> getMyInternships(String hrEmail) {
        HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(hrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("HR user not found with email: " + hrEmail));
        return internshipRepository.findByPostedByHrId(hrUser.getId());
    }

    /**
     * Updates an existing internship posting with ownership verification.
     *
     * @param id the ID of the internship to update
     * @param request validated updated internship data
     * @param hrEmail authenticated user email
     * @return the updated Internship entity
     * @throws ResourceNotFoundException if the internship is not found
     * @throws AccessDeniedException if the user does not own the internship
     */
    public Internship updateInternship(Long id, InternshipRequest request, String hrEmail) {
        Internship existing = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + id));

        verifyOwnership(existing, hrEmail);

        existing.setCompanyName(request.getCompanyName().trim());
        existing.setRole(request.getRole().trim());
        existing.setLocation(request.getLocation().trim());
        existing.setDescription(request.getDescription().trim());
        existing.setEligibility(request.getEligibility().trim());
        existing.setApplicationDeadline(request.getApplicationDeadline());

        return internshipRepository.save(existing);
    }

    /**
     * Overload for backward compatibility.
     */
    public Internship updateInternship(Long id, InternshipRequest request) {
        return updateInternship(id, request, null);
    }

    /**
     * Deletes an internship posting by ID with ownership verification.
     * Also safely removes linked applications to prevent foreign-key constraint violations.
     *
     * @param id the ID of the internship to delete
     * @param hrEmail authenticated user email
     * @throws ResourceNotFoundException if the internship is not found
     * @throws AccessDeniedException if the user does not own the internship
     */
    public void deleteInternship(Long id, String hrEmail) {
        Internship existing = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + id));

        verifyOwnership(existing, hrEmail);

        // Delete associated applications first to respect foreign-key constraints
        applicationRepository.deleteByInternshipId(id);

        internshipRepository.delete(existing);
    }

    /**
     * Overload for backward compatibility.
     */
    public void deleteInternship(Long id) {
        deleteInternship(id, null);
    }

    private void verifyOwnership(Internship existing, String hrEmail) {
        // If hrEmail is provided and the internship is owned by an HR user, ensure ownership matches
        if (hrEmail != null && !hrEmail.isBlank() && existing.getPostedByHr() != null) {
            if (!existing.getPostedByHr().getOfficialEmail().equalsIgnoreCase(hrEmail)) {
                throw new AccessDeniedException("You are not authorized to modify an internship posted by another recruiter");
            }
        }
    }

    /**
     * Finds internships by company name (case-insensitive substring search).
     */
    @Transactional(readOnly = true)
    public List<Internship> getInternshipsByCompanyName(String companyName) {
        return internshipRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    /**
     * Finds internships by role title (case-insensitive substring search).
     */
    @Transactional(readOnly = true)
    public List<Internship> getInternshipsByRole(String role) {
        return internshipRepository.findByRoleContainingIgnoreCase(role);
    }

    /**
     * Combined multi-parameter filter search for internships.
     */
    @Transactional(readOnly = true)
    public List<Internship> searchInternships(
            String companyName,
            String role,
            String location,
            boolean activeOnly) {

        Specification<Internship> spec = Specification.where(null);

        if (companyName != null && !companyName.trim().isEmpty()) {
            spec = spec.and(InternshipSpecification.companyNameContains(companyName.trim()));
        }
        if (role != null && !role.trim().isEmpty()) {
            spec = spec.and(InternshipSpecification.roleContains(role.trim()));
        }
        if (location != null && !location.trim().isEmpty()) {
            spec = spec.and(InternshipSpecification.locationContains(location.trim()));
        }
        if (activeOnly) {
            spec = spec.and(InternshipSpecification.isActive());
        }

        return internshipRepository.findAll(spec);
    }

    /**
     * Clears all internship records from the database.
     */
    public void clearAll() {
        internshipRepository.deleteAll();
    }
}
