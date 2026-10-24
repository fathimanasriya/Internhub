import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import heroImage from './assets/hero_workplace.jpg'
import StudentLogin from './pages/student/StudentLogin'
import StudentRegister from './pages/student/StudentRegister'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import StudentInternships from './pages/student/StudentInternships'
import StudentApplications from './pages/student/StudentApplications'
import StudentDocuments from './pages/student/StudentDocuments'
import StudentProgress from './pages/student/StudentProgress'
import StudentAIAssistant from './pages/student/StudentAIAssistant'
import StudentApplication from './pages/student/StudentApplication'
import HRLogin from './pages/hr/HRLogin'
import HRRegister from './pages/hr/HRRegister'
import HRDashboard from './pages/hr/HRDashboard'
import HRCompanyProfile from './pages/hr/HRCompanyProfile'
import HRInternships from './pages/hr/HRInternships'
import HRApplications from './pages/hr/HRApplications'
import HRInterns from './pages/hr/HRInterns'
import HRProgress from './pages/hr/HRProgress'
import HRCertificates from './pages/hr/HRCertificates'

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  // Sample Featured Internships Data
  const sampleInternships = [
    {
      id: 'swe-01',
      title: 'Software Development Intern',
      company: 'NovaTech Labs',
      companyInitial: 'N',
      category: 'Engineering',
      location: 'Remote / Bangalore',
      duration: '6 Months',
      type: 'Full-time / Hybrid',
      stipend: '₹25,000 / month',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Git'],
      description:
        'Collaborate with senior software engineers on building scalable web interfaces, optimizing RESTful APIs, and writing clean, tested React components for enterprise clients.',
      postedTime: '2 days ago',
    },
    {
      id: 'da-02',
      title: 'Data Analyst Intern',
      company: 'Stratum Analytics',
      companyInitial: 'S',
      category: 'Analytics',
      location: 'Mumbai (Hybrid)',
      duration: '3 Months',
      type: 'Hybrid',
      stipend: '₹20,000 / month',
      skills: ['Python', 'SQL', 'Power BI', 'Statistics'],
      description:
        'Analyze business performance datasets, create interactive Power BI dashboards, and prepare automated weekly executive reports under senior data scientist supervision.',
      postedTime: '3 days ago',
    },
    {
      id: 'ux-03',
      title: 'UI/UX Design Intern',
      company: 'Apex Studio',
      companyInitial: 'A',
      category: 'Design',
      location: 'Remote',
      duration: '4 Months',
      type: 'Flexible Hours',
      stipend: '₹22,000 / month',
      skills: ['Figma', 'Wireframing', 'Design Systems', 'User Research'],
      description:
        'Help conduct user interviews, iterate on high-fidelity Figma design components, and design responsive web application layouts following established brand guidelines.',
      postedTime: 'Just now',
    },
    {
      id: 'ba-04',
      title: 'Business Analyst Intern',
      company: 'Meridian Consulting',
      companyInitial: 'M',
      category: 'Business',
      location: 'Delhi NCR',
      duration: '6 Months',
      type: 'Full-time',
      stipend: '₹18,000 / month',
      skills: ['Excel Modeling', 'Market Research', 'Agile', 'Documentation'],
      description:
        'Work alongside engagement managers to map client workflows, formulate requirements documentation, and conduct competitive analysis across digital markets.',
      postedTime: '1 week ago',
    },
  ]

  const categories = ['All', 'Engineering', 'Analytics', 'Design', 'Business']

  const filteredInternships =
    activeCategory === 'All'
      ? sampleInternships
      : sampleInternships.filter((item) => item.category === activeCategory)

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName)
  }

  const closeRoleModal = () => {
    setSelectedRole(null)
  }

  const closeInternshipModal = () => {
    setSelectedInternship(null)
  }

  return (
    <div className="landing-wrapper">
      {/* ====================================================================
          1. NAVBAR
          ==================================================================== */}
      <header className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-brand">
          <img src="/internhub-logo.png" alt="InternHub Logo" className="nav-logo" />
            <span>Intern</span>
            <span className="brand-accent">
              Hub

            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-menu">
              <li>
                <a href="#home" className="nav-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="nav-link">
                  About
                </a>
              </li>
              <li>
                <a href="#opportunities" className="nav-link">
                  Opportunities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="nav-link">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="nav-actions">
            <Link to="/student/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <a href="#roles" className="btn btn-primary btn-sm">
              Get Started
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <a
            href="#home"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#about"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#opportunities"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Opportunities
          </a>
          <a
            href="#how-it-works"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#contact"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>

          <div className="mobile-actions">
            <Link
              to="/student/login"
              className="btn btn-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <a
              href="#roles"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. HERO SECTION
          ==================================================================== */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Internships • Talent • Growth</span>
            </div>

            <h1 className="hero-title">
              Find Opportunities. <span>Build Experience.</span> Shape Your
              Future.
            </h1>

            <p className="hero-description">
              InternHub connects students with internship opportunities and
              helps companies discover talented candidates through one simple
              platform.
            </p>

            <div className="hero-buttons">
              <a href="#opportunities" className="btn btn-primary btn-lg">
                Explore Internships
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

            </div>

            {/* Proof and Trust Chips */}
            <div className="hero-proof">
              <div className="proof-item">
                <span className="proof-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Verified Opportunities</span>
              </div>

              <div className="proof-item">
                <span className="proof-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Direct HR Connect</span>
              </div>

              <div className="proof-item">
                <span className="proof-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>No Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Right Visual Workplace Platform */}
          <div className="hero-visual-wrapper">
            <div className="hero-glow-bg"></div>

            <div className="hero-image-card">
              <img
                src={heroImage}
                alt="Modern professional workplace collaboration"
              />

              {/* Floating Highlight Card 1 */}
              <div className="hero-floating-card card-top">
                <div className="floating-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="floating-text">
                  <h5>New Opportunity</h5>
                  <p>UI/UX Design Intern • Apex Studio</p>
                </div>
              </div>

              {/* Floating Highlight Card 2 */}
              <div className="hero-floating-card card-bottom">
                <div className="floating-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <polyline points="17 11 19 13 23 9"></polyline>
                  </svg>
                </div>
                <div className="floating-text">
                  <h5>Candidate Shortlisted</h5>
                  <p>94% Skill Match • Ready for Review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ROLE SELECTION SECTION ("What brings you here?")
          ==================================================================== */}
      <section className="roles-section" id="roles">
        <div className="container">
          <div className="section-header">
            <span className="section-label">GET STARTED</span>
            <h2 className="section-title">What brings you here?</h2>
            <p className="section-subtitle">
              Choose your role to get started with InternHub.
            </p>
          </div>

          <div className="role-grid">
            {/* Student Card */}
            <div className="role-card">
              <div>
                <div className="role-card-header">
                  <div className="role-icon-box">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  </div>
                  <span className="role-badge">For Students</span>
                </div>

                <h3>Student</h3>
                <p className="role-card-text">
                  Discover internships, apply to opportunities, manage your
                  applications, and grow your career.
                </p>

                <ul className="role-features-list">
                  <li className="role-feature-item">
                    <svg
                      className="role-feature-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Browse curated and verified internship listings</span>
                  </li>
                  <li className="role-feature-item">
                    <svg
                      className="role-feature-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Track all application stages in a clean dashboard</span>
                  </li>
                  <li className="role-feature-item">
                    <svg
                      className="role-feature-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Discover roles matching your academic skills</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleRoleSelect('Student')}
              >
                Continue as Student →
              </button>
            </div>

            {/* HR / Company Card */}
            <div className="role-card">
              <div>
                <div className="role-card-header">
                  <div className="role-icon-box">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <span className="role-badge">For Employers</span>
                </div>

                <h3>HR / Company</h3>
                <p className="role-card-text">
                  Post internship opportunities, discover talented students,
                  review applications, and manage interns.
                </p>

                <ul className="role-features-list">
                  <li className="role-feature-item">
                    <svg
                      className="role-feature-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Post internship openings with precise requirements</span>
                  </li>
                  <li className="role-feature-item">
                    <svg
                      className="role-feature-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Filter and review structured student candidate profiles</span>
                  </li>
                  <li className="role-feature-item">
                    <svg
                      className="role-feature-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Shortlist applicants and coordinate candidate intake</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleRoleSelect('HR / Company')}
              >
                Continue as HR →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. WHY CHOOSE INTERNHUB?
          ==================================================================== */}
      <section className="section section-alt" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">WHY INTERNHUB</span>
            <h2 className="section-title">
              Everything you need to connect talent with opportunity.
            </h2>
            <p className="section-subtitle">
              Engineered to make internship discovery and recruitment seamless,
              transparent, and focused on genuine career progress.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <h4>Verified Opportunities</h4>
              <p>
                Discover relevant internship opportunities from verified
                partner companies with transparent requirements.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h4>Simple Applications</h4>
              <p>
                Apply and manage internship applications from one place with
                instant status updates and interview tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <h4>Talent Matching</h4>
              <p>
                Help students discover opportunities aligned with their skills,
                coursework, and targeted industry aspirations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h4>Career Growth</h4>
              <p>
                Build experience and move closer to your career goals with
                practical workplace exposure and mentor feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. HOW IT WORKS
          ==================================================================== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE PROCESS</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              A structured, four-step path designed to guide students and
              employers from initial sign-up to productive internship placement.
            </p>
          </div>

          <div className="steps-wrapper">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-header">
                <span className="step-number">01</span>
                <span className="step-badge">Step 1</span>
              </div>
              <h4>Choose Your Role</h4>
              <p>
                Select whether you are joining as a Student looking for
                internships, or as HR / Company seeking talent.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-header">
                <span className="step-number">02</span>
                <span className="step-badge">Step 2</span>
              </div>
              <h4>Create Your Account</h4>
              <p>
                Register and build your verified profile with skills,
                academic background, or corporate details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-header">
                <span className="step-number">03</span>
                <span className="step-badge">Step 3</span>
              </div>
              <h4>Connect</h4>
              <p>
                Students explore and apply to positions. Companies post openings
                and review qualified candidate applications.
              </p>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-header">
                <span className="step-number">04</span>
                <span className="step-badge">Step 4</span>
              </div>
              <h4>Grow</h4>
              <p>
                Students gain real-world experience, and companies discover
                promising future full-time talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. FEATURED INTERNSHIPS
          ==================================================================== */}
      <section className="section section-alt" id="opportunities">
        <div className="container">
          <div className="section-header">
            <span className="section-label">DEMO SAMPLE CONTENT</span>
            <h2 className="section-title">Featured Internship Opportunities</h2>
            <p className="section-subtitle">
              Explore opportunities that can help you take the next step in
              your career.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Internship Cards Grid */}
          <div className="internships-grid">
            {filteredInternships.map((internship) => (
              <div key={internship.id} className="internship-card">
                <div>
                  <div className="internship-top">
                    <div className="company-meta">
                      <div className="company-logo-avatar">
                        {internship.companyInitial}
                      </div>
                      <div className="company-info">
                        <h5>{internship.company}</h5>
                        <h3>{internship.title}</h3>
                      </div>
                    </div>
                    <span className="type-pill">{internship.type}</span>
                  </div>

                  <div className="internship-details">
                    <div className="detail-item">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{internship.location}</span>
                    </div>

                    <div className="detail-item">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{internship.duration}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="skills-wrapper">
                    {internship.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="internship-footer">
                  <div className="stipend-box">
                    <span className="stipend-label">Stipend</span>
                    <span className="stipend-amount">{internship.stipend}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedInternship(internship)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="opportunities-cta">
            <a href="#roles" className="btn btn-primary">
              View All Opportunities →
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. PLATFORM IMPACT / STATISTICS
          ==================================================================== */}
      <section className="section">
        <div className="container">
          <div className="stats-container">
            <span className="section-label">DEMO PLATFORM BENCHMARKS</span>
            <h2 className="section-title">
              Empowering Students & Partner Companies
            </h2>
            <p className="section-subtitle">
              Sample platform metrics illustrating our planned scale and
              community engagement.
            </p>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-val">5,000+</span>
                <span className="stat-lbl">Registered Students</span>
              </div>

              <div className="stat-item">
                <span className="stat-val">500+</span>
                <span className="stat-lbl">Partner Companies</span>
              </div>

              <div className="stat-item">
                <span className="stat-val">1,200+</span>
                <span className="stat-lbl">Internship Opportunities</span>
              </div>

              <div className="stat-item">
                <span className="stat-val">95%</span>
                <span className="stat-lbl">Application Success</span>
              </div>
            </div>

            <div className="sample-metrics-disclaimer">
              Sample platform metrics for demonstrative preview
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. TESTIMONIALS
          ==================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">USER STORIES</span>
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Realistic feedback representing student learners, talent
              managers, and alumni who rely on structured internship workflows.
            </p>
          </div>

          <div className="testimonials-grid">
            {/* Student Testimonial */}
            <div className="testimonial-card">
              <div>
                <div className="stars-rating">★★★★★</div>
                <p className="testimonial-quote">
                  "InternHub simplified my search during campus placement season.
                  Filtering roles by specific development stacks saved me weeks of
                  searching."
                </p>
              </div>

              <div className="testimonial-author">
                <div className="author-avatar">PS</div>
                <div className="author-info">
                  <h5>Priya Sharma</h5>
                  <p>Computer Science Student</p>
                  <span className="author-tag">Student</span>
                </div>
              </div>
            </div>

            {/* HR Manager Testimonial */}
            <div className="testimonial-card">
              <div>
                <div className="stars-rating">★★★★★</div>
                <p className="testimonial-quote">
                  "Our hiring team cut down intern screening time significantly.
                  Having standardized profiles and verified skills made finding
                  junior talent effortless."
                </p>
              </div>

              <div className="testimonial-author">
                <div className="author-avatar">MV</div>
                <div className="author-info">
                  <h5>Marcus Vance</h5>
                  <p>Head of Talent Acquisition</p>
                  <span className="author-tag">HR Manager</span>
                </div>
              </div>
            </div>

            {/* Recent Graduate Testimonial */}
            <div className="testimonial-card">
              <div>
                <div className="stars-rating">★★★★★</div>
                <p className="testimonial-quote">
                  "I started as a product design intern through the platform and
                  transitioned into a full-time role right upon graduation. The
                  application tracking was seamless."
                </p>
              </div>

              <div className="testimonial-author">
                <div className="author-avatar">AD</div>
                <div className="author-info">
                  <h5>Ananya Deshmukh</h5>
                  <p>Associate Product Designer</p>
                  <span className="author-tag">Recent Graduate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. FINAL CTA SECTION
          ==================================================================== */}
      <section className="cta-section" id="contact">
        <div className="container">
          <div className="cta-box">
            <div className="cta-glow-element"></div>
            <h2 className="cta-title">Your Next Opportunity Starts Here.</h2>
            <p className="cta-description">
              Whether you're looking for your first internship or your next
              talented intern, InternHub helps you take the next step.
            </p>

            <div className="cta-buttons">
              <a href="#opportunities" className="btn btn-white btn-lg">
                Find an Internship
              </a>
              <a href="#roles" className="btn btn-white-outline btn-lg">
                Post an Internship
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER
          ==================================================================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            {/* Brand Column */}
            <div className="footer-brand">
              <h3>
                Intern<span>Hub</span>
              </h3>
              <p>
                Cloud-Based AI-Assisted Internship Management System connecting
                ambitious student talent with forward-thinking employers.
              </p>
              <div className="footer-socials">
                <a
                  href="#home"
                  className="social-icon-btn"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a
                  href="#home"
                  className="social-icon-btn"
                  aria-label="Twitter / X"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#home" className="social-icon-btn" aria-label="GitHub">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="#home" className="footer-link">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="footer-link">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#opportunities" className="footer-link">
                    Opportunities
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="footer-link">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* For Students */}
            <div className="footer-col">
              <h4>For Students</h4>
              <ul className="footer-links">
                <li>
                  <a href="#opportunities" className="footer-link">
                    Browse Internships
                  </a>
                </li>
                <li>
                  <a href="#roles" className="footer-link">
                    Student Profile
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="footer-link">
                    Application Guide
                  </a>
                </li>
                <li>
                  <Link to="/student/login" className="footer-link">
                    Student Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Companies */}
            <div className="footer-col">
              <h4>For Companies</h4>
              <ul className="footer-links">
                <li>
                  <a href="#roles" className="footer-link">
                    Post an Internship
                  </a>
                </li>
                <li>
                  <a href="#roles" className="footer-link">
                    Talent Discovery
                  </a>
                </li>
                <li>
                  <a href="#about" className="footer-link">
                    Employer Guidelines
                  </a>
                </li>
                <li>
                  <Link to="/hr/login" className="footer-link">
                    Recruiter Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col footer-contact-info">
              <h4>Contact</h4>
              <p>support@internhub.demo</p>
              <p>+1 (555) 019-2834</p>
              <p>Bengaluru, India & Remote</p>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 InternHub. All rights reserved.</div>
            <div className="footer-bottom-links">
              <a href="#home">Privacy Policy</a>
              <a href="#home">Terms of Service</a>
              <a href="#home">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          ROLE SELECTION MODAL (Placeholder Action)
          ==================================================================== */}
      {selectedRole && (
        <div className="modal-overlay" onClick={closeRoleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeRoleModal}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="section-label">ROLE SELECTED</div>
            <h3 style={{ fontSize: '24px', margin: '12px 0 8px 0' }}>
              Proceeding as {selectedRole}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--muted-gray)',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}
            >
              {selectedRole === 'Student'
                ? 'You have selected the Student flow to discover internships, manage your applications, and build your career portfolio.'
                : 'You have selected the HR / Company flow to post openings, review student candidates, and manage your intern cohort.'}
            </p>

            <div
              style={{
                backgroundColor: 'var(--warm-gray)',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '24px',
                fontSize: '13px',
                color: 'var(--charcoal-soft)',
                border: '1px solid var(--warm-border)',
              }}
            >
              <strong>Frontend Preview Notice:</strong> Authentication logic
              and user accounts will be integrated in subsequent milestones.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to={selectedRole === 'Student' ? '/student/login' : '/hr/login'}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Go to Login Page →
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeRoleModal}
              >
                Back to Landing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          INTERNSHIP DETAIL PREVIEW MODAL
          ==================================================================== */}
      {selectedInternship && (
        <div className="modal-overlay" onClick={closeInternshipModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeInternshipModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="type-pill" style={{ marginBottom: '12px' }}>
              {selectedInternship.category} • {selectedInternship.type}
            </span>

            <h3 style={{ fontSize: '24px', margin: '8px 0 4px 0' }}>
              {selectedInternship.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--plum-primary)',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              {selectedInternship.company} • {selectedInternship.location}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: 'var(--warm-gray)',
                padding: '14px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '13px',
              }}
            >
              <div>
                <span
                  style={{
                    color: 'var(--muted-light)',
                    display: 'block',
                    fontSize: '11px',
                  }}
                >
                  DURATION
                </span>
                <strong>{selectedInternship.duration}</strong>
              </div>
              <div>
                <span
                  style={{
                    color: 'var(--muted-light)',
                    display: 'block',
                    fontSize: '11px',
                  }}
                >
                  STIPEND
                </span>
                <strong style={{ color: 'var(--plum-deep)' }}>
                  {selectedInternship.stipend}
                </strong>
              </div>
            </div>

            <h5
              style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '8px',
              }}
            >
              Role Description (Sample)
            </h5>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--muted-gray)',
                lineHeight: '1.6',
                marginBottom: '18px',
              }}
            >
              {selectedInternship.description}
            </p>

            <h5
              style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '8px',
              }}
            >
              Required Skills
            </h5>
            <div className="skills-wrapper" style={{ marginBottom: '24px' }}>
              {selectedInternship.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to="/student/login"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Apply via Login →
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeInternshipModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/internships" element={<StudentInternships />} />
      <Route path="/student/apply/:internshipId" element={<StudentApplication />} />
      <Route path="/student/applications" element={<StudentApplications />} />
      <Route path="/student/documents" element={<StudentDocuments />} />
      <Route path="/student/progress" element={<StudentProgress />} />
      <Route path="/student/ai-assistant" element={<StudentAIAssistant />} />

      <Route path="/hr/login" element={<HRLogin />} />
      <Route path="/hr/register" element={<HRRegister />} />
      <Route path="/hr/dashboard" element={<HRDashboard />} />
      <Route path="/hr/company-profile" element={<HRCompanyProfile />} />
      <Route path="/hr/internships" element={<HRInternships />} />
      <Route path="/hr/applications" element={<HRApplications />} />
      <Route
        path="/student/apply/:internshipId"
        element={<StudentApplication />}
      />
      <Route path="/hr/interns" element={<HRInterns />} />
      <Route path="/hr/progress" element={<HRProgress />} />
      <Route path="/hr/certificates" element={<HRCertificates />} />
    </Routes>
  )
}

export default App