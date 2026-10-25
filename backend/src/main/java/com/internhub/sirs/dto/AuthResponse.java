package com.internhub.sirs.dto;

import com.internhub.sirs.model.HrUser;
import com.internhub.sirs.model.Student;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO returned after successful authentication for either Student or HR.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    @Schema(description = "JWT Bearer token")
    private String token;

    @Builder.Default
    @Schema(description = "Token type", example = "Bearer")
    private String type = "Bearer";

    @Schema(description = "Authenticated student profile details, if student login")
    private Student student;

    @Schema(description = "Authenticated HR user profile details, if HR login")
    private HrUser hrUser;
}
