package com.internhub.sirs.repository;

import com.internhub.sirs.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for Student entities.
 * Automatically provides CRUD operations against the MySQL 'students' table.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Finds a student by their email address.
     */
    Optional<Student> findByEmail(String email);

    /**
     * Checks if a student with the given email already exists.
     */
    boolean existsByEmail(String email);
}
