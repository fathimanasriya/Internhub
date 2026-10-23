package com.internhub.sirs.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health Check Controller.
 * Provides a lightweight endpoint to verify backend service liveness.
 */
@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "System Health and Liveness API")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Check backend service health", description = "Returns service status, application name, timestamp, and version.")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("service", "Student Internship Record System (SIRS) Backend");
        health.put("version", "v1.0.0");
        health.put("timestamp", Instant.now().toString());
        health.put("message", "Backend is healthy and running smoothly.");

        return ResponseEntity.ok(health);
    }
}
