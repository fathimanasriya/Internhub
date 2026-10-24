package com.internhub.sirs.model;

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

    @Column(name = "preferred_role", nullable = false)
    private String preferredRole;
}
