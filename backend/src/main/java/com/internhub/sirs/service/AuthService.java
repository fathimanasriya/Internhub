package com.internhub.sirs.service;

import com.internhub.sirs.dto.AuthResponse;
import com.internhub.sirs.dto.HrLoginRequest;
import com.internhub.sirs.dto.HrRegisterRequest;
import com.internhub.sirs.dto.StudentLoginRequest;
import com.internhub.sirs.dto.StudentRegisterRequest;
import com.internhub.sirs.exception.DuplicateEmailException;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.repository.HrUserRepository;
import com.internhub.sirs.repository.StudentRepository;
import com.internhub.sirs.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service managing authentication for both Students and HR users:
 * registration, credential validation, password hashing, and JWT token issuance.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final StudentRepository studentRepository;
    private final HrUserRepository hrUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // =========================================================================
    // STUDENT AUTHENTICATION
    // =========================================================================

    /**
     * Registers a new student, securely hashes the password with BCrypt,
     * persists the profile, and returns a signed JWT with ROLE_STUDENT.
     */
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        String trimmedEmail = request.getEmail().trim().toLowerCase();

        if (studentRepository.existsByEmail(trimmedEmail)) {
            throw new DuplicateEmailException(trimmedEmail);
        }

        String preferredRole = request.getPreferredRole();
        if (preferredRole == null || preferredRole.isBlank()) {
            preferredRole = request.getCourse() != null && !request.getCourse().isBlank()
                    ? request.getCourse().trim()
                    : "Student";
        }

        Student student = Student.builder()
                .name(request.getFullName().trim())
                .email(trimmedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .college(request.getCollege() != null ? request.getCollege().trim() : null)
                .course(request.getCourse() != null ? request.getCourse().trim() : null)
                .department(request.getDepartment() != null ? request.getDepartment().trim() : null)
                .yearSemester(request.getYearSemester() != null ? request.getYearSemester().trim() : null)
                .studentCode(request.getStudentId() != null ? request.getStudentId().trim() : null)
                .skills(request.getSkills() != null ? request.getSkills().trim() : null)
                .preferredRole(preferredRole)
                .role("ROLE_STUDENT")
                .build();

        try {
            Student saved = studentRepository.save(student);
            String token = jwtService.generateToken(saved.getEmail(), saved.getRole(), saved.getId());
            return AuthResponse.builder()
                    .token(token)
                    .student(saved)
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateEmailException(trimmedEmail);
        }
    }

    /**
     * Authenticates student credentials and issues a signed JWT.
     * Prevents HR users from authenticating through the student login flow.
     */
    @Transactional(readOnly = true)
    public AuthResponse loginStudent(StudentLoginRequest request) {
        String trimmedEmail = request.getEmail().trim().toLowerCase();

        Student student = studentRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (student.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), student.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(student.getEmail(), student.getRole(), student.getId());
        return AuthResponse.builder()
                .token(token)
                .student(student)
                .build();
    }

    // =========================================================================
    // HR AUTHENTICATION
    // =========================================================================

    /**
     * Registers a new HR user, securely hashes the password with BCrypt,
     * persists the profile, and returns a signed JWT with ROLE_HR.
     */
    public AuthResponse registerHr(HrRegisterRequest request) {
        String trimmedEmail = request.getOfficialEmail().trim().toLowerCase();

        if (hrUserRepository.existsByOfficialEmailIgnoreCase(trimmedEmail)) {
            throw new DuplicateEmailException(trimmedEmail);
        }

        HrUser hrUser = HrUser.builder()
                .hrName(request.getHrName().trim())
                .officialEmail(trimmedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone().trim())
                .companyName(request.getCompanyName().trim())
                .companyLocation(request.getCompanyLocation().trim())
                .industry(request.getIndustry() != null ? request.getIndustry().trim() : null)
                .designation(request.getDesignation() != null ? request.getDesignation().trim() : null)
                .employeeId(request.getEmployeeId() != null ? request.getEmployeeId().trim() : null)
                .role("ROLE_HR")
                .build();

        try {
            HrUser saved = hrUserRepository.save(hrUser);
            String token = jwtService.generateToken(saved.getOfficialEmail(), saved.getRole(), saved.getId());
            return AuthResponse.builder()
                    .token(token)
                    .hrUser(saved)
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateEmailException(trimmedEmail);
        }
    }

    /**
     * Authenticates HR credentials and issues a signed JWT with ROLE_HR.
     * Prevents students from authenticating through the HR login flow.
     */
    @Transactional(readOnly = true)
    public AuthResponse loginHr(HrLoginRequest request) {
        String trimmedEmail = request.getOfficialEmail().trim().toLowerCase();

        HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(trimmedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (hrUser.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), hrUser.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(hrUser.getOfficialEmail(), hrUser.getRole(), hrUser.getId());
        return AuthResponse.builder()
                .token(token)
                .hrUser(hrUser)
                .build();
    }
}
