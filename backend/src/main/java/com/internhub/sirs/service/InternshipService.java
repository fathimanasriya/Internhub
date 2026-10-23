package com.internhub.sirs.service;

import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.repository.InternshipRepository;
import com.internhub.sirs.repository.InternshipSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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
     *
     * @param request validated internship creation data
     * @return the persisted Internship entity with assigned ID
     */
    public Internship createInternship(InternshipRequest request) {
        Internship internship = Internship.builder()
                .companyName(request.getCompanyName().trim())
                .role(request.getRole().trim())
                .location(request.getLocation().trim())
                .description(request.getDescription().trim())
                .eligibility(request.getEligibility().trim())
                .applicationDeadline(request.getApplicationDeadline())
                .build();

        return internshipRepository.save(internship);
    }

    /**
     * Updates an existing internship posting.
     *
     * @param id the ID of the internship to update
     * @param request validated updated internship data
     * @return the updated Internship entity
     * @throws ResourceNotFoundException if the internship is not found
     */
    public Internship updateInternship(Long id, InternshipRequest request) {
        Internship existing = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + id));

        existing.setCompanyName(request.getCompanyName().trim());
        existing.setRole(request.getRole().trim());
        existing.setLocation(request.getLocation().trim());
        existing.setDescription(request.getDescription().trim());
        existing.setEligibility(request.getEligibility().trim());
        existing.setApplicationDeadline(request.getApplicationDeadline());

        return internshipRepository.save(existing);
    }

    /**
     * Deletes an internship posting by ID.
     *
     * @param id the ID of the internship to delete
     * @throws ResourceNotFoundException if the internship is not found
     */
    public void deleteInternship(Long id) {
        if (!internshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Internship not found with ID: " + id);
        }
        internshipRepository.deleteById(id);
    }

    /**
     * Clears all internship records from the database table.
     * Used for isolating test cases (only affects the internships table).
     */
    public void clearAll() {
        internshipRepository.deleteAll();
    }

    /**
     * Searches and filters internships based on optional criteria.
     *
     * Each parameter is optional:
     *   - If a String parameter is null or blank, that filter is ignored.
     *   - If activeOnly is false, expired internships are included.
     *   - If NO parameters are provided at all, this method returns every internship
     *     (identical behaviour to getAllInternships()).
     *
     * Combining filters:
     *   All active conditions are joined with AND, so a result must satisfy every
     *   provided filter simultaneously.
     *
     * @param companyName search keyword for company name (null/blank = ignore)
     * @param role        search keyword for role title   (null/blank = ignore)
     * @param location    search keyword for location     (null/blank = ignore)
     * @param activeOnly  true = only include internships with deadline >= today
     * @return filtered list of matching internships (empty list if no matches — never null)
     */
    @Transactional(readOnly = true)
    public List<Internship> searchInternships(
            String companyName,
            String role,
            String location,
            boolean activeOnly) {

        Specification<Internship> spec =
                InternshipSpecification.buildFilter(companyName, role, location, activeOnly);

        return internshipRepository.findAll(spec);
    }
}
