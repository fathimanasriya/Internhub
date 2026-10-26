import { useState, useEffect } from 'react'
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
import { getStudentProfile, getMyStudentApplications, getInternships, getAuthToken } from '../../services/api'

/**
 * StudentDashboard Component
 * Main dashboard for logged-in students in InternHub.
 */
function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [modalApplied, setModalApplied] = useState(false)

  // 1. Student Identity: Read name from localStorage (key: "internhubStudent"), fallback to "Student"
  const [studentName, setStudentName] = useState(() => {
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

  // 2. Profile Details: initialize with localStorage or defaults, then hydrate from backend /api/students/me
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          name: parsed.name || parsed.fullName || 'Student',
          email: parsed.email || '',
          college: parsed.college || 'College / University',
          course: parsed.course || 'Degree Program',
          year: parsed.yearSemester || parsed.year || '',
          skills: parsed.skills || '',
          phone: parsed.phone || '',
        }
      }
    } catch (err) {
      console.error('Error loading student profile:', err)
    }
    return {
      name: 'Student',
      email: '',
      college: 'College / University',
      course: 'Degree Program',
      year: '',
      skills: '',
      phone: '',
    }
  })

  // 3. Application Stats - initialized to 0 for real account, updated dynamically from real applications
  const [stats, setStats] = useState({
    totalApplications: 0,
    underReview: 0,
    shortlisted: 0,
    selected: 0,
  })

  // 4. Recent Applications - initialized to empty, updated from real applications
  const [applications, setApplications] = useState([])

  // 5. Recommended Internships - fetched from backend /api/internships
  const [internships, setInternships] = useState([])

  // Fetch live profile, applications, and internships from backend
  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    let isMounted = true

    // Fetch live profile
    getStudentProfile()
      .then((liveProfile) => {
        if (!isMounted || !liveProfile) return
        const displayName = liveProfile.fullName || liveProfile.name || 'Student'
        setStudentName(displayName)
        setProfile((prev) => ({
          ...prev,
          ...liveProfile,
          name: displayName,
          email: liveProfile.email || prev.email,
          college: liveProfile.college || prev.college,
          course: liveProfile.course || prev.course,
          year: liveProfile.yearSemester || prev.year,
          skills: liveProfile.skills || prev.skills,
          phone: liveProfile.phone || prev.phone,
        }))
      })
      .catch((err) => {
        console.warn('Could not load live profile from /api/students/me:', err.message)
      })

    // Fetch real applications submitted by this student
    getMyStudentApplications()
      .then((apps) => {
        if (!isMounted || !Array.isArray(apps)) return

        // Compute dynamic stats based on logged-in student's real applications
        const total = apps.length
        const underReviewCount = apps.filter(
          (a) => a.status === 'UNDER_REVIEW' || a.status === 'APPLIED'
        ).length
        const shortlistedCount = apps.filter((a) => a.status === 'SHORTLISTED').length
        const selectedCount = apps.filter(
          (a) => a.status === 'SELECTED' || a.status === 'ACCEPTED'
        ).length

        setStats({
          totalApplications: total,
          underReview: underReviewCount,
          shortlisted: shortlistedCount,
          selected: selectedCount,
        })

        // Map real recent applications
        const recent = apps.slice(0, 5).map((app) => {
          let dateStr = 'Recently'
          if (app.appliedDate) {
            try {
              dateStr = new Date(app.appliedDate).toISOString().split('T')[0]
            } catch {
              dateStr = String(app.appliedDate)
            }
          }

          let displayStatus = 'Applied'
          if (app.status === 'SHORTLISTED') displayStatus = 'Shortlisted'
          else if (app.status === 'UNDER_REVIEW') displayStatus = 'Under Review'
          else if (app.status === 'REJECTED') displayStatus = 'Rejected'
          else if (app.status === 'SELECTED') displayStatus = 'Selected'

          return {
            id: app.id,
            company: app.internship?.companyName || 'Company',
            companyLogo: (app.internship?.companyName || 'C').charAt(0),
            role: app.internship?.role || 'Internship Role',
            appliedDate: dateStr,
            status: displayStatus,
            location: app.internship?.location || 'Remote',
            stipend: 'Competitive',
          }
        })

        setApplications(recent)
      })
      .catch((err) => {
        console.warn('Could not load student applications for dashboard:', err.message)
      })

    // Fetch live active internships
    getInternships({ activeOnly: true })
      .then((list) => {
        if (!isMounted || !Array.isArray(list)) return
        if (list.length > 0) {
          const mapped = list.slice(0, 6).map((item) => ({
            id: item.id,
            company: item.companyName,
            companyInitial: (item.companyName || 'C').charAt(0),
            role: item.role,
            location: item.location,
            duration: '3 Months',
            stipend: 'Competitive',
            type: item.location?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
            deadline: item.applicationDeadline,
            skills: item.eligibility
              ? item.eligibility.split(',').map((s) => s.trim()).filter(Boolean)
              : ['Java', 'React'],
            description: item.description,
            eligibility: item.eligibility,
          }))
          setInternships(mapped)
        } else {
          setInternships([])
        }
      })
      .catch((err) => {
        console.warn('Could not load recommended internships:', err.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Dynamic Profile Completion calculation
  const profileCompletion = useMemo(() => {
    let completed = 0
    const total = 5
    if (profile.name && profile.name !== 'Student') completed++
    if (profile.email) completed++
    if (profile.college && profile.college !== 'College / University') completed++
    if (profile.course && profile.course !== 'Degree Program') completed++
    if (profile.skills) completed++
    return Math.round((completed / total) * 100)
  }, [profile])

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
                <span className="completion-percentage">{profileCompletion}%</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={profileCompletion}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-fill"
                  style={{ width: `${profileCompletion}%` }}
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

            <div className="internships-grid">
              {internships.length > 0 ? (
                internships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    onSelectDetails={handleOpenDetails}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 20px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  <p style={{ margin: '0 0 12px', fontSize: '15px' }}>No active internships posted yet. New opportunities will appear here soon!</p>
                  <Link to="/student/internships" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '14px' }}>
                    Browse All Internships
                  </Link>
                </div>
              )}
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
