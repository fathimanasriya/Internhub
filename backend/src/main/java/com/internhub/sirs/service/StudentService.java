package com.internhub.sirs.service;

import com.internhub.sirs.dto.StudentRequest;
import com.internhub.sirs.exception.DuplicateEmailException;
import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.repository.ApplicationRepository;
import com.internhub.sirs.repository.NotificationRepository;
import com.internhub.sirs.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer handling Student business logic.
 * Uses Spring Data JPA (StudentRepository) for database persistence.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;

    /**
     * Retrieves all registered students from the database.
     *
     * @return list of all students
     */
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Retrieves a single student by their database ID.
     *
     * @param id the student ID to look up
     * @return the matching Student entity
     * @throws ResourceNotFoundException if student does not exist
     */
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    /**
     * Retrieves a single student by their email address.
     */
    @Transactional(readOnly = true)
    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
    }

    /**
     * Creates and persists a new student record in the database.
     *
     * @param request validated student creation request
     * @return the persisted Student entity with generated ID
     */
    public Student createStudent(StudentRequest request) {
        String trimmedEmail = request.getEmail().trim().toLowerCase();

        if (studentRepository.existsByEmail(trimmedEmail)) {
            throw new DuplicateEmailException(trimmedEmail);
        }

        Student student = Student.builder()
                .name(request.getName().trim())
                .email(trimmedEmail)
                .preferredRole(request.getPreferredRole().trim())
                .role("ROLE_STUDENT")
                .build();

        try {
            return studentRepository.save(student);
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateEmailException(trimmedEmail);
        }
    }

    /**
     * Updates an existing student's details in the database.
     *
     * @param id the ID of the student to update
     * @param request validated updated student data
     * @return the updated Student entity
     * @throws ResourceNotFoundException if student does not exist
     */
    public Student updateStudent(Long id, StudentRequest request) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String trimmedEmail = request.getEmail().trim().toLowerCase();

        // If email is changing, verify the new email is not already used by another student
        if (!existing.getEmail().equalsIgnoreCase(trimmedEmail) && studentRepository.existsByEmail(trimmedEmail)) {
            throw new DuplicateEmailException(trimmedEmail);
        }

        existing.setName(request.getName().trim());
        existing.setEmail(trimmedEmail);
        existing.setPreferredRole(request.getPreferredRole().trim());

        try {
            return studentRepository.save(existing);
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateEmailException(trimmedEmail);
        }
    }

    /**
     * Deletes a student from the database by ID.
     *
     * @param id the ID of the student to delete
     * @throws ResourceNotFoundException if student does not exist
     */
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    /**
     * Clears all student records and dependent entities from the database table.
     * Used for isolating test cases safely without FK violations.
     */
    public void clearAll() {
        notificationRepository.deleteAll();
        applicationRepository.deleteAll();
        studentRepository.deleteAll();
    }
}
