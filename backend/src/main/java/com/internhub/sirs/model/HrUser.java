package com.internhub.sirs.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA Entity representing an HR / Employer account in the MySQL 'hr_users' table.
 */
@Entity
@Table(name = "hr_users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_hr_official_email", columnNames = "official_email")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hr_name", nullable = false)
    private String hrName;

    @Column(name = "official_email", nullable = false, unique = true)
    private String officialEmail;

    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_location", nullable = false)
    private String companyLocation;

    @Column(name = "industry")
    private String industry;

    @Column(name = "designation")
    private String designation;

    @Column(name = "employee_id")
    private String employeeId;

    @Builder.Default
    @Column(name = "role", nullable = false)
    private String role = "ROLE_HR";
}
