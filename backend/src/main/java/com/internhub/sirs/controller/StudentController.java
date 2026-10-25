package com.internhub.sirs.controller;

import com.internhub.sirs.dto.StudentRequest;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing CRUD operations for Student records.
 * Base path: /api/students
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student Management CRUD APIs")
public class StudentController {

    private final StudentService studentService;

    /**
     * GET /api/students/me - Retrieve authenticated student profile.
     */
    @GetMapping("/me")
    @Operation(summary = "Get current student profile", description = "Retrieves the profile of the currently authenticated student via Bearer token.")
    public ResponseEntity<Student> getCurrentStudent(Authentication authentication) {
        String email = authentication.getName();
        Student student = studentService.getStudentByEmail(email);
        return ResponseEntity.ok(student);
    }

    /**
     * POST /api/students - Create a new student.
     */
    @PostMapping
    @Operation(summary = "Create a new student", description = "Registers a new student record and assigns a unique ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Student created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or validation error")
    })
    public ResponseEntity<Student> createStudent(@Valid @RequestBody StudentRequest request) {
        Student created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/students - Retrieve all students.
     */
    @GetMapping
    @Operation(summary = "Get all students", description = "Returns a list of all registered students.")
    @ApiResponse(responseCode = "200", description = "List of students returned successfully")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    /**
     * GET /api/students/{id} - Retrieve a specific student by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID", description = "Retrieves a student record matching the given ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Student found"),
            @ApiResponse(responseCode = "404", description = "Student not found with given ID")
    })
    public ResponseEntity<Student> getStudentById(
            @Parameter(description = "ID of the student to fetch") @PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    /**
     * PUT /api/students/{id} - Update an existing student by ID.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student", description = "Updates the student matching the given ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Student updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or validation error"),
            @ApiResponse(responseCode = "404", description = "Student not found with given ID")
    })
    public ResponseEntity<Student> updateStudent(
            @Parameter(description = "ID of the student to update") @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        Student updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/students/{id} - Delete a student by ID.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student", description = "Removes the student record matching the given ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Student deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Student not found with given ID")
    })
    public ResponseEntity<Void> deleteStudent(
            @Parameter(description = "ID of the student to delete") @PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
