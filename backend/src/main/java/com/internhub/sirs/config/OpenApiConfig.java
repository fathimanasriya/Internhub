package com.internhub.sirs.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI 3.0 Configuration.
 * Configures the interactive Swagger UI available at /swagger-ui.html.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sirsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Student Internship Record System (SIRS) API")
                        .description("REST API backend for managing student internships, applications, company profiles, and progress tracking.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("InternHub Engineering")
                                .email("support@internhub.local"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
