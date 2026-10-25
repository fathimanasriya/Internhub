package com.internhub.sirs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internhub.sirs.dto.HrLoginRequest;
import com.internhub.sirs.dto.HrRegisterRequest;
import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.dto.StudentLoginRequest;
import com.internhub.sirs.dto.StudentRegisterRequest;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.repository.HrUserRepository;
import com.internhub.sirs.repository.InternshipRepository;
import com.internhub.sirs.repository.StudentRepository;
import com.internhub.sirs.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private HrUserRepository hrUserRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        internshipRepository.deleteAll();
        studentRepository.deleteAll();
        hrUserRepository.deleteAll();
    }

    // =========================================================================
    // STUDENT AUTH TESTS
    // =========================================================================

    @Test
    @DisplayName("POST /api/auth/student/register successfully registers a student and returns token")
    void testRegisterStudent_Success() throws Exception {
        StudentRegisterRequest request = StudentRegisterRequest.builder()
                .fullName("Jane Doe")
                .email("jane.doe@college.edu")
                .password("Password123")
                .phone("+91 99999 88888")
                .college("Engineering College")
                .course("B.Tech")
                .department("Computer Science")
                .yearSemester("3rd Year / 5th Sem")
                .studentId("CS2023-01")
                .skills("Java, React, SQL")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.type", is("Bearer")))
                .andExpect(jsonPath("$.student.id", notNullValue()))
                .andExpect(jsonPath("$.student.name", is("Jane Doe")))
                .andExpect(jsonPath("$.student.email", is("jane.doe@college.edu")))
                .andExpect(jsonPath("$.student.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.student.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/student/register returns 409 Conflict when email is already registered")
    void testRegisterStudent_DuplicateEmailReturns409() throws Exception {
        StudentRegisterRequest first = StudentRegisterRequest.builder()
                .fullName("First User")
                .email("duplicate@college.edu")
                .password("Password123")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        StudentRegisterRequest duplicate = StudentRegisterRequest.builder()
                .fullName("Second User")
                .email("duplicate@college.edu")
                .password("Password456")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.message", containsString("duplicate@college.edu")));
    }

    @Test
    @DisplayName("POST /api/auth/student/register returns 400 Bad Request when password is under 6 characters")
    void testRegisterStudent_ShortPasswordReturns400() throws Exception {
        StudentRegisterRequest shortPw = StudentRegisterRequest.builder()
                .fullName("Short Password User")
                .email("short@college.edu")
                .password("12345")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(shortPw)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.password", containsString("at least 6 characters")));
    }

    @Test
    @DisplayName("POST /api/auth/student/login successfully authenticates and returns JWT")
    void testLoginStudent_Success() throws Exception {
        StudentRegisterRequest register = StudentRegisterRequest.builder()
                .fullName("Alice Bob")
                .email("alice@college.edu")
                .password("ValidPass123")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        StudentLoginRequest login = StudentLoginRequest.builder()
                .email("alice@college.edu")
                .password("ValidPass123")
                .build();

        mockMvc.perform(post("/api/auth/student/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.student.email", is("alice@college.edu")));
    }

    @Test
    @DisplayName("POST /api/auth/student/login returns 401 Unauthorized with incorrect password")
    void testLoginStudent_WrongPasswordReturns401() throws Exception {
        StudentRegisterRequest register = StudentRegisterRequest.builder()
                .fullName("Wrong Password Test")
                .email("wrongpw@college.edu")
                .password("CorrectPass")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        StudentLoginRequest login = StudentLoginRequest.builder()
                .email("wrongpw@college.edu")
                .password("IncorrectPassword")
                .build();

        mockMvc.perform(post("/api/auth/student/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    // =========================================================================
    // HR AUTH TESTS
    // =========================================================================

    @Test
    @DisplayName("POST /api/auth/hr/register successfully registers an HR account and returns token")
    void testRegisterHr_Success() throws Exception {
        HrRegisterRequest request = HrRegisterRequest.builder()
                .hrName("Sarah Mitchell")
                .officialEmail("sarah.mitchell@novatech.com")
                .password("StrongPassword123")
                .phone("+91 98765 12345")
                .companyName("NovaTech Labs Pvt Ltd")
                .companyLocation("Bengaluru, Karnataka")
                .industry("Information Technology")
                .designation("Talent Acquisition Lead")
                .employeeId("EMP-2041")
                .build();

        mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.type", is("Bearer")))
                .andExpect(jsonPath("$.hrUser.id", notNullValue()))
                .andExpect(jsonPath("$.hrUser.hrName", is("Sarah Mitchell")))
                .andExpect(jsonPath("$.hrUser.officialEmail", is("sarah.mitchell@novatech.com")))
                .andExpect(jsonPath("$.hrUser.companyName", is("NovaTech Labs Pvt Ltd")))
                .andExpect(jsonPath("$.hrUser.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/hr/register returns 409 Conflict when official email already exists")
    void testRegisterHr_DuplicateEmailReturns409() throws Exception {
        HrRegisterRequest first = HrRegisterRequest.builder()
                .hrName("First Recruiter")
                .officialEmail("recruiter@novatech.com")
                .password("Password123")
                .phone("+91 98765 11111")
                .companyName("NovaTech Labs")
                .companyLocation("Bengaluru")
                .build();

        mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        HrRegisterRequest duplicate = HrRegisterRequest.builder()
                .hrName("Second Recruiter")
                .officialEmail("recruiter@novatech.com")
                .password("Password456")
                .phone("+91 98765 22222")
                .companyName("NovaTech Labs")
                .companyLocation("Bengaluru")
                .build();

        mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)));
    }

    @Test
    @DisplayName("POST /api/auth/hr/login successfully logs in HR with correct credentials")
    void testLoginHr_Success() throws Exception {
        HrRegisterRequest register = HrRegisterRequest.builder()
                .hrName("HR Login Test")
                .officialEmail("login@novatech.com")
                .password("SecurePass123")
                .phone("+91 98765 33333")
                .companyName("NovaTech Labs")
                .companyLocation("Bengaluru")
                .build();

        mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        HrLoginRequest login = HrLoginRequest.builder()
                .officialEmail("login@novatech.com")
                .password("SecurePass123")
                .build();

        mockMvc.perform(post("/api/auth/hr/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.hrUser.officialEmail", is("login@novatech.com")));
    }

    @Test
    @DisplayName("POST /api/auth/hr/login returns 401 with wrong password")
    void testLoginHr_WrongPasswordReturns401() throws Exception {
        HrRegisterRequest register = HrRegisterRequest.builder()
                .hrName("HR Test")
                .officialEmail("wronghr@novatech.com")
                .password("GoodPassword")
                .phone("+91 98765 44444")
                .companyName("NovaTech Labs")
                .companyLocation("Bengaluru")
                .build();

        mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        HrLoginRequest login = HrLoginRequest.builder()
                .officialEmail("wronghr@novatech.com")
                .password("WrongPassword")
                .build();

        mockMvc.perform(post("/api/auth/hr/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("Cross-role login prevention: HR cannot log in at student endpoint and vice versa")
    void testCrossRoleLogin_Rejected() throws Exception {
        // Register HR
        HrRegisterRequest hrReg = HrRegisterRequest.builder()
                .hrName("HR Agent")
                .officialEmail("hr@enterprise.com")
                .password("HrPassword123")
                .phone("+91 98765 55555")
                .companyName("Enterprise")
                .companyLocation("Pune")
                .build();

        mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hrReg)))
                .andExpect(status().isCreated());

        // Attempt login as student with HR email
        StudentLoginRequest studentLogin = StudentLoginRequest.builder()
                .email("hr@enterprise.com")
                .password("HrPassword123")
                .build();

        mockMvc.perform(post("/api/auth/student/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentLogin)))
                .andExpect(status().isUnauthorized());

        // Register Student
        StudentRegisterRequest studentReg = StudentRegisterRequest.builder()
                .fullName("Student User")
                .email("student@college.edu")
                .password("StudentPass123")
                .build();

        mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentReg)))
                .andExpect(status().isCreated());

        // Attempt login as HR with student email
        HrLoginRequest hrLogin = HrLoginRequest.builder()
                .officialEmail("student@college.edu")
                .password("StudentPass123")
                .build();

        mockMvc.perform(post("/api/auth/hr/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hrLogin)))
                .andExpect(status().isUnauthorized());
    }

    // =========================================================================
    // PROFILE & ROLE AUTHORIZATION TESTS
    // =========================================================================

    @Test
    @DisplayName("GET /api/hr/me returns HR profile for HR token, 403 for Student token, 403 without token")
    void testHrProfileAuthorization() throws Exception {
        // Register HR
        HrRegisterRequest hrReg = HrRegisterRequest.builder()
                .hrName("Recruiter One")
                .officialEmail("recruiter1@novatech.com")
                .password("RecruiterPass123")
                .phone("+91 98765 66666")
                .companyName("NovaTech")
                .companyLocation("Delhi")
                .build();

        MvcResult hrRes = mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hrReg)))
                .andExpect(status().isCreated())
                .andReturn();

        String hrToken = objectMapper.readTree(hrRes.getResponse().getContentAsString()).get("token").asText();

        // Register Student
        StudentRegisterRequest studentReg = StudentRegisterRequest.builder()
                .fullName("Student Candidate")
                .email("candidate@college.edu")
                .password("StudentPass123")
                .build();

        MvcResult studentRes = mockMvc.perform(post("/api/auth/student/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentReg)))
                .andExpect(status().isCreated())
                .andReturn();

        String studentToken = objectMapper.readTree(studentRes.getResponse().getContentAsString()).get("token").asText();

        // 1. HR token accesses /api/hr/me -> 200 OK
        mockMvc.perform(get("/api/hr/me")
                        .header("Authorization", "Bearer " + hrToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.officialEmail", is("recruiter1@novatech.com")))
                .andExpect(jsonPath("$.hrName", is("Recruiter One")));

        // 2. Student token accesses /api/hr/me -> 403 Forbidden
        mockMvc.perform(get("/api/hr/me")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // 3. No token accesses /api/hr/me -> 403 Forbidden
        mockMvc.perform(get("/api/hr/me"))
                .andExpect(status().isForbidden());

        // 4. HR token accesses /api/students/me -> 403 Forbidden
        mockMvc.perform(get("/api/students/me")
                        .header("Authorization", "Bearer " + hrToken))
                .andExpect(status().isForbidden());

        // 5. Student token accesses /api/students/me -> 200 OK
        mockMvc.perform(get("/api/students/me")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("candidate@college.edu")));
    }

    // =========================================================================
    // HR INTERNSHIP OWNERSHIP & ACCESS TESTS
    // =========================================================================

    @Test
    @DisplayName("HR can create and retrieve own internships via /api/internships/my; other HR cannot delete it")
    void testHrInternshipOwnershipAndRestrictions() throws Exception {
        // HR 1
        HrRegisterRequest hr1 = HrRegisterRequest.builder()
                .hrName("HR One")
                .officialEmail("hr1@company.com")
                .password("Password123")
                .phone("+91 90000 00001")
                .companyName("Company Alpha")
                .companyLocation("Hyderabad")
                .build();

        MvcResult res1 = mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hr1)))
                .andExpect(status().isCreated())
                .andReturn();
        String token1 = objectMapper.readTree(res1.getResponse().getContentAsString()).get("token").asText();

        // HR 2
        HrRegisterRequest hr2 = HrRegisterRequest.builder()
                .hrName("HR Two")
                .officialEmail("hr2@company.com")
                .password("Password123")
                .phone("+91 90000 00002")
                .companyName("Company Beta")
                .companyLocation("Mumbai")
                .build();

        MvcResult res2 = mockMvc.perform(post("/api/auth/hr/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hr2)))
                .andExpect(status().isCreated())
                .andReturn();
        String token2 = objectMapper.readTree(res2.getResponse().getContentAsString()).get("token").asText();

        // HR 1 creates an internship
        InternshipRequest posting = InternshipRequest.builder()
                .companyName("Company Alpha")
                .role("Cloud Engineer Intern")
                .location("Hyderabad")
                .description("Build microservices on Kubernetes.")
                .eligibility("B.Tech CS / IT")
                .applicationDeadline(LocalDate.now().plusMonths(2))
                .build();

        MvcResult createdRes = mockMvc.perform(post("/api/internships")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(posting)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.role", is("Cloud Engineer Intern")))
                .andReturn();

        long internshipId = objectMapper.readTree(createdRes.getResponse().getContentAsString()).get("id").asLong();

        // HR 1 sees the internship in /api/internships/my
        mockMvc.perform(get("/api/internships/my")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is((int) internshipId)))
                .andExpect(jsonPath("$[0].role", is("Cloud Engineer Intern")));

        // HR 2 does NOT see HR 1's internship in /api/internships/my
        mockMvc.perform(get("/api/internships/my")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // HR 2 attempts to delete HR 1's internship -> 403 Forbidden
        mockMvc.perform(delete("/api/internships/" + internshipId)
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isForbidden());

        // HR 1 deletes own internship -> 204 No Content
        mockMvc.perform(delete("/api/internships/" + internshipId)
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isNoContent());
    }
}
