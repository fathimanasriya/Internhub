# Student Internship Record System (SIRS) - Backend

Java 21 & Spring Boot REST API for the Student Internship Record System.

---

## 🛠️ Tech Stack & Prerequisites

* **Java Version:** 21 (LTS)
* **Framework:** Spring Boot 3.3.5
* **Build Tool:** Maven (wrapper included)
* **API Documentation:** SpringDoc OpenAPI 3.0 / Swagger UI
* **Database:** MySQL 8.0 (configured via environment variables)

---

## 🚀 How to Run the Backend

You can run the backend from the `backend/` directory using either PowerShell or Command Prompt.

### 1. Run using the Maven Wrapper (Recommended)
On Windows:
```powershell
.\mvnw.cmd spring-boot:run
```

Or using global Maven:
```powershell
mvn spring-boot:run
```

Once started, the application will listen on **`http://localhost:8080`**.

---

## 🧪 Verifying the Endpoints

### 1. Interactive Swagger UI
Open your browser and navigate to:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

You can view all API documentation and execute requests directly from the browser!

### 2. Health-Check Endpoint
Send a `GET` request to:
👉 **`http://localhost:8080/api/health`**

Expected JSON response:
```json
{
  "status": "UP",
  "service": "Student Internship Record System (SIRS) Backend",
  "version": "v1.0.0",
  "timestamp": "2026-10-20T01:19:23.782Z",
  "message": "Backend is healthy and running smoothly."
}
```

---

## 🔒 Environment Variable Configuration

Sensitive database credentials and connection parameters are injected via environment variables with safe development defaults:

| Environment Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DB_URL` | JDBC connection URL to MySQL | `jdbc:mysql://localhost:3306/internhub?...` |
| `DB_USERNAME` | MySQL database user | `root` |
| `DB_PASSWORD` | MySQL user password | *(empty by default)* |
| `CORS_ALLOWED_ORIGINS`| Allowed frontend origins | `http://localhost:5173` |

### Setting Environment Variables (Optional):
In PowerShell before running the app:
```powershell
$env:DB_PASSWORD="your_mysql_password"
.\mvnw.cmd spring-boot:run
```

---

## 🧪 Running Automated Tests

To run the automated test suite:
```powershell
.\mvnw.cmd test
```
All tests should pass with `BUILD SUCCESS`.
