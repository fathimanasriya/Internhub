package com.internhub.sirs.repository;

import com.internhub.sirs.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Notification> findByHrUserIdOrderByCreatedAtDesc(Long hrUserId);

    long countByStudentIdAndIsReadFalse(Long studentId);

    long countByHrUserIdAndIsReadFalse(Long hrUserId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.student.id = :studentId AND n.isRead = false")
    int markAllAsReadForStudent(@Param("studentId") Long studentId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.hrUser.id = :hrUserId AND n.isRead = false")
    int markAllAsReadForHr(@Param("hrUserId") Long hrUserId);
}
