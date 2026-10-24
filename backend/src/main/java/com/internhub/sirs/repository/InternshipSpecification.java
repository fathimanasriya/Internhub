package com.internhub.sirs.repository;

import com.internhub.sirs.model.Internship;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

/**
 * Static factory class for building JPA Specification predicates for Internship filtering.
 *
 * What is a Specification?
 *   A Specification is a small object that describes ONE SQL condition (e.g. "company name contains X").
 *   Multiple Specifications can be combined with .and() / .or() to build a full WHERE clause.
 *   Each method below returns an independent, reusable condition.
 *
 * Why use this instead of writing SQL?
 *   - Each filter is optional. Specifications can be chained only when needed.
 *   - Much safer than building SQL strings manually (no SQL injection risk).
 *   - Spring Data JPA handles all the actual SQL generation.
 *
 * Usage example (in service):
 *   Specification<Internship> spec = Specification.where(companyNameContains("tech"))
 *                                                  .and(isActive());
 *   List<Internship> results = repository.findAll(spec);
 */
public class InternshipSpecification {

    // Private constructor — this class is a utility class, not meant to be instantiated.
    private InternshipSpecification() {}

    /**
     * Filter: company name contains the given keyword (case-insensitive substring match).
     *
     * SQL equivalent: WHERE LOWER(company_name) LIKE LOWER('%keyword%')
     *
     * @param keyword the search term to look for inside the company name
     * @return a Specification that matches internships whose company name contains the keyword
     */
    public static Specification<Internship> companyNameContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            // cb.like() with cb.lower() makes the search case-insensitive
            String pattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("companyName")),
                    pattern
            );
        };
    }

    /**
     * Filter: role contains the given keyword (case-insensitive substring match).
     *
     * SQL equivalent: WHERE LOWER(role) LIKE LOWER('%keyword%')
     *
     * @param keyword the search term to look for inside the role title
     * @return a Specification that matches internships whose role contains the keyword
     */
    public static Specification<Internship> roleContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("role")),
                    pattern
            );
        };
    }

    /**
     * Filter: location contains the given keyword (case-insensitive substring match).
     *
     * SQL equivalent: WHERE LOWER(location) LIKE LOWER('%keyword%')
     *
     * @param keyword the search term to look for inside the location field
     * @return a Specification that matches internships whose location contains the keyword
     */
    public static Specification<Internship> locationContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")),
                    pattern
            );
        };
    }

    /**
     * Filter: only return internships whose application deadline is today or in the future.
     *
     * SQL equivalent: WHERE application_deadline >= CURRENT_DATE
     *
     * - Deadline = today  → INCLUDED (student can still apply today)
     * - Deadline = yesterday → EXCLUDED (deadline has passed)
     *
     * @return a Specification that matches only internships that are still accepting applications
     */
    public static Specification<Internship> isActive() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(
                        root.get("applicationDeadline"),
                        LocalDate.now()
                );
    }

    /**
     * Convenience method: combine all four optional filters into one Specification.
     *
     * Each parameter is optional. If a string parameter is null or blank it is skipped.
     * If activeOnly is false the deadline filter is skipped.
     *
     * Returns a Specification that always starts from Specification.where(null) —
     * a safe no-op that returns all rows when no conditions are added — and then
     * adds each enabled condition with AND.
     *
     * This pattern is safe with all versions of Spring Data JPA 3.x because we
     * never pass raw null to repository.findAll(); we always pass a real Specification object.
     *
     * @param companyName filter term for company name (null or blank = ignore)
     * @param role        filter term for role title   (null or blank = ignore)
     * @param location    filter term for location     (null or blank = ignore)
     * @param activeOnly  true = only include internships with deadline >= today
     * @return a combined Specification representing all active filters
     */
    public static Specification<Internship> buildFilter(
            String companyName,
            String role,
            String location,
            boolean activeOnly) {

        // Start with a no-op Specification (matches everything).
        // Using Specification.where(null) instead of raw null keeps the object
        // non-null so we can always safely call .and() on it.
        Specification<Internship> spec = Specification.where(
                (Specification<Internship>) (root, query, cb) -> null  // TRUE / no condition
        );

        if (companyName != null && !companyName.isBlank()) {
            spec = spec.and(companyNameContains(companyName));
        }

        if (role != null && !role.isBlank()) {
            spec = spec.and(roleContains(role));
        }

        if (location != null && !location.isBlank()) {
            spec = spec.and(locationContains(location));
        }

        if (activeOnly) {
            spec = spec.and(isActive());
        }

        return spec;
    }
}
