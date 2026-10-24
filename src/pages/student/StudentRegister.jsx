import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../auth.css'

function StudentRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    department: '',
    yearSemester: '',
    studentId: '',
    skills: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    const student = {
      name: formData.fullName,
      fullName: formData.fullName,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone,
      college: formData.college,
      course: formData.course,
      department: formData.department,
      yearSemester: formData.yearSemester,
      studentId: formData.studentId,
      skills: formData.skills,
    }

    localStorage.setItem(
      'internhubStudent',
      JSON.stringify(student)
    )

    alert('Student Registration successful!')

    navigate('/student/dashboard')
  }

  return (
    <div className="auth-page">
      {/* Top Header Bar */}
      <header className="auth-header">
        <Link to="/" className="auth-brand">
          <span>Intern</span>
          <span className="brand-accent">Hub</span>
        </Link>
        <Link to="/" className="auth-back-link">
          ← Back to Home
        </Link>
      </header>

      {/* Main Registration Card */}
      <main className="auth-container">
        <div className="auth-card auth-card-wide">
          <span className="auth-badge">STUDENT REGISTRATION</span>
          <h1 className="auth-title">Create Your Student Account</h1>
          <p className="auth-subtitle">
            Join InternHub to explore verified internship opportunities, connect
            with leading companies, and track your career growth.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="e.g. Alex Johnson"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="alex@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* College */}
              <div className="form-group">
                <label htmlFor="college" className="form-label">
                  College / University <span className="required-star">*</span>
                </label>
                <input
                  id="college"
                  type="text"
                  name="college"
                  className="form-input"
                  placeholder="e.g. National Institute of Technology"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Course */}
              <div className="form-group">
                <label htmlFor="course" className="form-label">
                  Course <span className="required-star">*</span>
                </label>
                <input
                  id="course"
                  type="text"
                  name="course"
                  className="form-input"
                  placeholder="e.g. B.Tech / B.S. / MCA"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department <span className="required-star">*</span>
                </label>
                <input
                  id="department"
                  type="text"
                  name="department"
                  className="form-input"
                  placeholder="e.g. Computer Science & Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Year / Semester */}
              <div className="form-group">
                <label htmlFor="yearSemester" className="form-label">
                  Year / Semester <span className="required-star">*</span>
                </label>
                <input
                  id="yearSemester"
                  type="text"
                  name="yearSemester"
                  className="form-input"
                  placeholder="e.g. 3rd Year / 6th Semester"
                  value={formData.yearSemester}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Student ID */}
              <div className="form-group">
                <label htmlFor="studentId" className="form-label">
                  Student ID / Roll No. <span className="required-star">*</span>
                </label>
                <input
                  id="studentId"
                  type="text"
                  name="studentId"
                  className="form-input"
                  placeholder="e.g. CS2023-089"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Skills */}
              <div className="form-group full-width">
                <label htmlFor="skills" className="form-label">
                  Skills (comma separated) <span className="required-star">*</span>
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="e.g. React, Python, SQL, UI/UX Design, Git"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required-star">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required-star">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button type="submit" className="auth-submit-btn">
              Register as Student →
            </button>
          </form>

          {/* Switch to Login */}
          <div className="auth-switch-text">
            Already have an account?
            <Link to="/student/login" className="auth-switch-link">
              Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        © 2026 InternHub. All rights reserved. • Student Portal
      </footer>
    </div>
  )
}

export default StudentRegister
