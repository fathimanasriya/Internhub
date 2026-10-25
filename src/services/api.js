/**
 * Centralized API helper for InternHub frontend-backend communication.
 * Base URL points to the Spring Boot REST API.
 */

const API_BASE_URL = 'http://localhost:8080/api'
const STUDENT_TOKEN_KEY = 'studentToken'
const STUDENT_KEY = 'internhubStudent'

const HR_TOKEN_KEY = 'hrToken'
const HR_KEY = 'internhubHR'
const HR_PROFILE_KEY = 'internhubHRProfile'

/**
 * Custom Error class that includes HTTP status code and response payload.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Retrieve saved student JWT token.
 * @returns {string|null}
 */
export function getAuthToken() {
  try {
    return localStorage.getItem(STUDENT_TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * Retrieve saved HR JWT token.
 * @returns {string|null}
 */
export function getHrAuthToken() {
  try {
    return localStorage.getItem(HR_TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * Store authenticated student session token and student data.
 * @param {string} token
 * @param {Object} student
 */
export function setAuthSession(token, student) {
  try {
    if (token) {
      localStorage.setItem(STUDENT_TOKEN_KEY, token)
    }
    if (student) {
      const studentData = {
        ...student,
        name: student.fullName || student.name,
        fullName: student.fullName || student.name,
      }
      localStorage.setItem(STUDENT_KEY, JSON.stringify(studentData))
    }
  } catch (err) {
    console.error('Error saving student auth session to localStorage:', err)
  }
}

/**
 * Clear student session data on logout.
 */
export function logoutStudent() {
  try {
    localStorage.removeItem(STUDENT_TOKEN_KEY)
    localStorage.removeItem(STUDENT_KEY)
  } catch (err) {
    console.error('Error clearing student auth session:', err)
  }
}

/**
 * Store authenticated HR session token and HR user data.
 * @param {string} token
 * @param {Object} hrUser
 */
export function setHrAuthSession(token, hrUser) {
  try {
    if (token) {
      localStorage.setItem(HR_TOKEN_KEY, token)
    }
    if (hrUser) {
      localStorage.setItem(HR_KEY, JSON.stringify(hrUser))
      localStorage.setItem(HR_PROFILE_KEY, JSON.stringify(hrUser))
    }
  } catch (err) {
    console.error('Error saving HR auth session to localStorage:', err)
  }
}

/**
 * Clear HR session data on logout.
 */
export function logoutHr() {
  try {
    localStorage.removeItem(HR_TOKEN_KEY)
    localStorage.removeItem(HR_KEY)
    localStorage.removeItem(HR_PROFILE_KEY)
  } catch (err) {
    console.error('Error clearing HR auth session:', err)
  }
}

/**
 * Generic request wrapper using the browser's native fetch API.
 * Automatically handles JWT header injection, JSON parsing, network errors, and non-2xx status codes.
 *
 * @param {string} endpoint - Path relative to API_BASE_URL (e.g. '/internships')
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Choose token depending on endpoint
  let token = null
  if (endpoint.startsWith('/hr') || endpoint === '/internships/my' || endpoint === '/applications/hr/my' || endpoint.startsWith('/notifications/hr')) {
    token = getHrAuthToken()
  } else if (endpoint.startsWith('/students/me') || endpoint.startsWith('/notifications/student')) {
    token = getAuthToken()
  } else if (endpoint === '/applications' && options.method === 'POST') {
    // Submitting application as a student
    token = getAuthToken()
  } else {
    // General endpoint (e.g. POST /internships can be HR)
    token = getHrAuthToken() || getAuthToken()
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Attach Authorization Bearer token if present and not already provided
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  let response
  try {
    response = await fetch(url, config)
  } catch (networkError) {
    throw new ApiError(
      `Unable to connect to backend server at ${API_BASE_URL}. Please ensure the Spring Boot application is running.`,
      0,
      networkError
    )
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  let responseData = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }
  } else {
    try {
      responseData = await response.text()
    } catch {
      responseData = null
    }
  }

  if (!response.ok) {
    const errorMessage =
      (responseData && typeof responseData === 'object' && (responseData.message || responseData.error)) ||
      `Request failed with status ${response.status} (${response.statusText})`
    throw new ApiError(errorMessage, response.status, responseData)
  }

  return responseData
}

// =============================================================================
// STUDENT AUTHENTICATION APIS
// =============================================================================

export async function registerStudent(data) {
  const payload = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone || null,
    college: data.college || null,
    course: data.course || null,
    department: data.department || null,
    yearSemester: data.yearSemester || null,
    studentCode: data.studentId || data.studentCode || null,
    skills: data.skills || null,
  }

  const response = await apiRequest('/auth/student/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (response && response.token) {
    setAuthSession(response.token, response.student)
  }

  return response
}

export async function loginStudent(credentials) {
  const payload = {
    email: credentials.email,
    password: credentials.password,
  }

  const response = await apiRequest('/auth/student/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (response && response.token) {
    setAuthSession(response.token, response.student)
  }

  return response
}

export async function getStudentProfile() {
  const student = await apiRequest('/students/me', {
    method: 'GET',
  })

  if (student) {
    const token = getAuthToken()
    setAuthSession(token, student)
  }

  return student
}

// =============================================================================
// HR AUTHENTICATION APIS
// =============================================================================

export async function registerHr(data) {
  const payload = {
    hrName: data.hrName,
    officialEmail: data.officialEmail,
    password: data.password,
    phone: data.phone,
    companyName: data.companyName,
    companyLocation: data.companyLocation,
    industry: data.industry || null,
    designation: data.designation || null,
    employeeId: data.employeeId || null,
  }

  const response = await apiRequest('/auth/hr/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (response && response.token) {
    setHrAuthSession(response.token, response.hrUser)
  }

  return response
}

export async function loginHr(credentials) {
  const payload = {
    officialEmail: credentials.officialEmail,
    password: credentials.password,
  }

  const response = await apiRequest('/auth/hr/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (response && response.token) {
    setHrAuthSession(response.token, response.hrUser)
  }

  return response
}

export async function getHrProfile() {
  const hrUser = await apiRequest('/hr/me', {
    method: 'GET',
  })

  if (hrUser) {
    const token = getHrAuthToken()
    setHrAuthSession(token, hrUser)
  }

  return hrUser
}

// =============================================================================
// INTERNSHIP MANAGEMENT APIS
// =============================================================================

/**
 * Fetch all public internships from the backend with optional query filters.
 */
export async function getInternships(params = {}) {
  const searchParams = new URLSearchParams()

  if (params.companyName && params.companyName.trim()) {
    searchParams.append('companyName', params.companyName.trim())
  }
  if (params.role && params.role.trim()) {
    searchParams.append('role', params.role.trim())
  }
  if (params.location && params.location.trim()) {
    searchParams.append('location', params.location.trim())
  }
  if (params.activeOnly !== undefined && params.activeOnly !== null) {
    searchParams.append('activeOnly', String(params.activeOnly))
  }

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/internships?${queryString}` : '/internships'
  return apiRequest(endpoint, { method: 'GET' })
}

/**
 * Fetch a single internship by its database ID.
 */
export async function getInternshipById(id) {
  return apiRequest(`/internships/${id}`, { method: 'GET' })
}

/**
 * Fetch internships posted by currently authenticated HR user.
 */
export async function getMyInternships() {
  return apiRequest('/internships/my', { method: 'GET' })
}

/**
 * Create a new internship posting (HR only).
 */
export async function createInternship(internshipData) {
  return apiRequest('/internships', {
    method: 'POST',
    body: JSON.stringify(internshipData),
  })
}

/**
 * Update an existing internship posting.
 */
export async function updateInternship(id, internshipData) {
  return apiRequest(`/internships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(internshipData),
  })
}

/**
 * Delete an internship posting by ID.
 */
export async function deleteInternship(id) {
  return apiRequest(`/internships/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Check backend service health.
 */
export async function checkBackendHealth() {
  return apiRequest('/health', { method: 'GET' })
}

// =============================================================================
// APPLICATION MANAGEMENT APIS
// =============================================================================

/**
 * Submit an application to an internship for the student.
 * @param {Object} applicationData { studentId, internshipId, notes }
 */
export async function submitApplication(applicationData) {
  return apiRequest('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  })
}

/**
 * Fetch all applications for the authenticated HR recruiter's internships.
 */
export async function getHrApplications() {
  return apiRequest('/applications/hr/my', { method: 'GET' })
}

/**
 * Fetch all applications for a student by studentId.
 */
export async function getStudentApplications(studentId) {
  return apiRequest(`/applications/student/${studentId}`, { method: 'GET' })
}

/**
 * Update status of an application (HR recruiter).
 * @param {number|string} applicationId
 * @param {string} status (e.g. APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED)
 */
export async function updateApplicationStatus(applicationId, status) {
  return apiRequest(`/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// =============================================================================
// NOTIFICATION APIS
// =============================================================================

/**
 * Fetch all notifications for the authenticated student.
 */
export async function getStudentNotifications() {
  return apiRequest('/notifications/student', { method: 'GET' })
}

/**
 * Get unread notification count for authenticated student.
 */
export async function getStudentUnreadNotificationCount() {
  return apiRequest('/notifications/student/unread-count', { method: 'GET' })
}

/**
 * Mark a student notification as read.
 */
export async function markStudentNotificationRead(id) {
  return apiRequest(`/notifications/student/${id}/read`, { method: 'PATCH' })
}

/**
 * Mark all student notifications as read.
 */
export async function markAllStudentNotificationsRead() {
  return apiRequest('/notifications/student/mark-all-read', { method: 'POST' })
}

/**
 * Fetch all notifications for the authenticated HR recruiter.
 */
export async function getHrNotifications() {
  return apiRequest('/notifications/hr', { method: 'GET' })
}

/**
 * Get unread notification count for authenticated HR recruiter.
 */
export async function getHrUnreadNotificationCount() {
  return apiRequest('/notifications/hr/unread-count', { method: 'GET' })
}

/**
 * Mark an HR notification as read.
 */
export async function markHrNotificationRead(id) {
  return apiRequest(`/notifications/hr/${id}/read`, { method: 'PATCH' })
}

/**
 * Mark all HR notifications as read.
 */
export async function markAllHrNotificationsRead() {
  return apiRequest('/notifications/hr/mark-all-read', { method: 'POST' })
}
