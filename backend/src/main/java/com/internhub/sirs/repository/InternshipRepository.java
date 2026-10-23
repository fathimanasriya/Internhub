package com.internhub.sirs.repository;

import com.internhub.sirs.model.Internship;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Internship entities.
 * Manages database operations against the MySQL 'internships' table.
 *
 * JpaSpecificationExecutor adds the findAll(Specification) method used by
 * the search / filter feature introduced in Milestone 6.
 * The two existing findBy… methods are kept unchanged.
 */
@Repository
public interface InternshipRepository
        extends JpaRepository<Internship, Long>,
                JpaSpecificationExecutor<Internship> {

    /**
     * Finds internships by matching company name (case-insensitive substring search).
     */
    List<Internship> findByCompanyNameContainingIgnoreCase(String companyName);

    /**
     * Finds internships by matching role title (case-insensitive substring search).
     */
    List<Internship> findByRoleContainingIgnoreCase(String role);
}
