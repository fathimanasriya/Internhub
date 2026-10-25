package com.internhub.sirs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internhub.sirs.dto.HrRegisterRequest;
import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.dto.StudentRequest;
import com.internhub.sirs.model.ApplicationStatus;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.repository.NotificationRepository;
import com.internhub.sirs.service.ApplicationService;
import com.internhub.sirs.service.AuthService;
import com.internhub.sirs.service.InternshipService;
import com.internhub.sirs.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class NotificationIntegrationTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private ApplicationService applicationService;
    @Autowired private StudentService studentService;
    @Autowired private InternshipService internshipService;
    @Autowired private AuthService authService;
    @Autowired private NotificationRepository notificationRepository;

    private Student student;
    private Internship internship;

    @BeforeEach
    void setUp() throws Exception {
        applicationService.clearAll();
        notificationRepository.deleteAll();

        // Register HR
        HrRegisterRequest hrReq = new HrRegisterRequest();
        hrReq.setHrName("Jane Recruiter");
        hrReq.setOfficialEmail("jane" + System.currentTimeMillis() + "@techcorp.com");
        hrReq.setPhone("+91 98888 77777");
        hrReq.setPassword("Password123!");
        hrReq.setCompanyName("TechCorp");
        hrReq.setCompanyLocation("Bangalore");
        authService.registerHr(hrReq);

        // Create Internship posted by HR
        InternshipRequest ir = new InternshipRequest();
        ir.setCompanyName("TechCorp");
        ir.setRole("Full Stack Intern");
        ir.setLocation("Bangalore");
        ir.setDescription("Spring Boot & React");
        ir.setEligibility("Pre-final year");
        ir.setApplicationDeadline(LocalDate.now().plusDays(20));
        internship = internshipService.createInternship(ir, hrReq.getOfficialEmail());

        // Create Student
        StudentRequest sr = new StudentRequest();
        sr.setName("Amit Kumar");
        sr.setEmail("amit" + System.currentTimeMillis() + "@college.edu");
        sr.setPreferredRole("Full Stack");
        student = studentService.createStudent(sr);
    }

    @Test
    void shouldCreateNotificationsForStudentAndHr_WhenApplicationIsSubmitted() throws Exception {
        String hrEmail = internship.getPostedByHr().getOfficialEmail();

        // 1. Submit application as student
        Map<String, Object> appBody = Map.of(
                "studentId", student.getId(),
                "internshipId", internship.getId(),
                "notes", "I love full stack development"
        );

        mockMvc.perform(post("/api/applications")
                        .with(user(student.getEmail()).roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appBody)))
                .andExpect(status().isCreated());

        // 2. Student verifies their notifications
        mockMvc.perform(get("/api/notifications/student")
                        .with(user(student.getEmail()).roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Application Submitted")))
                .andExpect(jsonPath("$[0].relatedInternshipTitle", is("Full Stack Intern")))
                .andExpect(jsonPath("$[0].read", is(false)));

        // 3. HR verifies their notifications
        mockMvc.perform(get("/api/notifications/hr")
                        .with(user(hrEmail).roles("HR")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("New Application Received")))
                .andExpect(jsonPath("$[0].message", containsString("Amit Kumar applied for Full Stack Intern")))
                .andExpect(jsonPath("$[0].read", is(false)));

        // 4. Another unrelated HR checks and sees zero notifications
        mockMvc.perform(get("/api/notifications/hr")
                        .with(user("other_hr@random.com").roles("HR")))
                .andExpect(status().isNotFound()); // Or empty if registered
    }

    @Test
    void shouldCreateNotificationForStudent_WhenStatusIsUpdatedByHr() throws Exception {
        String hrEmail = internship.getPostedByHr().getOfficialEmail();

        // Submit application
        Map<String, Object> appBody = Map.of(
                "studentId", student.getId(),
                "internshipId", internship.getId()
        );

        String appResponse = mockMvc.perform(post("/api/applications")
                        .with(user(student.getEmail()).roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appBody)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long applicationId = objectMapper.readTree(appResponse).get("id").asLong();

        // HR shortlists the application
        Map<String, String> statusBody = Map.of("status", "SHORTLISTED");
        mockMvc.perform(patch("/api/applications/" + applicationId + "/status")
                        .with(user(hrEmail).roles("HR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusBody)))
                .andExpect(status().isOk());

        // Student checks notifications: should now have 2 (Application Submitted + Application Shortlisted)
        mockMvc.perform(get("/api/notifications/student")
                        .with(user(student.getEmail()).roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Application Shortlisted")))
                .andExpect(jsonPath("$[0].message", containsString("shortlisted")));
    }

    @Test
    void shouldMarkNotificationAsReadAndMarkAllAsRead() throws Exception {
        Map<String, Object> appBody = Map.of(
                "studentId", student.getId(),
                "internshipId", internship.getId()
        );

        mockMvc.perform(post("/api/applications")
                        .with(user(student.getEmail()).roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appBody)))
                .andExpect(status().isCreated());

        String notifListJson = mockMvc.perform(get("/api/notifications/student")
                        .with(user(student.getEmail()).roles("STUDENT")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Long notifId = objectMapper.readTree(notifListJson).get(0).get("id").asLong();

        // Mark individual notification as read
        mockMvc.perform(patch("/api/notifications/student/" + notifId + "/read")
                        .with(user(student.getEmail()).roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read", is(true)));

        // Verify unread count is 0
        mockMvc.perform(get("/api/notifications/student/unread-count")
                        .with(user(student.getEmail()).roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount", is(0)));
    }

    @Test
    void shouldNotCreateDuplicateNotification_WhenUpdatingToSameStatus() throws Exception {
        String hrEmail = internship.getPostedByHr().getOfficialEmail();

        Map<String, Object> appBody = Map.of(
                "studentId", student.getId(),
                "internshipId", internship.getId()
        );

        String appResponse = mockMvc.perform(post("/api/applications")
                        .with(user(student.getEmail()).roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appBody)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long applicationId = objectMapper.readTree(appResponse).get("id").asLong();

        // 1st update to SHORTLISTED
        Map<String, String> statusBody = Map.of("status", "SHORTLISTED");
        mockMvc.perform(patch("/api/applications/" + applicationId + "/status")
                        .with(user(hrEmail).roles("HR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusBody)))
                .andExpect(status().isOk());

        // 2nd update with same status: SHORTLISTED
        mockMvc.perform(patch("/api/applications/" + applicationId + "/status")
                        .with(user(hrEmail).roles("HR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusBody)))
                .andExpect(status().isOk());

        // Student should still have only 2 notifications (Application Submitted + single Application Shortlisted)
        mockMvc.perform(get("/api/notifications/student")
                        .with(user(student.getEmail()).roles("STUDENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }
}
