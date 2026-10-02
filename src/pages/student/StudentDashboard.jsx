import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Trophy,
  Search,
  UploadCloud,
  FileText,
  ArrowRight,
  X,
  Check,
} from 'lucide-react'
import './StudentDashboard.css'
// Reusable Subcomponents
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import AIAssistant from '../../components/student/AIAssistant'
import StatCard from '../../components/student/StatCard'
import ApplicationsTable from '../../components/student/ApplicationsTable'
import InternshipCard from '../../components/student/InternshipCard'

// Mock Data Source
import {
  mockStudentProfile,
  mockStudentStats,
  mockRecentApplications,
  mockRecommendedInternships,
} from '../../data/studentMockData'

/**
 * StudentDashboard Component
 * Main dashboard for logged-in students in InternHub.
 */
function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [modalApplied, setModalApplied] = useState(false)

  // 1. Student Identity: Read name from localStorage (key: "internhubStudent"), fallback to "Student"
  const [studentName] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.name || parsed.fullName || 'Student'
      }
    } catch (err) {
      console.error('Error parsing internhubStudent from localStorage:', err)
    }
    return 'Student'
  })

  // 2. Profile Details (TODO: replace with API call: GET /api/student/profile)
  const [profile] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...mockStudentProfile,
          ...parsed,
          name: parsed.name || parsed.fullName || mockStudentProfile.name,
          email: parsed.email || mockStudentProfile.email,
          college: parsed.college || mockStudentProfile.college,
          course: parsed.course || mockStudentProfile.course,
          year: parsed.yearSemester || parsed.year || mockStudentProfile.year,
        }
      }
    } catch (err) {
      console.error('Error loading student profile:', err)
    }
    return mockStudentProfile
  })

  // 3. Application Stats (TODO: replace with API call: GET /api/student/stats)
  const [stats] = useState(mockStudentStats)

  // 4. Recent Applications (TODO: replace with API call: GET /api/student/applications/recent)
  const [applications] = useState(mockRecentApplications)

  // 5. Recommended Internships (TODO: replace with API call: GET /api/student/internships/recommended)
  const [internships] = useState(mockRecommendedInternships)

  // Compute initials for avatar
  const displayName = studentName !== 'Student' ? studentName : profile.name
  const initials = displayName
    .trim()
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleOpenDetails = (internship) => {
    setSelectedInternship(internship)
    setModalApplied(false)
  }

  const handleCloseDetails = () => {
    setSelectedInternship(null)
    setModalApplied(false)
  }

  return (
    <div className="student-dashboard-layout">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        {/* Slim Topbar */}
        <Topbar
          studentName={displayName}
          initials={initials}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Student Dashboard"
        />

        <main className="dashboard-container">
          {/* ================================================================
              1. Welcome Banner
              ================================================================ */}
          <section className="welcome-banner" aria-labelledby="welcome-heading">
            <div className="welcome-content">
              <span className="welcome-badge">Career Launchpad</span>
              <h2 id="welcome-heading" className="welcome-title">
                Welcome back, {studentName}!
              </h2>
              <p className="welcome-subtitle">
                Track your active applications, discover AI-recommended opportunities matching your
                skills, and take the next step toward your dream internship.
              </p>
            </div>
            <div className="welcome-action-wrapper">
              <Link to="/student/internships" className="btn-banner-action">
                <Search size={18} />
                <span>Find Internships</span>
              </Link>
            </div>
          </section>

          {/* ================================================================
              2. Profile Summary Card
              ================================================================ */}
          <section className="profile-summary-card" aria-label="Profile Summary">
            <div className="profile-identity-group">
              <div className="profile-avatar-large" aria-hidden="true">
                {initials}
              </div>
              <div className="profile-details">
                <div className="profile-name-row">
                  <h3 className="profile-name">{displayName}</h3>
                  <span className="profile-verified-badge">Verified Student</span>
                </div>
                <p className="profile-email">{profile.email}</p>
                <p className="profile-academic-meta">
                  {profile.college} <span>•</span> {profile.course} <span>•</span> {profile.year}
                </p>
              </div>
            </div>

            {/* Profile Completion Progress */}
            <div className="profile-completion-section">
              <div className="completion-header">
                <span className="completion-label">Profile Completion</span>
                <span className="completion-percentage">{profile.profileCompletion}%</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={profile.profileCompletion}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-fill"
                  style={{ width: `${profile.profileCompletion}%` }}
                />
              </div>
            </div>

            {/* Complete Profile Button */}
            <div className="profile-action-wrapper">
              <Link to="/student/profile" className="btn btn-secondary">
                Complete Profile
              </Link>
            </div>
          </section>

          {/* ================================================================
              3. Application Stats Row (4 Cards)
              ================================================================ */}
          <section className="stats-grid" aria-label="Application Statistics">
            {/* Total Applications - TODO: replace with API call */}
            <StatCard
              icon={Briefcase}
              value={stats.totalApplications}
              label="Total Applications"
              subtitle="All time submissions"
            />
            {/* Under Review - TODO: replace with API call */}
            <StatCard
              icon={Clock}
              value={stats.underReview}
              label="Under Review"
              subtitle="Being evaluated by HR"
            />
            {/* Shortlisted - TODO: replace with API call */}
            <StatCard
              icon={CheckCircle2}
              value={stats.shortlisted}
              label="Shortlisted"
              subtitle="Advanced to interview round"
            />
            {/* Selected - TODO: replace with API call */}
            <StatCard
              icon={Trophy}
              value={stats.selected}
              label="Selected"
              subtitle="Offers extended"
            />
          </section>

          {/* ================================================================
              4. Quick Actions
              ================================================================ */}
          <section className="quick-actions-section" aria-label="Quick Actions">
            <h3 className="section-heading-sm">Quick Actions</h3>
            <div className="quick-actions-grid">
              <Link to="/student/internships" className="quick-action-card">
                <div className="quick-action-icon">
                  <Search size={22} />
                </div>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">Find Internships</h4>
                  <p className="quick-action-desc">Explore verified industry openings</p>
                </div>
                <ArrowRight size={18} className="quick-action-arrow" />
              </Link>

              <Link to="/student/documents" className="quick-action-card">
                <div className="quick-action-icon">
                  <UploadCloud size={22} />
                </div>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">Upload Resume</h4>
                  <p className="quick-action-desc">Update CV & certifications</p>
                </div>
                <ArrowRight size={18} className="quick-action-arrow" />
              </Link>

              <Link to="/student/applications" className="quick-action-card">
                <div className="quick-action-icon">
                  <FileText size={22} />
                </div>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">View Applications</h4>
                  <p className="quick-action-desc">Check timeline & HR feedback</p>
                </div>
                <ArrowRight size={18} className="quick-action-arrow" />
              </Link>
            </div>
          </section>

          {/* ================================================================
              5. Recent Applications Table
              ================================================================ */}
          <section aria-label="Recent Applications">
            {/* TODO: replace with API call: GET /api/student/applications/recent */}
            <ApplicationsTable applications={applications} />
          </section>

          {/* ================================================================
              6. Recommended Internships Grid
              ================================================================ */}
          <section className="recommended-section" aria-label="Recommended Internships">
            <div className="recommended-header-row">
              <div>
                <h3 className="card-title">Recommended Internships</h3>
                <p className="card-subtitle">
                  Curated opportunities based on your skills and academic profile
                </p>
              </div>
              <Link to="/student/internships" className="card-action-link">
                <span>Explore All</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* TODO: replace with API call: GET /api/student/internships/recommended */}
            <div className="internships-grid">
              {internships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onSelectDetails={handleOpenDetails}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
      {/* Details Modal */}

      {selectedInternship && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-company">{selectedInternship.company}</span>
                <h2 className="modal-role">{selectedInternship.role}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseDetails}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-details-grid">
              <div className="modal-grid-item">
                <span className="modal-grid-label">Location</span>
                <span className="modal-grid-val">{selectedInternship.location}</span>
              </div>
              <div className="modal-grid-item">
                <span className="modal-grid-label">Duration</span>
                <span className="modal-grid-val">{selectedInternship.duration}</span>
              </div>
              <div className="modal-grid-item">
                <span className="modal-grid-label">Stipend</span>
                <span className="modal-grid-val">{selectedInternship.stipend}</span>
              </div>
            </div>

            <div className="modal-body">
              <p>{selectedInternship.description}</p>
            </div>

            {selectedInternship.skills && (
              <div className="modal-skills-section">
                <h4 className="modal-section-title">Required Competencies</h4>
                <div className="skills-tags-container">
                  {selectedInternship.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>
                Close
              </button>
              <button
                type="button"
                className={`btn ${modalApplied ? 'btn-applied' : 'btn-primary'}`}
                onClick={() => setModalApplied(true)}
                disabled={modalApplied}
              >
                {modalApplied ? (
                  <>
                    <Check size={16} /> Applied
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
