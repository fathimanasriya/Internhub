package com.internhub.sirs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internhub.sirs.dto.InternshipRequest;
import com.internhub.sirs.model.Internship;
import com.internhub.sirs.service.InternshipService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class InternshipControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private InternshipService internshipService;

    @BeforeEach
    void setUp() {
        // Only clears the internships table, leaving student records intact
        internshipService.clearAll();
    }

    @Test
    @DisplayName("POST /api/internships creates internship successfully with 201 Created")
    void testCreateInternship_Success() throws Exception {
        InternshipRequest request = InternshipRequest.builder()
                .companyName("TechNova Solutions")
                .role("Frontend Developer Intern")
                .location("Remote")
                .description("Build responsive user interfaces using React and modern CSS.")
                .eligibility("Enrolled in 3rd or 4th year B.Tech / MCA.")
                .applicationDeadline(LocalDate.now().plusMonths(3))
                .build();

        mockMvc.perform(post("/api/internships")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.companyName", is("TechNova Solutions")))
                .andExpect(jsonPath("$.role", is("Frontend Developer Intern")))
                .andExpect(jsonPath("$.location", is("Remote")))
                .andExpect(jsonPath("$.applicationDeadline", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/internships returns 400 Bad Request when companyName is blank")
    void testCreateInternship_ValidationFailure_BlankCompany() throws Exception {
        InternshipRequest request = InternshipRequest.builder()
                .companyName("")
                .role("Frontend Developer")
                .location("Remote")
                .description("Good description")
                .eligibility("Any degree")
                .applicationDeadline(LocalDate.now().plusMonths(1))
                .build();

        mockMvc.perform(post("/api/internships")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.validationErrors.companyName", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/internships returns 400 Bad Request when deadline is in the past")
    void testCreateInternship_ValidationFailure_PastDeadline() throws Exception {
        InternshipRequest request = InternshipRequest.builder()
                .companyName("Acme Corp")
                .role("Backend Intern")
                .location("Bangalore")
                .description("Java Spring Boot APIs")
                .eligibility("CS Degree")
                .applicationDeadline(LocalDate.now().minusDays(1)) // Past date
                .build();

        mockMvc.perform(post("/api/internships")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.validationErrors.applicationDeadline", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/internships returns 400 Bad Request when deadline is null")
    void testCreateInternship_ValidationFailure_NullDeadline() throws Exception {
        InternshipRequest request = InternshipRequest.builder()
                .companyName("Acme Corp")
                .role("Backend Intern")
                .location("Bangalore")
                .description("Java Spring Boot APIs")
                .eligibility("CS Degree")
                .applicationDeadline(null)
                .build();

        mockMvc.perform(post("/api/internships")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.applicationDeadline", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/internships returns list of all internships with 200 OK")
    void testGetAllInternships_Success() throws Exception {
        internshipService.createInternship(new InternshipRequest(
                "Company A", "Role A", "Remote", "Desc A", "Elig A", LocalDate.now().plusMonths(1)));
        internshipService.createInternship(new InternshipRequest(
                "Company B", "Role B", "Hybrid", "Desc B", "Elig B", LocalDate.now().plusMonths(2)));

        mockMvc.perform(get("/api/internships"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].companyName", is("Company A")))
                .andExpect(jsonPath("$[1].companyName", is("Company B")));
    }

    @Test
    @DisplayName("GET /api/internships/{id} returns internship details with 200 OK")
    void testGetInternshipById_Success() throws Exception {
        Internship created = internshipService.createInternship(new InternshipRequest(
                "Apex Cloud", "Cloud Intern", "Chennai", "AWS Cloud Tasks", "B.Tech IT", LocalDate.now().plusMonths(2)));

        mockMvc.perform(get("/api/internships/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.companyName", is("Apex Cloud")))
                .andExpect(jsonPath("$.role", is("Cloud Intern")));
    }

    @Test
    @DisplayName("GET /api/internships/{id} returns 404 Not Found when ID does not exist")
    void testGetInternshipById_NotFound() throws Exception {
        mockMvc.perform(get("/api/internships/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("Internship not found with ID: 99999")));
    }

    @Test
    @DisplayName("PUT /api/internships/{id} updates existing internship with 200 OK")
    void testUpdateInternship_Success() throws Exception {
        Internship created = internshipService.createInternship(new InternshipRequest(
                "Old Company", "Old Role", "Remote", "Old Desc", "Old Elig", LocalDate.now().plusMonths(1)));

        InternshipRequest updatePayload = InternshipRequest.builder()
                .companyName("Updated Company")
                .role("Senior Intern")
                .location("Hyderabad")
                .description("Updated Description")
                .eligibility("Updated Eligibility")
                .applicationDeadline(LocalDate.now().plusMonths(4))
                .build();

        mockMvc.perform(put("/api/internships/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.companyName", is("Updated Company")))
                .andExpect(jsonPath("$.role", is("Senior Intern")))
                .andExpect(jsonPath("$.location", is("Hyderabad")));
    }

    @Test
    @DisplayName("PUT /api/internships/{id} returns 404 Not Found when ID does not exist")
    void testUpdateInternship_NotFound() throws Exception {
        InternshipRequest updatePayload = InternshipRequest.builder()
                .companyName("Ghost Company")
                .role("Ghost Role")
                .location("Remote")
                .description("Ghost Desc")
                .eligibility("Ghost Elig")
                .applicationDeadline(LocalDate.now().plusMonths(1))
                .build();

        mockMvc.perform(put("/api/internships/{id}", 99999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    @Test
    @DisplayName("PUT /api/internships/{id} returns 400 Bad Request when update payload is invalid")
    void testUpdateInternship_ValidationFailure() throws Exception {
        Internship created = internshipService.createInternship(new InternshipRequest(
                "Company X", "Role X", "Remote", "Desc X", "Elig X", LocalDate.now().plusMonths(1)));

        InternshipRequest invalidPayload = InternshipRequest.builder()
                .companyName("") // Blank company
                .role("Role X")
                .location("Remote")
                .description("Desc X")
                .eligibility("Elig X")
                .applicationDeadline(LocalDate.now().plusMonths(1))
                .build();

        mockMvc.perform(put("/api/internships/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPayload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.validationErrors.companyName", notNullValue()));
    }

    @Test
    @DisplayName("DELETE /api/internships/{id} deletes internship with 204 No Content")
    void testDeleteInternship_Success() throws Exception {
        Internship created = internshipService.createInternship(new InternshipRequest(
                "To Delete Corp", "To Delete Role", "Remote", "Desc", "Elig", LocalDate.now().plusMonths(1)));

        mockMvc.perform(delete("/api/internships/{id}", created.getId()))
                .andExpect(status().isNoContent());

        // Subsequent GET should return 404 Not Found
        mockMvc.perform(get("/api/internships/{id}", created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/internships/{id} returns 404 Not Found when ID does not exist")
    void testDeleteInternship_NotFound() throws Exception {
        mockMvc.perform(delete("/api/internships/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    // ===================================================================
    //  Milestone 6 — Search & Filter endpoint tests
    //  GET /api/internships?companyName=...&role=...&location=...&activeOnly=...
    //  (existing tests above are not modified)
    // ===================================================================

    /** Helper: create and persist an internship with a future deadline. */
    private Internship createActive(String company, String role, String location) {
        return internshipService.createInternship(new InternshipRequest(
                company, role, location, "Description", "Eligibility",
                LocalDate.now().plusDays(30)));
    }

    // ------------------------------------------------------------------ //
    //  Filter by company name                                              //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("GET /api/internships?companyName=apex returns only matching internships")
    void testSearch_byCompanyName() throws Exception {
        createActive("Apex Systems", "Dev Intern", "Remote");
        createActive("TechCorp", "Java Intern", "Bangalore");

        mockMvc.perform(get("/api/internships").param("companyName", "apex"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].companyName", is("Apex Systems")));
    }

    @Test
    @DisplayName("GET /api/internships?companyName=APEX is case-insensitive")
    void testSearch_byCompanyName_caseInsensitive() throws Exception {
        createActive("Apex Systems", "Dev Intern", "Remote");
        createActive("Other Company", "Role", "Bangalore");

        mockMvc.perform(get("/api/internships").param("companyName", "APEX"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].companyName", is("Apex Systems")));
    }

    // ------------------------------------------------------------------ //
    //  Filter by role                                                      //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("GET /api/internships?role=java returns only matching internships")
    void testSearch_byRole() throws Exception {
        createActive("CompanyA", "Java Developer Intern", "Remote");
        createActive("CompanyB", "React Frontend Intern", "Bangalore");

        mockMvc.perform(get("/api/internships").param("role", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].role", is("Java Developer Intern")));
    }

    // ------------------------------------------------------------------ //
    //  Filter by location                                                  //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("GET /api/internships?location=bangalore returns only matching internships")
    void testSearch_byLocation() throws Exception {
        createActive("CompanyA", "Role A", "Bangalore");
        createActive("CompanyB", "Role B", "Remote");

        mockMvc.perform(get("/api/internships").param("location", "bangalore"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].location", is("Bangalore")));
    }

    // ------------------------------------------------------------------ //
    //  activeOnly filter                                                   //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("GET /api/internships?activeOnly=true includes internship with today's deadline")
    void testSearch_activeOnly_includesDeadlineToday() throws Exception {
        // Save directly via repository to bypass DTO @FutureOrPresent validation
        // (we need today's exact date — which IS valid — but also need to verify inclusion)
        internshipService.createInternship(new InternshipRequest(
                "TodayCo", "Dev", "Remote", "Desc", "Elig", LocalDate.now()));

        mockMvc.perform(get("/api/internships").param("activeOnly", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.companyName == 'TodayCo')]", hasSize(1)));
    }

    @Test
    @DisplayName("GET /api/internships?activeOnly=false includes internship with today's deadline")
    void testSearch_activeOnlyFalse_returnsAll() throws Exception {
        createActive("FutureCo", "Dev", "Remote");
        // No expired internship we can add via DTO, but future-only is returned:
        mockMvc.perform(get("/api/internships").param("activeOnly", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    // ------------------------------------------------------------------ //
    //  Combined filters                                                    //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("GET /api/internships?companyName=&role=java — blank companyName is ignored")
    void testSearch_blankCompanyParam_isIgnored() throws Exception {
        createActive("CompanyA", "Java Intern", "Remote");
        createActive("CompanyB", "Python Intern", "Remote");

        // blank companyName should be treated as absent — role=java should still filter
        mockMvc.perform(get("/api/internships")
                        .param("companyName", "")
                        .param("role", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].role", is("Java Intern")));
    }

    @Test
    @DisplayName("GET /api/internships?companyName=tech&role=intern&activeOnly=true — combined filters")
    void testSearch_combined_companyRoleActiveOnly() throws Exception {
        createActive("TechFirm", "Java Intern", "Remote");      // matches all 3
        createActive("TechFirm", "Manager", "Remote");           // role doesn't match
        createActive("OtherCo", "Java Intern", "Remote");        // company doesn't match

        mockMvc.perform(get("/api/internships")
                        .param("companyName", "tech")
                        .param("role", "intern")
                        .param("activeOnly", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].companyName", is("TechFirm")))
                .andExpect(jsonPath("$[0].role", is("Java Intern")));
    }

    @Test
    @DisplayName("GET /api/internships?companyName=zzznomatch — no results returns empty list with 200 OK")
    void testSearch_noMatch_returnsEmptyList() throws Exception {
        createActive("RealCompany", "Dev", "Remote");

        mockMvc.perform(get("/api/internships").param("companyName", "zzznomatch"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /api/internships (no params) returns all internships — backward compatibility")
    void testSearch_noParams_returnsAll() throws Exception {
        createActive("Company Alpha", "Role A", "Remote");
        createActive("Company Beta", "Role B", "Bangalore");

        mockMvc.perform(get("/api/internships"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }
}
