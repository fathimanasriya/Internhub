import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../auth.css'

function HRRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    hrName: '',
    officialEmail: '',
    phone: '',
    companyName: '',
    companyLocation: '',
    industry: '',
    designation: '',
    employeeId: '',
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
    navigate('/hr/dashboard')
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
          <span className="auth-badge hr-badge">HR & EMPLOYER REGISTRATION</span>
          <h1 className="auth-title">Create Your HR Account</h1>
          <p className="auth-subtitle">
            Register your organization on InternHub to publish verified
            internships, discover ambitious student talent, and streamline candidate hiring.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              {/* HR Name */}
              <div className="form-group">
                <label htmlFor="hrName" className="form-label">
                  HR / Recruiter Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="hrName"
                  type="text"
                  name="hrName"
                  className="form-input"
                  placeholder="e.g. Sarah Mitchell"
                  value={formData.hrName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Official Email */}
              <div className="form-group">
                <label htmlFor="officialEmail" className="form-label">
                  Official Work Email <span className="required-star">*</span>
                </label>
                <input
                  id="officialEmail"
                  type="email"
                  name="officialEmail"
                  className="form-input"
                  placeholder="sarah@company.com"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Contact Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Company Name */}
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name <span className="required-star">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  className="form-input"
                  placeholder="e.g. NovaTech Labs Pvt Ltd"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Company Location */}
              <div className="form-group">
                <label htmlFor="companyLocation" className="form-label">
                  Company Location / City <span className="required-star">*</span>
                </label>
                <input
                  id="companyLocation"
                  type="text"
                  name="companyLocation"
                  className="form-input"
                  placeholder="e.g. Bengaluru, Karnataka (or Remote)"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Industry */}
              <div className="form-group">
                <label htmlFor="industry" className="form-label">
                  Industry / Sector <span className="required-star">*</span>
                </label>
                <input
                  id="industry"
                  type="text"
                  name="industry"
                  className="form-input"
                  placeholder="e.g. Information Technology / Fintech"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Designation */}
              <div className="form-group">
                <label htmlFor="designation" className="form-label">
                  Job Designation <span className="required-star">*</span>
                </label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  className="form-input"
                  placeholder="e.g. Talent Acquisition Lead / HR Manager"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Employee / HR ID */}
              <div className="form-group">
                <label htmlFor="employeeId" className="form-label">
                  Employee / HR ID <span className="required-star">*</span>
                </label>
                <input
                  id="employeeId"
                  type="text"
                  name="employeeId"
                  className="form-input"
                  placeholder="e.g. EMP-2041"
                  value={formData.employeeId}
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
                  placeholder="Create a secure password"
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
              Register Company Account →
            </button>
          </form>

          {/* Switch to Login */}
          <div className="auth-switch-text">
            Already have an account?
            <Link to="/hr/login" className="auth-switch-link">
              Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        © 2026 InternHub. All rights reserved. • HR & Recruiter Portal
      </footer>
    </div>
  )
}

export default HRRegister
