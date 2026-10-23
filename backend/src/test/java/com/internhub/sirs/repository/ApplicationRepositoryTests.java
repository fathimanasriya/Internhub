package com.internhub.sirs.repository;

import com.internhub.sirs.model.Application;
import com.internhub.sirs.model.ApplicationStatus;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.model.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Isolated JPA tests for ApplicationRepository.
 *
 * @DataJpaTest spins up only the JPA layer (H2 in-memory DB) — no servlet,
 * no full Spring context. Every test runs in a transaction that rolls back
 * after the test finishes, so tests cannot interfere with each other.
 */
@DataJpaTest
class ApplicationRepositoryTests {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private StudentRepository     studentRepository;
    @Autowired private InternshipRepository  internshipRepository;

    private Student    student;
    private Internship internship;

    /**
     * Before each test, create a fresh Student and Internship to link applications to.
     * @DataJpaTest rolls these back after each test — no manual cleanup needed.
     */
    @BeforeEach
    void setUp() {
        student = studentRepository.save(
            Student.builder()
                .name("Arjun Kumar")
                .email("arjun@test.com")
                .preferredRole("Backend Developer")
                .build()
        );

        internship = internshipRepository.save(
            Internship.builder()
                .companyName("TechCorp")
                .role("Java Intern")
                .location("Chennai")
                .description("Java Spring Boot internship")
                .eligibility("3rd year CSE students")
                .applicationDeadline(LocalDate.now().plusDays(30))
                .build()
        );
    }

    // ------------------------------------------------------------------ //

    @Test
    void shouldSaveAndRetrieveApplication() {
        Application app = Application.builder()
                .student(student)
                .internship(internship)
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDateTime.now())
                .notes("Excited to join!")
                .build();

        Application saved = applicationRepository.save(app);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
        assertThat(saved.getNotes()).isEqualTo("Excited to join!");
    }

    // ------------------------------------------------------------------ //

    @Test
    void shouldFindApplicationsByStudentId() {
        applicationRepository.save(Application.builder()
                .student(student).internship(internship)
                .status(ApplicationStatus.APPLIED).appliedDate(LocalDateTime.now())
                .build());

        List<Application> results = applicationRepository.findByStudentId(student.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStudent().getId()).isEqualTo(student.getId());
    }

    // ------------------------------------------------------------------ //

    @Test
    void shouldFindApplicationsByInternshipId() {
        applicationRepository.save(Application.builder()
                .student(student).internship(internship)
                .status(ApplicationStatus.APPLIED).appliedDate(LocalDateTime.now())
                .build());

        List<Application> results = applicationRepository.findByInternshipId(internship.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getInternship().getId()).isEqualTo(internship.getId());
    }

    // ------------------------------------------------------------------ //

    @Test
    void existsByStudentIdAndInternshipId_shouldReturnTrueWhenDuplicateExists() {
        applicationRepository.save(Application.builder()
                .student(student).internship(internship)
                .status(ApplicationStatus.APPLIED).appliedDate(LocalDateTime.now())
                .build());

        boolean exists = applicationRepository.existsByStudentIdAndInternshipId(
                student.getId(), internship.getId());

        assertThat(exists).isTrue();
    }

    // ------------------------------------------------------------------ //

    @Test
    void existsByStudentIdAndInternshipId_shouldReturnFalseWhenNoDuplicate() {
        boolean exists = applicationRepository.existsByStudentIdAndInternshipId(
                student.getId(), internship.getId());

        assertThat(exists).isFalse();
    }

    // ------------------------------------------------------------------ //

    @Test
    void shouldEnforceUniqueConstraintAtDatabaseLevel() {
        // Save the first application successfully
        applicationRepository.save(Application.builder()
                .student(student).internship(internship)
                .status(ApplicationStatus.APPLIED).appliedDate(LocalDateTime.now())
                .build());

        // Flush to the DB so the constraint is checked immediately
        applicationRepository.flush();

        // Attempting a second application for the same student + internship should fail
        Application duplicate = Application.builder()
                .student(student).internship(internship)
                .status(ApplicationStatus.APPLIED).appliedDate(LocalDateTime.now())
                .build();

        assertThatThrownBy(() -> {
            applicationRepository.save(duplicate);
            applicationRepository.flush();
        }).isInstanceOf(DataIntegrityViolationException.class);
    }
}
