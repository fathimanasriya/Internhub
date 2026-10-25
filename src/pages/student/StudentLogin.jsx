import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginStudent, ApiError } from '../../services/api'
import '../auth.css'

function StudentLogin() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      await loginStudent({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      navigate('/student/dashboard')
    } catch (err) {
      console.error('Student login error:', err)
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setErrorMessage('Invalid email or password. Please verify your credentials and try again.')
        } else {
          setErrorMessage(err.message || 'Login failed. Please check your credentials.')
        }
      } else {
        setErrorMessage('Unable to connect to the authentication server. Please ensure the backend is running.')
      }
    } finally {
      setLoading(false)
    }
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

          <span className="auth-badge">
            STUDENT PORTAL
          </span>

          <h1 className="auth-title">
            Welcome Back
          </h1>

          <p className="auth-subtitle">
            Log in to your InternHub student account to track your internship
            applications, explore new openings, and grow your career.
          </p>

          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #f87171',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                lineHeight: 1.4,
              }}
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* Email Field */}
            <div className="form-group">

              <label
                htmlFor="student-email"
                className="form-label"
              >
                Email Address <span className="required-star">*</span>
              </label>

              <input
                id="student-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Password Field */}
            <div className="form-group">

              <label
                htmlFor="student-password"
                className="form-label"
              >
                Password <span className="required-star">*</span>
              </label>

              <input
                id="student-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* Remember Me / Forgot Password */}
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

              <a
                href="#forgot"
                className="forgot-link"
              >
                Forgot password?
              </a>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Student →'}
            </button>

          </form>


          {/* Register Link */}
          <div className="auth-switch-text">

            Don't have an account?

            <Link
              to="/student/register"
              className="auth-switch-link"
            >
              Create Student Account
            </Link>

          </div>


          {/* HR Portal */}
          <div className="auth-portal-switch">

            <Link
              to="/hr/login"
              className="portal-switch-link"
            >
              🏢 Are you an employer? Log in as HR
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

export default StudentLogin
