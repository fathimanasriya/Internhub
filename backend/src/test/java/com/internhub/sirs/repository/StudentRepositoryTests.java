package com.internhub.sirs.repository;

import com.internhub.sirs.model.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
class StudentRepositoryTests {

    @Autowired
    private StudentRepository studentRepository;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
    }

    @Test
    @DisplayName("Save and find student by ID in repository")
    void testSaveAndFindById() {
        Student student = Student.builder()
                .name("Sarah Connor")
                .email("sarah@college.edu")
                .preferredRole("DevOps Engineer")
                .build();

        Student saved = studentRepository.save(student);

        assertThat(saved.getId()).isNotNull();
        Optional<Student> found = studentRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Sarah Connor");
        assertThat(found.get().getEmail()).isEqualTo("sarah@college.edu");
    }

    @Test
    @DisplayName("Find student by email and check existence")
    void testFindByEmailAndExistsByEmail() {
        Student student = Student.builder()
                .name("John Doe")
                .email("john.doe@college.edu")
                .preferredRole("Data Scientist")
                .build();

        studentRepository.save(student);

        assertThat(studentRepository.existsByEmail("john.doe@college.edu")).isTrue();
        assertThat(studentRepository.existsByEmail("nonexistent@college.edu")).isFalse();

        Optional<Student> found = studentRepository.findByEmail("john.doe@college.edu");
        assertThat(found).isPresent();
        assertThat(found.get().getPreferredRole()).isEqualTo("Data Scientist");
    }

    @Test
    @DisplayName("Find all students in repository")
    void testFindAll() {
        studentRepository.save(Student.builder().name("Student 1").email("s1@college.edu").preferredRole("QA").build());
        studentRepository.save(Student.builder().name("Student 2").email("s2@college.edu").preferredRole("Dev").build());

        List<Student> students = studentRepository.findAll();
        assertThat(students).hasSize(2);
    }

    @Test
    @DisplayName("Delete student from repository")
    void testDelete() {
        Student student = studentRepository.save(Student.builder().name("Temp").email("temp@college.edu").preferredRole("Role").build());
        Long id = student.getId();

        studentRepository.deleteById(id);

        assertThat(studentRepository.findById(id)).isEmpty();
    }

    @Test
    @DisplayName("Enforce unique constraint on student email at database level")
    void testUniqueEmailConstraint() {
        Student student1 = Student.builder()
                .name("Alex 1")
                .email("duplicate@college.edu")
                .preferredRole("Frontend")
                .build();
        studentRepository.saveAndFlush(student1);

        Student student2 = Student.builder()
                .name("Alex 2")
                .email("duplicate@college.edu")
                .preferredRole("Backend")
                .build();

        assertThatThrownBy(() -> studentRepository.saveAndFlush(student2))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
