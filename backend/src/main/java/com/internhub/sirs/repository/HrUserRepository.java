package com.internhub.sirs.repository;

import com.internhub.sirs.model.HrUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for HrUser entity.
 */
@Repository
public interface HrUserRepository extends JpaRepository<HrUser, Long> {

    Optional<HrUser> findByOfficialEmailIgnoreCase(String officialEmail);

    boolean existsByOfficialEmailIgnoreCase(String officialEmail);
}
