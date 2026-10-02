import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../auth.css'

function HRLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    officialEmail: '',
    password: '',
    rememberMe: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Frontend demo login
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

      {/* Main Login Card */}
      <main className="auth-container">
        <div className="auth-card">
          <span className="auth-badge hr-badge">HR & EMPLOYER PORTAL</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to your InternHub employer dashboard to post internship
            opportunities, review student applicants, and manage your talent pipeline.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Official Email */}
            <div className="form-group">
              <label htmlFor="hr-email" className="form-label">
                Official Email Address <span className="required-star">*</span>
              </label>
              <input
                id="hr-email"
                type="email"
                name="officialEmail"
                className="form-input"
                placeholder="name@company.com"
                value={formData.officialEmail}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="hr-password" className="form-label">
                Password <span className="required-star">*</span>
              </label>
              <input
                id="hr-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your account password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn">
              Login as HR / Recruiter →
            </button>
          </form>

          {/* Switch to Register */}
          <div className="auth-switch-text">
            Don't have an account?
            <Link to="/hr/register" className="auth-switch-link">
              Create HR Account
            </Link>
          </div>

          {/* Alternative Student Portal Switch */}
          <div className="auth-portal-switch">
            <Link to="/student/login" className="portal-switch-link">
              🎓 Looking for internships? Student Login
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

export default HRLogin
