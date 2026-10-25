package com.internhub.sirs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internhub.sirs.model.ApplicationStatus;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.service.ApplicationService;
import com.internhub.sirs.service.InternshipService;
import com.internhub.sirs.service.StudentService;
import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.dto.StudentRequest;
import com.internhub.sirs.dto.HrRegisterRequest;
import com.internhub.sirs.dto.StudentRegisterRequest;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.repository.HrUserRepository;
import com.internhub.sirs.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ApplicationController.
 *
 * @SpringBootTest loads the full application context using H2 (configured in
 * src/test/resources/application.properties) — it never touches the real MySQL database.
 *
 * @AutoConfigureMockMvc lets us make HTTP-style requests without starting a real server.
 *
 * Test isolation strategy:
 *   @BeforeEach clears ONLY the applications table, then recreates one shared
 *   Student and one shared Internship.  Student and Internship tables are NOT
 *   cleared between tests — they accumulate, but that is safe because we always
 *   refer to the IDs created in the most recent @BeforeEach setup.
 *
 *   A single @AfterAll (or the last cleanup) could be added, but for H2 the
 *   context is discarded after the test class anyway.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ApplicationControllerTests {

    @Autowired private MockMvc             mockMvc;
    @Autowired private ObjectMapper        objectMapper;
    @Autowired private ApplicationService  applicationService;
    @Autowired private StudentService      studentService;
    @Autowired private InternshipService   internshipService;
    @Autowired private AuthService         authService;

    /** Shared student ID re-set before each test. */
    private Long studentId;

    /** Shared internship ID re-set before each test (deadline 30 days from now). */
    private Long internshipId;

    /** A second internship with a past deadline for deadline-rejection tests. */
    private Long expiredInternshipId;

    @BeforeEach
    void setUp() throws Exception {
        // 1. Clear applications first to avoid FK constraint violations
        applicationService.clearAll();

        // 2. Create a fresh student
        StudentRequest sr = new StudentRequest();
        sr.setName("Priya Sharma");
        sr.setEmail("priya" + System.currentTimeMillis() + "@test.com"); // unique email per run
        sr.setPreferredRole("Frontend Developer");
        Student student = studentService.createStudent(sr);
        studentId = student.getId();

        // 3. Create a fresh internship (deadline in the future)
        InternshipRequest ir = new InternshipRequest();
        ir.setCompanyName("OpenTech");
        ir.setRole("React Intern");
        ir.setLocation("Bangalore");
        ir.setDescription("React JS internship");
        ir.setEligibility("2nd year or above");
        ir.setApplicationDeadline(LocalDate.now().plusDays(30));
        Internship internship = internshipService.createInternship(ir);
        internshipId = internship.getId();

        // 4. Create a separate internship with a past deadline
        InternshipRequest expiredIr = new InternshipRequest();
        expiredIr.setCompanyName("OldCorp");
        expiredIr.setRole("Java Intern");
        expiredIr.setLocation("Chennai");
        expiredIr.setDescription("Expired internship");
        expiredIr.setEligibility("Any year");
        expiredIr.setApplicationDeadline(LocalDate.now().minusDays(1)); // yesterday
        Internship expiredInternship = internshipService.createInternship(expiredIr);
        expiredInternshipId = expiredInternship.getId();
    }

    // ================================================================== //
    //  POST /api/applications — submit application                        //
    // ================================================================== //

    @Test
    void shouldSubmitApplicationSuccessfully() throws Exception {
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    void shouldReturnBadRequest_WhenStudentIdMissing() throws Exception {
        Map<String, Object> body = Map.of("internshipId", internshipId);

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.validationErrors.studentId").exists());
    }

    @Test
    void shouldReturnBadRequest_WhenInternshipIdMissing() throws Exception {
        Map<String, Object> body = Map.of("studentId", studentId);

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.validationErrors.internshipId").exists());
    }

    @Test
    void shouldReturn404_WhenStudentDoesNotExist() throws Exception {
        Map<String, Object> body = Map.of(
            "studentId",    999999L,
            "internshipId", internshipId
        );

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value(containsString("Student not found")));
    }

    @Test
    void shouldReturn404_WhenInternshipDoesNotExist() throws Exception {
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", 999999L
        );

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value(containsString("Internship not found")));
    }

    @Test
    void shouldReturn400_WhenApplicationDeadlineHasPassed() throws Exception {
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", expiredInternshipId
        );

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value(containsString("deadline")));
    }

    @Test
    void shouldReturn409_WhenDuplicateApplication() throws Exception {
        // First application — succeeds
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated());

        // Second identical application — 409 Conflict
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409));
    }

    // ================================================================== //
    //  GET /api/applications                                              //
    // ================================================================== //

    @Test
    void shouldListAllApplications() throws Exception {
        // Create one application first
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated());

        mockMvc.perform(get("/api/applications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    // ================================================================== //
    //  GET /api/applications/{id}                                         //
    // ================================================================== //

    @Test
    void shouldGetApplicationById() throws Exception {
        // Submit an application and capture the returned id
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        String json = mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(json).get("id").asLong();

        mockMvc.perform(get("/api/applications/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    void shouldReturn404_WhenApplicationNotFound() throws Exception {
        mockMvc.perform(get("/api/applications/999999"))
            .andExpect(status().isNotFound());
    }

    // ================================================================== //
    //  GET /api/applications/student/{studentId}                          //
    // ================================================================== //

    @Test
    void shouldGetApplicationsByStudent() throws Exception {
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated());

        mockMvc.perform(get("/api/applications/student/" + studentId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void shouldReturn404_WhenStudentNotFoundForStudentFilter() throws Exception {
        mockMvc.perform(get("/api/applications/student/999999"))
            .andExpect(status().isNotFound());
    }

    // ================================================================== //
    //  GET /api/applications/internship/{internshipId}                    //
    // ================================================================== //

    @Test
    void shouldGetApplicationsByInternship() throws Exception {
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated());

        mockMvc.perform(get("/api/applications/internship/" + internshipId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void shouldReturn404_WhenInternshipNotFoundForInternshipFilter() throws Exception {
        mockMvc.perform(get("/api/applications/internship/999999"))
            .andExpect(status().isNotFound());
    }

    // ================================================================== //
    //  PATCH /api/applications/{id}/status                                //
    // ================================================================== //

    @Test
    void shouldUpdateApplicationStatus() throws Exception {
        // Submit application
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        String json = mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(json).get("id").asLong();

        // Update status to SHORTLISTED
        Map<String, String> statusBody = Map.of("status", "SHORTLISTED");

        mockMvc.perform(patch("/api/applications/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusBody)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("SHORTLISTED"));
    }

    @Test
    void shouldReturn400_WhenInvalidStatusValue() throws Exception {
        // Submit application to get a valid ID
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        String json = mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(json).get("id").asLong();

        // Send an invalid status value
        Map<String, String> statusBody = Map.of("status", "INVALID_STATUS");

        mockMvc.perform(patch("/api/applications/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusBody)))
            .andExpect(status().isBadRequest());
    }

    // ================================================================== //
    //  DELETE /api/applications/{id}                                      //
    // ================================================================== //

    @Test
    void shouldDeleteApplication() throws Exception {
        // Submit application
        Map<String, Object> body = Map.of(
            "studentId",    studentId,
            "internshipId", internshipId
        );
        String json = mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(json).get("id").asLong();

        // Delete it
        mockMvc.perform(delete("/api/applications/" + id))
            .andExpect(status().isNoContent());

        // Confirm it is gone
        mockMvc.perform(get("/api/applications/" + id))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn404_WhenDeletingNonExistentApplication() throws Exception {
        mockMvc.perform(delete("/api/applications/999999"))
            .andExpect(status().isNotFound());
    }

    // ================================================================== //
    //  HR Applications & Ownership Security Tests                         //
    // ================================================================== //

    @Test
    void shouldReturnOnlyApplicationsForHrInternships_WhenHrRequestsMyApplications() throws Exception {
        // Create HR 1
        HrRegisterRequest hrReq1 = new HrRegisterRequest();
        hrReq1.setHrName("HR One");
        hrReq1.setOfficialEmail("hr1@company.com");
        hrReq1.setPhone("+91 99999 11111");
        hrReq1.setPassword("Password123!");
        hrReq1.setCompanyName("Company One");
        hrReq1.setCompanyLocation("Bengaluru");
        authService.registerHr(hrReq1);

        // Create HR 2
        HrRegisterRequest hrReq2 = new HrRegisterRequest();
        hrReq2.setHrName("HR Two");
        hrReq2.setOfficialEmail("hr2@company.com");
        hrReq2.setPhone("+91 99999 22222");
        hrReq2.setPassword("Password123!");
        hrReq2.setCompanyName("Company Two");
        hrReq2.setCompanyLocation("Mumbai");
        authService.registerHr(hrReq2);

        // HR 1 posts an internship
        InternshipRequest ir1 = new InternshipRequest();
        ir1.setCompanyName("Company One");
        ir1.setRole("Backend Developer");
        ir1.setLocation("Remote");
        ir1.setDescription("Spring Boot work");
        ir1.setEligibility("All");
        ir1.setApplicationDeadline(LocalDate.now().plusDays(10));
        Internship intern1 = internshipService.createInternship(ir1, "hr1@company.com");

        // HR 2 posts an internship
        InternshipRequest ir2 = new InternshipRequest();
        ir2.setCompanyName("Company Two");
        ir2.setRole("Frontend Developer");
        ir2.setLocation("Remote");
        ir2.setDescription("React work");
        ir2.setEligibility("All");
        ir2.setApplicationDeadline(LocalDate.now().plusDays(10));
        Internship intern2 = internshipService.createInternship(ir2, "hr2@company.com");

        // Student applies to intern1
        Map<String, Object> body1 = Map.of(
            "studentId", studentId,
            "internshipId", intern1.getId(),
            "notes", "Excited for Backend"
        );
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body1)))
            .andExpect(status().isCreated());

        // Student applies to intern2
        Map<String, Object> body2 = Map.of(
            "studentId", studentId,
            "internshipId", intern2.getId(),
            "notes", "Excited for Frontend"
        );
        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body2)))
            .andExpect(status().isCreated());

        // As HR 1, fetch /api/applications/hr/my with authentication
        mockMvc.perform(get("/api/applications/hr/my")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("hr1@company.com").roles("HR")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].internship.id", is(intern1.getId().intValue())))
            .andExpect(jsonPath("$[0].notes", is("Excited for Backend")));
    }

    @Test
    void shouldAllowHrOwnerToUpdateApplicationStatus() throws Exception {
        HrRegisterRequest hrReq = new HrRegisterRequest();
        hrReq.setHrName("HR Owner");
        hrReq.setOfficialEmail("hr_owner@company.com");
        hrReq.setPhone("+91 99999 33333");
        hrReq.setPassword("Password123!");
        hrReq.setCompanyName("Owner Corp");
        hrReq.setCompanyLocation("Pune");
        authService.registerHr(hrReq);

        InternshipRequest ir = new InternshipRequest();
        ir.setCompanyName("Owner Corp");
        ir.setRole("Data Analyst");
        ir.setLocation("Pune");
        ir.setDescription("SQL & Python");
        ir.setEligibility("All");
        ir.setApplicationDeadline(LocalDate.now().plusDays(15));
        Internship internship = internshipService.createInternship(ir, "hr_owner@company.com");

        Map<String, Object> body = Map.of(
            "studentId", studentId,
            "internshipId", internship.getId()
        );
        String appJson = mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long appId = objectMapper.readTree(appJson).get("id").asLong();

        // Update status to SHORTLISTED as the owning HR
        Map<String, String> statusBody = Map.of("status", "SHORTLISTED");
        mockMvc.perform(patch("/api/applications/" + appId + "/status")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("hr_owner@company.com").roles("HR"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusBody)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status", is("SHORTLISTED")));
    }

    @Test
    void shouldRejectStatusUpdate_WhenHrDoesNotOwnInternship() throws Exception {
        HrRegisterRequest hrReq1 = new HrRegisterRequest();
        hrReq1.setHrName("Legit HR");
        hrReq1.setOfficialEmail("legit_hr@company.com");
        hrReq1.setPhone("+91 99999 44444");
        hrReq1.setPassword("Password123!");
        hrReq1.setCompanyName("Legit Corp");
        hrReq1.setCompanyLocation("Delhi");
        authService.registerHr(hrReq1);

        InternshipRequest ir = new InternshipRequest();
        ir.setCompanyName("Legit Corp");
        ir.setRole("Security Analyst");
        ir.setLocation("Delhi");
        ir.setDescription("Pen-testing");
        ir.setEligibility("All");
        ir.setApplicationDeadline(LocalDate.now().plusDays(15));
        Internship internship = internshipService.createInternship(ir, "legit_hr@company.com");

        Map<String, Object> body = Map.of(
            "studentId", studentId,
            "internshipId", internship.getId()
        );
        String appJson = mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        Long appId = objectMapper.readTree(appJson).get("id").asLong();

        // Intruding HR tries to update status
        Map<String, String> statusBody = Map.of("status", "REJECTED");
        mockMvc.perform(patch("/api/applications/" + appId + "/status")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("hr_intruder@company.com").roles("HR"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusBody)))
            .andExpect(status().isForbidden());
    }
}
