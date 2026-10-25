package com.internhub.sirs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * JPA Entity representing an internship opportunity in the MySQL 'internships' table.
 */
@Entity
@Table(name = "internships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String eligibility;

    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    /**
     * The HR account who posted this internship.
     * Nullable to ensure backward compatibility with existing records or tests.
     * EAGER loading prevents LazyInitializationException during JSON serialization
     * when spring.jpa.open-in-view=false.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "posted_by_hr_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private HrUser postedByHr;
}
