package com.internhub.sirs.repository;

import com.internhub.sirs.model.Internship;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class InternshipRepositoryTests {

    @Autowired
    private InternshipRepository internshipRepository;

    @BeforeEach
    void setUp() {
        internshipRepository.deleteAll();
    }

    @Test
    @DisplayName("Save and find internship by ID in repository")
    void testSaveAndFindById() {
        Internship internship = Internship.builder()
                .companyName("TechNova Solutions")
                .role("Frontend Developer Intern")
                .location("Remote")
                .description("Build responsive React components.")
                .eligibility("Enrolled in Computer Science degree.")
                .applicationDeadline(LocalDate.now().plusMonths(2))
                .build();

        Internship saved = internshipRepository.save(internship);

        assertThat(saved.getId()).isNotNull();
        Optional<Internship> found = internshipRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getCompanyName()).isEqualTo("TechNova Solutions");
        assertThat(found.get().getRole()).isEqualTo("Frontend Developer Intern");
    }

    @Test
    @DisplayName("Find internships by company name containing substring (case-insensitive)")
    void testFindByCompanyName() {
        internshipRepository.save(Internship.builder()
                .companyName("Apex Cloud Systems")
                .role("Cloud Engineer")
                .location("Bangalore")
                .description("AWS deployments")
                .eligibility("B.Tech")
                .applicationDeadline(LocalDate.now().plusMonths(1))
                .build());

        List<Internship> found = internshipRepository.findByCompanyNameContainingIgnoreCase("apex");
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getCompanyName()).isEqualTo("Apex Cloud Systems");
    }

    @Test
    @DisplayName("Find internships by role containing substring (case-insensitive)")
    void testFindByRole() {
        internshipRepository.save(Internship.builder()
                .companyName("DataSphere AI")
                .role("Machine Learning Intern")
                .location("Hyderabad")
                .description("Train PyTorch models")
                .eligibility("Python & Math background")
                .applicationDeadline(LocalDate.now().plusMonths(1))
                .build());

        List<Internship> found = internshipRepository.findByRoleContainingIgnoreCase("learning");
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getRole()).isEqualTo("Machine Learning Intern");
    }

    @Test
    @DisplayName("Find all internships in repository")
    void testFindAll() {
        internshipRepository.save(Internship.builder()
                .companyName("Company A")
                .role("Role A")
                .location("Remote")
                .description("Desc A")
                .eligibility("Elig A")
                .applicationDeadline(LocalDate.now().plusDays(10))
                .build());

        internshipRepository.save(Internship.builder()
                .companyName("Company B")
                .role("Role B")
                .location("On-site")
                .description("Desc B")
                .eligibility("Elig B")
                .applicationDeadline(LocalDate.now().plusDays(20))
                .build());

        List<Internship> all = internshipRepository.findAll();
        assertThat(all).hasSize(2);
    }

    @Test
    @DisplayName("Delete internship by ID")
    void testDeleteById() {
        Internship saved = internshipRepository.save(Internship.builder()
                .companyName("Temp Corp")
                .role("Temp Role")
                .location("Remote")
                .description("Temp Desc")
                .eligibility("Temp Elig")
                .applicationDeadline(LocalDate.now().plusDays(5))
                .build());

        Long id = saved.getId();
        internshipRepository.deleteById(id);

        assertThat(internshipRepository.findById(id)).isEmpty();
    }

    // ===================================================================
    //  Milestone 6 — Specification / filter tests
    //  (existing tests above are not modified)
    // ===================================================================

    // ------------------------------------------------------------------ //
    //  Location filter                                                     //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("Specification: location contains keyword (case-insensitive)")
    void testSpec_locationContains() {
        internshipRepository.save(Internship.builder()
                .companyName("RemoteCo").role("Dev").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());
        internshipRepository.save(Internship.builder()
                .companyName("OnSiteCo").role("Dev").location("Bangalore Office")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());

        List<Internship> results = internshipRepository.findAll(
                InternshipSpecification.locationContains("bangalore"));

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getLocation()).isEqualTo("Bangalore Office");
    }

    // ------------------------------------------------------------------ //
    //  Active-only filter                                                  //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("Specification: isActive returns internship with today's deadline")
    void testSpec_isActive_includesDeadlineToday() {
        // Deadline = today → must be INCLUDED
        internshipRepository.save(Internship.builder()
                .companyName("TodayCo").role("Dev").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now()).build());

        List<Internship> results = internshipRepository.findAll(
                InternshipSpecification.isActive());

        assertThat(results).extracting(Internship::getCompanyName)
                .contains("TodayCo");
    }

    @Test
    @DisplayName("Specification: isActive excludes internship with yesterday's deadline")
    void testSpec_isActive_excludesPastDeadline() {
        // Deadline = yesterday → must be EXCLUDED
        internshipRepository.save(Internship.builder()
                .companyName("ExpiredCo").role("Dev").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().minusDays(1)).build());
        // Deadline = tomorrow → INCLUDED
        internshipRepository.save(Internship.builder()
                .companyName("FutureCo").role("Dev").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(1)).build());

        List<Internship> results = internshipRepository.findAll(
                InternshipSpecification.isActive());

        assertThat(results).extracting(Internship::getCompanyName)
                .doesNotContain("ExpiredCo")
                .contains("FutureCo");
    }

    // ------------------------------------------------------------------ //
    //  Combined filters                                                    //
    // ------------------------------------------------------------------ //

    @Test
    @DisplayName("Specification: combined companyName + location filters")
    void testSpec_combined_companyAndLocation() {
        // Match: company contains "apex", location contains "remote"
        internshipRepository.save(Internship.builder()
                .companyName("Apex Tech").role("Dev").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());
        // No match: company contains "apex" but location does not match
        internshipRepository.save(Internship.builder()
                .companyName("Apex Corp").role("Dev").location("Bangalore")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());
        // No match: location matches but company does not
        internshipRepository.save(Internship.builder()
                .companyName("Other Co").role("Dev").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());

        Specification<Internship> spec =
                InternshipSpecification.companyNameContains("apex")
                        .and(InternshipSpecification.locationContains("remote"));

        List<Internship> results = internshipRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCompanyName()).isEqualTo("Apex Tech");
    }

    @Test
    @DisplayName("Specification: buildFilter with no params returns all rows")
    void testSpec_buildFilter_noParams_returnsAll() {
        internshipRepository.save(Internship.builder()
                .companyName("Co A").role("R A").location("L A")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(5)).build());
        internshipRepository.save(Internship.builder()
                .companyName("Co B").role("R B").location("L B")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(5)).build());

        // All params null/false → equivalent to findAll()
        Specification<Internship> spec =
                InternshipSpecification.buildFilter(null, null, null, false);

        List<Internship> results = internshipRepository.findAll(spec);

        assertThat(results).hasSize(2);
    }

    @Test
    @DisplayName("Specification: buildFilter combined — company + role + activeOnly")
    void testSpec_buildFilter_companyRoleAndActiveOnly() {
        // Match: tech company, java role, future deadline
        internshipRepository.save(Internship.builder()
                .companyName("TechFirm").role("Java Intern").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());
        // No match: tech company, java role, but expired deadline
        internshipRepository.save(Internship.builder()
                .companyName("TechFirm").role("Java Intern").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().minusDays(1)).build());
        // No match: active, but different company
        internshipRepository.save(Internship.builder()
                .companyName("OtherCo").role("Java Intern").location("Remote")
                .description("D").eligibility("E")
                .applicationDeadline(LocalDate.now().plusDays(10)).build());

        Specification<Internship> spec =
                InternshipSpecification.buildFilter("TechFirm", "java", null, true);

        List<Internship> results = internshipRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCompanyName()).isEqualTo("TechFirm");
        assertThat(results.get(0).getApplicationDeadline()).isAfterOrEqualTo(LocalDate.now());
    }
}
