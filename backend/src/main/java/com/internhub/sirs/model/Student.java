package com.internhub.sirs.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA Entity representing a student record in the MySQL 'students' table.
 */
@Entity
@Table(name = "students", uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_email", columnNames = "email")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "preferred_role")
    private String preferredRole;

    /**
     * Stored strictly as a strong BCrypt hash.
     * Never returned in API responses.
     */
    @JsonIgnore
    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "phone")
    private String phone;

    @Column(name = "college")
    private String college;

    @Column(name = "course")
    private String course;

    @Column(name = "department")
    private String department;

    @Column(name = "year_semester")
    private String yearSemester;

    @Column(name = "student_code")
    private String studentCode;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Builder.Default
    @Column(name = "role", nullable = false)
    private String role = "ROLE_STUDENT";
}
