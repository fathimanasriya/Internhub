package com.internhub.sirs.repository;

import com.internhub.sirs.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data repository for Application entities.
 *
 * Spring auto-generates all SQL from the method names — you do not need to write
 * any query code yourself. The method names follow a naming convention:
 *   findBy<FieldPath>  →  SELECT * FROM applications WHERE <column> = ?
 *   existsBy<FieldPath> →  SELECT COUNT(*) > 0 FROM applications WHERE ...
 *   deleteBy<FieldPath> →  DELETE FROM applications WHERE ...
 */
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /**
     * Returns true if a row with this student–internship pair already exists.
     * Used for the duplicate-application business-logic check in the service.
     */
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);

    /**
     * Fetches all applications submitted by a particular student.
     * Used by GET /api/applications/student/{studentId}
     */
    List<Application> findByStudentId(Long studentId);

    /**
     * Fetches all applications received for a particular internship.
     * Used by GET /api/applications/internship/{internshipId}
     */
    List<Application> findByInternshipId(Long internshipId);

    /**
     * Deletes all applications belonging to an internship.
     */
    void deleteByInternshipId(Long internshipId);

    /**
     * Fetches all applications for internships posted by a specific HR user ID.
     */
    List<Application> findByInternshipPostedByHrId(Long hrId);

    /**
     * Deletes all applications belonging to a student.
     * Handy for test cleanup: call this before deleting the student row
     * so foreign-key constraints are not violated.
     */
    void deleteByStudentId(Long studentId);
}
