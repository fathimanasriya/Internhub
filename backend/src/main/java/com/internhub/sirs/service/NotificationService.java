package com.internhub.sirs.service;

import com.internhub.sirs.exception.ResourceNotFoundException;
import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.model.Notification;
import com.internhub.sirs.model.Student;
import com.internhub.sirs.repository.HrUserRepository;
import com.internhub.sirs.repository.NotificationRepository;
import com.internhub.sirs.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;
    private final HrUserRepository hrUserRepository;

    @Transactional
    public Notification notifyStudent(
            Student student,
            String title,
            String message,
            String internshipTitle,
            Long applicationId,
            Long internshipId) {
        Notification notification = Notification.builder()
                .student(student)
                .title(title)
                .message(message)
                .relatedInternshipTitle(internshipTitle)
                .relatedApplicationId(applicationId)
                .relatedInternshipId(internshipId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification notifyHr(
            HrUser hrUser,
            String title,
            String message,
            String internshipTitle,
            Long applicationId,
            Long internshipId) {
        Notification notification = Notification.builder()
                .hrUser(hrUser)
                .title(title)
                .message(message)
                .relatedInternshipTitle(internshipTitle)
                .relatedApplicationId(applicationId)
                .relatedInternshipId(internshipId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getStudentNotifications(String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + studentEmail));
        return notificationRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    @Transactional(readOnly = true)
    public List<Notification> getHrNotifications(String hrEmail) {
        HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(hrEmail.trim())
                .orElseThrow(() -> new ResourceNotFoundException("HR not found with email: " + hrEmail));
        return notificationRepository.findByHrUserIdOrderByCreatedAtDesc(hrUser.getId());
    }

    @Transactional(readOnly = true)
    public long getStudentUnreadCount(String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + studentEmail));
        return notificationRepository.countByStudentIdAndIsReadFalse(student.getId());
    }

    @Transactional(readOnly = true)
    public long getHrUnreadCount(String hrEmail) {
        HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(hrEmail.trim())
                .orElseThrow(() -> new ResourceNotFoundException("HR not found with email: " + hrEmail));
        return notificationRepository.countByHrUserIdAndIsReadFalse(hrUser.getId());
    }

    @Transactional
    public Notification markAsRead(Long notificationId, String userEmail, boolean isHr) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (isHr) {
            if (notification.getHrUser() == null || !notification.getHrUser().getOfficialEmail().equalsIgnoreCase(userEmail.trim())) {
                throw new AccessDeniedException("You are not authorized to view this notification");
            }
        } else {
            if (notification.getStudent() == null || !notification.getStudent().getEmail().equalsIgnoreCase(userEmail.trim())) {
                throw new AccessDeniedException("You are not authorized to view this notification");
            }
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userEmail, boolean isHr) {
        if (isHr) {
            HrUser hrUser = hrUserRepository.findByOfficialEmailIgnoreCase(userEmail.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("HR not found with email: " + userEmail));
            notificationRepository.markAllAsReadForHr(hrUser.getId());
        } else {
            Student student = studentRepository.findByEmail(userEmail.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + userEmail));
            notificationRepository.markAllAsReadForStudent(student.getId());
        }
    }
}
