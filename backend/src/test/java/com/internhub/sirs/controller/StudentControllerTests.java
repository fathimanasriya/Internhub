package com.internhub.sirs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internhub.sirs.dto.StudentRequest;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StudentControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        // Reset in-memory student store before each test for clean isolation
        studentService.clearAll();
    }

    @Test
    @DisplayName("POST /api/students creates student successfully with 201 Created")
    void testCreateStudent_Success() throws Exception {
        StudentRequest request = StudentRequest.builder()
                .name("Alex Johnson")
                .email("alex.johnson@college.edu")
                .preferredRole("Frontend Developer")
                .build();

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Alex Johnson")))
                .andExpect(jsonPath("$.email", is("alex.johnson@college.edu")))
                .andExpect(jsonPath("$.preferredRole", is("Frontend Developer")));
    }

    @Test
    @DisplayName("POST /api/students returns 400 Bad Request when name is blank")
    void testCreateStudent_ValidationFailure_BlankName() throws Exception {
        StudentRequest request = StudentRequest.builder()
                .name("")
                .email("alex@college.edu")
                .preferredRole("Frontend Developer")
                .build();

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.validationErrors.name", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/students returns 400 Bad Request when email format is invalid")
    void testCreateStudent_ValidationFailure_InvalidEmail() throws Exception {
        StudentRequest request = StudentRequest.builder()
                .name("Alex Johnson")
                .email("not-a-valid-email")
                .preferredRole("Frontend Developer")
                .build();

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.validationErrors.email", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/students returns 400 Bad Request when preferredRole is blank")
    void testCreateStudent_ValidationFailure_BlankRole() throws Exception {
        StudentRequest request = StudentRequest.builder()
                .name("Alex Johnson")
                .email("alex@college.edu")
                .preferredRole("   ")
                .build();

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.validationErrors.preferredRole", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/students returns all students with 200 OK")
    void testGetAllStudents_Success() throws Exception {
        studentService.createStudent(new StudentRequest("Alice Smith", "alice@college.edu", "Data Analyst"));
        studentService.createStudent(new StudentRequest("Bob Jones", "bob@college.edu", "Backend Developer"));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Alice Smith")))
                .andExpect(jsonPath("$[1].name", is("Bob Jones")));
    }

    @Test
    @DisplayName("GET /api/students/{id} returns student with 200 OK")
    void testGetStudentById_Success() throws Exception {
        Student created = studentService.createStudent(
                new StudentRequest("Charlie Brown", "charlie@college.edu", "UI/UX Designer"));

        mockMvc.perform(get("/api/students/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.name", is("Charlie Brown")))
                .andExpect(jsonPath("$.email", is("charlie@college.edu")))
                .andExpect(jsonPath("$.preferredRole", is("UI/UX Designer")));
    }

    @Test
    @DisplayName("GET /api/students/{id} returns 404 Not Found when ID does not exist")
    void testGetStudentById_NotFound() throws Exception {
        mockMvc.perform(get("/api/students/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("Student not found with ID: 99999")));
    }

    @Test
    @DisplayName("PUT /api/students/{id} updates existing student with 200 OK")
    void testUpdateStudent_Success() throws Exception {
        Student created = studentService.createStudent(
                new StudentRequest("David Miller", "david@college.edu", "QA Engineer"));

        StudentRequest updatePayload = StudentRequest.builder()
                .name("David Miller Jr.")
                .email("david.jr@college.edu")
                .preferredRole("Senior QA Engineer")
                .build();

        mockMvc.perform(put("/api/students/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.name", is("David Miller Jr.")))
                .andExpect(jsonPath("$.email", is("david.jr@college.edu")))
                .andExpect(jsonPath("$.preferredRole", is("Senior QA Engineer")));
    }

    @Test
    @DisplayName("PUT /api/students/{id} returns 404 Not Found when ID does not exist")
    void testUpdateStudent_NotFound() throws Exception {
        StudentRequest updatePayload = StudentRequest.builder()
                .name("Ghost User")
                .email("ghost@college.edu")
                .preferredRole("DevOps")
                .build();

        mockMvc.perform(put("/api/students/{id}", 99999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    @Test
    @DisplayName("PUT /api/students/{id} returns 400 Bad Request when update payload is invalid")
    void testUpdateStudent_ValidationFailure() throws Exception {
        Student created = studentService.createStudent(
                new StudentRequest("Eva Green", "eva@college.edu", "Cloud Engineer"));

        StudentRequest invalidPayload = StudentRequest.builder()
                .name("") // blank name
                .email("eva@college.edu")
                .preferredRole("Cloud Engineer")
                .build();

        mockMvc.perform(put("/api/students/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPayload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.validationErrors.name", notNullValue()));
    }

    @Test
    @DisplayName("DELETE /api/students/{id} removes student with 204 No Content")
    void testDeleteStudent_Success() throws Exception {
        Student created = studentService.createStudent(
                new StudentRequest("Frank Wright", "frank@college.edu", "Full Stack"));

        mockMvc.perform(delete("/api/students/{id}", created.getId()))
                .andExpect(status().isNoContent());

        // Subsequent GET should return 404
        mockMvc.perform(get("/api/students/{id}", created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/students/{id} returns 404 Not Found when ID does not exist")
    void testDeleteStudent_NotFound() throws Exception {
        mockMvc.perform(delete("/api/students/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    @Test
    @DisplayName("POST /api/students returns 409 Conflict when email already exists")
    void testCreateStudent_DuplicateEmailReturns409() throws Exception {
        StudentRequest first = StudentRequest.builder()
                .name("Alice First")
                .email("alice@college.edu")
                .preferredRole("Frontend")
                .build();

        studentService.createStudent(first);

        StudentRequest duplicate = StudentRequest.builder()
                .name("Alice Second")
                .email("alice@college.edu")
                .preferredRole("Backend")
                .build();

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("alice@college.edu")));
    }

    @Test
    @DisplayName("PUT /api/students/{id} returns 409 Conflict when updating email to another existing student's email")
    void testUpdateStudent_DuplicateEmailReturns409() throws Exception {
        Student s1 = studentService.createStudent(
                new StudentRequest("Student One", "student1@college.edu", "Role 1"));
        Student s2 = studentService.createStudent(
                new StudentRequest("Student Two", "student2@college.edu", "Role 2"));

        // Attempt to update s2's email to s1's email
        StudentRequest conflictingUpdate = StudentRequest.builder()
                .name("Student Two Renamed")
                .email("student1@college.edu")
                .preferredRole("Role 2")
                .build();

        mockMvc.perform(put("/api/students/{id}", s2.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(conflictingUpdate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("student1@college.edu")));
    }

    @Test
    @DisplayName("PUT /api/students/{id} succeeds when keeping the same email")
    void testUpdateStudent_KeepSameEmailSuccess() throws Exception {
        Student s = studentService.createStudent(
                new StudentRequest("Student Self", "self@college.edu", "Role Initial"));

        StudentRequest sameEmailUpdate = StudentRequest.builder()
                .name("Student Self Updated")
                .email("self@college.edu")
                .preferredRole("Role Advanced")
                .build();

        mockMvc.perform(put("/api/students/{id}", s.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sameEmailUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Student Self Updated")))
                .andExpect(jsonPath("$.email", is("self@college.edu")))
                .andExpect(jsonPath("$.preferredRole", is("Role Advanced")));
    }
}
