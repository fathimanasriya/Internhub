package com.internhub.sirs.controller;

import com.internhub.sirs.model.Notification;
import com.internhub.sirs.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Student and HR in-app notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get all notifications for authenticated student")
    public ResponseEntity<List<Notification>> getStudentNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getStudentNotifications(authentication.getName()));
    }

    @GetMapping("/student/unread-count")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get unread count for authenticated student")
    public ResponseEntity<Map<String, Long>> getStudentUnreadCount(Authentication authentication) {
        long count = notificationService.getStudentUnreadCount(authentication.getName());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PatchMapping("/student/{id}/read")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Mark student notification as read")
    public ResponseEntity<Notification> markStudentNotificationRead(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(notificationService.markAsRead(id, authentication.getName(), false));
    }

    @PostMapping("/student/mark-all-read")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Mark all student notifications as read")
    public ResponseEntity<Map<String, String>> markAllStudentNotificationsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName(), false);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @GetMapping("/hr")
    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Get all notifications for authenticated HR recruiter")
    public ResponseEntity<List<Notification>> getHrNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getHrNotifications(authentication.getName()));
    }

    @GetMapping("/hr/unread-count")
    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Get unread count for authenticated HR recruiter")
    public ResponseEntity<Map<String, Long>> getHrUnreadCount(Authentication authentication) {
        long count = notificationService.getHrUnreadCount(authentication.getName());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PatchMapping("/hr/{id}/read")
    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Mark HR notification as read")
    public ResponseEntity<Notification> markHrNotificationRead(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(notificationService.markAsRead(id, authentication.getName(), true));
    }

    @PostMapping("/hr/mark-all-read")
    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Mark all HR notifications as read")
    public ResponseEntity<Map<String, String>> markAllHrNotificationsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName(), true);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
