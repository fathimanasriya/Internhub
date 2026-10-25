package com.internhub.sirs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

/**
 * Represents a student's application for a specific internship.
 *
 * Each row links one Student to one Internship.
 * A student cannot apply to the same internship twice — enforced both in
 * ApplicationService (business-logic check) and by the database unique constraint
 * on (student_id, internship_id).
 */
@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(
            name  = "uk_student_internship",
            columnNames = {"student_id", "internship_id"}
        )
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    /** Auto-generated primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The student who applied.
     * FetchType.EAGER ensures safe serialization with open-in-view=false.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private Student student;

    /**
     * The internship being applied for.
     * FetchType.EAGER ensures safe serialization with open-in-view=false.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "internship_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Internship internship;

    /**
     * Current status of the application.
     * EnumType.STRING stores the name ("APPLIED", "SHORTLISTED", …) in the DB
     * instead of an integer, making the data human-readable.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    /** Timestamp when the application was submitted. Set automatically by the service. */
    @Column(nullable = false)
    private LocalDateTime appliedDate;

    /**
     * Optional notes or cover letter text from the student.
     * Stored as TEXT so it can hold longer content.
     */
    @Column(columnDefinition = "TEXT")
    private String notes;
}
