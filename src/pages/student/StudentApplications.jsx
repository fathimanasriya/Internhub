import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Briefcase,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  ArrowRight,
  ArrowLeft,
  X,
  Paperclip,
  Search,
  FileCheck,
  User,
  GraduationCap,
  Sparkles,
  MapPin,
  Banknote,
  RotateCcw,
} from 'lucide-react'
import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'

/**
 * Normalizes an application record loaded from localStorage.
 * Accommodates variations in field naming to ensure smooth rendering.
 */
function normalizeApplication(app, index) {
  // Parse skills
  let skillsArray = []
  if (Array.isArray(app.skills)) {
    skillsArray = app.skills
  } else if (typeof app.skills === 'string' && app.skills.trim()) {
    skillsArray = app.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  // Format applied date
  let formattedDate = 'Recently'
  if (app.appliedDate) {
    formattedDate = app.appliedDate
  } else if (app.submittedAt) {
    try {
      formattedDate = new Date(app.submittedAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      formattedDate = 'Recently'
    }
  }

  // Parse additional documents
  const rawDocs = app.additionalDocumentNames || app.additionalDocs || []
  const docsList = Array.isArray(rawDocs) ? rawDocs : []

  // Resume name
  const resumeName =
    app.resumeName || (typeof app.resume === 'string' ? app.resume : app.resume?.name) || ''

  return {
    id: app.id || `app-${index + 1}`,
    internshipId: app.internshipId || `INT-${index + 1}`,
    internshipTitle: app.internshipTitle || app.title || app.role || 'Internship Role',
    company: app.company || 'Partner Company',
    companyInitial: app.companyInitial || (app.company ? app.company.charAt(0) : 'C'),
    status: app.status || 'Applied',
    appliedDate: formattedDate,
    fullName: app.fullName || app.studentName || 'Student',
    email: app.email || 'student@college.edu',
    phone: app.phone || 'Not provided',
    college: app.college || 'Not provided',
    course: app.course || 'Not provided',
    department: app.department || 'Not provided',
    year: app.year || '',
    semester: app.semester || '',
    studentId: app.studentId || 'Not provided',
    cgpa: app.cgpa || '',
    skills: skillsArray,
    whyJoin: app.whyInternship || app.whyJoin || '',
    availability: app.availability || 'Immediately',
    workMode: app.workMode || 'Hybrid',
    resumeName,
    additionalDocumentNames: docsList,
    location: app.location || '',
    stipend: app.stipend || '',
  }
}

/**
 * Returns appropriate CSS class for an application status.
 */
function getStatusBadgeClass(status) {
  const s = (status || '').toLowerCase()
  if (s === 'selected') return 'myapps-status-selected'
  if (s === 'under review') return 'myapps-status-under-review'
  if (s === 'rejected') return 'myapps-status-rejected'
  return 'myapps-status-applied'
}

/**
 * StudentApplications Component
 * Full My Applications tracker reading real frontend-submitted applications from localStorage.
 * Route: /student/applications
 */
function StudentApplications() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)

  // Student Identity: read from localStorage (key: "internhubStudent"), fallback to mock data
  const [studentName] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.name || parsed.fullName || 'Student'
      }
    } catch {
      // fallback
    }
    return mockStudentProfile.name || 'Student'
  })

  const initials = studentName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST'

  // Load applications from localStorage (key: "internhubApplications")
  const rawApplications = useMemo(() => {
    try {
      const stored = localStorage.getItem('internhubApplications')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.map((item, index) => normalizeApplication(item, index))
        }
      }
    } catch (err) {
      console.error('Error loading internhubApplications from localStorage:', err)
    }
    return []
  }, [])

  // Dynamic Status Summary Metrics
  const metrics = useMemo(() => {
    const total = rawApplications.length
    const applied = rawApplications.filter(
      (a) => (a.status || '').toLowerCase() === 'applied'
    ).length
    const underReview = rawApplications.filter(
      (a) => (a.status || '').toLowerCase() === 'under review'
    ).length
    const selected = rawApplications.filter(
      (a) => (a.status || '').toLowerCase() === 'selected'
    ).length
    const rejected = rawApplications.filter(
      (a) => (a.status || '').toLowerCase() === 'rejected'
    ).length
    return { total, applied, underReview, selected, rejected }
  }, [rawApplications])

  // Filtered applications list based on status tab and search
  const filteredApplications = useMemo(() => {
    return rawApplications.filter((app) => {
      // Status filter
      if (statusFilter !== 'All') {
        if (app.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const matchesCompany = app.company.toLowerCase().includes(q)
        const matchesRole = app.internshipTitle.toLowerCase().includes(q)
        const matchesSkills = app.skills.some((s) => s.toLowerCase().includes(q))
        if (!matchesCompany && !matchesRole && !matchesSkills) {
          return false
        }
      }

      return true
    })
  }, [rawApplications, statusFilter, searchQuery])

  return (
    <div className="student-dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        <Topbar
          studentName={studentName}
          initials={initials}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="My Applications"
        />

        <main className="dashboard-container">
          {/* ================================================================
              Page Header
              ================================================================ */}
          <div className="myapps-page-header">
            <h1 className="myapps-page-title">My Applications</h1>
            <p className="myapps-page-subtitle">
              Track and manage all your internship applications in one place.
            </p>
          </div>

          {/* ================================================================
              Application Status Summary Metric Cards (5 Cards)
              ================================================================ */}
          <section className="myapps-summary-grid" aria-label="Application Status Summary">
            {/* 1. Total Applications */}
            <div
              className={`myapps-summary-card ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('All')}
              title="View all applications"
            >
              <div className="myapps-summary-header">
                <span className="myapps-summary-label">Total Applications</span>
                <div className="myapps-summary-icon">
                  <Briefcase size={18} />
                </div>
              </div>
              <div className="myapps-summary-value">{metrics.total}</div>
            </div>

            {/* 2. Applied */}
            <div
              className={`myapps-summary-card ${statusFilter === 'Applied' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Applied')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('Applied')}
              title="Filter by Applied"
            >
              <div className="myapps-summary-header">
                <span className="myapps-summary-label">Applied</span>
                <div className="myapps-summary-icon">
                  <Send size={18} />
                </div>
              </div>
              <div className="myapps-summary-value">{metrics.applied}</div>
            </div>

            {/* 3. Under Review */}
            <div
              className={`myapps-summary-card ${statusFilter === 'Under Review' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Under Review')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('Under Review')}
              title="Filter by Under Review"
            >
              <div className="myapps-summary-header">
                <span className="myapps-summary-label">Under Review</span>
                <div className="myapps-summary-icon">
                  <Clock size={18} />
                </div>
              </div>
              <div className="myapps-summary-value">{metrics.underReview}</div>
            </div>

            {/* 4. Selected */}
            <div
              className={`myapps-summary-card ${statusFilter === 'Selected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Selected')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('Selected')}
              title="Filter by Selected"
            >
              <div className="myapps-summary-header">
                <span className="myapps-summary-label">Selected</span>
                <div className="myapps-summary-icon">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="myapps-summary-value">{metrics.selected}</div>
            </div>

            {/* 5. Rejected */}
            <div
              className={`myapps-summary-card ${statusFilter === 'Rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Rejected')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setStatusFilter('Rejected')}
              title="Filter by Rejected"
            >
              <div className="myapps-summary-header">
                <span className="myapps-summary-label">Rejected</span>
                <div className="myapps-summary-icon">
                  <XCircle size={18} />
                </div>
              </div>
              <div className="myapps-summary-value">{metrics.rejected}</div>
            </div>
          </section>

          {/* ================================================================
              Controls Bar (Status Filter Tabs & Search)
              ================================================================ */}
          {rawApplications.length > 0 && (
            <div className="myapps-controls-bar">
              {/* Filter Tabs */}
              <div className="myapps-filter-tabs">
                {[
                  { label: 'All', count: metrics.total },
                  { label: 'Applied', count: metrics.applied },
                  { label: 'Under Review', count: metrics.underReview },
                  { label: 'Selected', count: metrics.selected },
                  { label: 'Rejected', count: metrics.rejected },
                ].map((tab) => (
                  <button
                    key={tab.label}
                    type="button"
                    className={`myapps-tab-btn ${statusFilter === tab.label ? 'active' : ''}`}
                    onClick={() => setStatusFilter(tab.label)}
                  >
                    <span>{tab.label}</span>
                    <span className="myapps-tab-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* Quick Search */}
              <div className="myapps-search-wrap">
                <Search size={15} className="myapps-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company or role..."
                  className="myapps-search-input"
                  aria-label="Search applications"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted-gray)',
                      cursor: 'pointer',
                    }}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              Content Area: Applications Grid or Empty State
              ================================================================ */}
          {rawApplications.length === 0 ? (
            /* Case 1: Empty State (No applications in localStorage yet) */
            <div className="dashboard-card">
              <div className="empty-state-container">
                <div className="empty-state-icon">
                  <FileText size={36} />
                </div>
                <h2 className="empty-state-title">No Applications Yet</h2>
                <p className="empty-state-text">
                  You haven't applied to any internships yet. Explore verified opportunities matching your skills and start applying today!
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link to="/student/internships" className="btn btn-primary">
                    <span>Find Internships</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/student/dashboard" className="btn btn-secondary">
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            /* Case 2: Filter/Search matched 0 results */
            <div className="dashboard-card">
              <div className="empty-state-container">
                <div className="empty-state-icon">
                  <Search size={32} />
                </div>
                <h3 className="empty-state-title">No matching applications</h3>
                <p className="empty-state-text">
                  No applications matched your filter "{statusFilter}"{searchQuery ? ` and query "${searchQuery}"` : ''}.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setStatusFilter('All')
                    setSearchQuery('')
                  }}
                  style={{ marginTop: '8px' }}
                >
                  <RotateCcw size={15} />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          ) : (
            /* Case 3: Display Applications Cards Grid */
            <div className="myapps-cards-grid">
              {filteredApplications.map((app) => (
                <article key={app.id} className="myapps-card" aria-labelledby={`app-title-${app.id}`}>
                  {/* Card Top: Identity and Status Badge */}
                  <div className="myapps-card-top">
                    <div className="myapps-card-identity">
                      <div className="myapps-company-avatar" aria-hidden="true">
                        {app.companyInitial}
                      </div>
                      <div className="myapps-title-group">
                        <span className="myapps-company-name">{app.company}</span>
                        <h3 id={`app-title-${app.id}`} className="myapps-role-title">
                          {app.internshipTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`myapps-status-badge ${getStatusBadgeClass(app.status)}`}>
                      <span className="myapps-status-dot" />
                      <span>{app.status}</span>
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="myapps-meta-row">
                    <div className="myapps-meta-item">
                      <Calendar size={14} className="meta-icon" />
                      <span>Applied on {app.appliedDate}</span>
                    </div>
                    {app.location && (
                      <div className="myapps-meta-item">
                        <MapPin size={14} className="meta-icon" />
                        <span>{app.location}</span>
                      </div>
                    )}
                    {app.stipend && (
                      <div className="myapps-meta-item">
                        <Banknote size={14} className="meta-icon" />
                        <span>{app.stipend}</span>
                      </div>
                    )}
                  </div>

                  {/* Attached Documents Row */}
                  <div className="myapps-docs-row">
                    {app.resumeName ? (
                      <span className="myapps-doc-chip" title="Resume attached">
                        <FileCheck size={14} className="chip-icon" />
                        <span>{app.resumeName}</span>
                      </span>
                    ) : (
                      <span className="myapps-doc-chip" style={{ color: 'var(--muted-gray)' }}>
                        <FileText size={14} className="chip-icon" />
                        <span>No resume attached</span>
                      </span>
                    )}

                    {app.additionalDocumentNames && app.additionalDocumentNames.length > 0 && (
                      <span className="myapps-docs-count-chip">
                        <Paperclip size={12} />
                        <span>
                          +{app.additionalDocumentNames.length}{' '}
                          {app.additionalDocumentNames.length === 1 ? 'doc' : 'docs'}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="myapps-card-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ================================================================
          Application Details Modal
          ================================================================ */}
      {selectedApp && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedApp(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-modal-title"
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: '720px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="modal-company">{selectedApp.company}</span>
                  <span className={`myapps-status-badge ${getStatusBadgeClass(selectedApp.status)}`}>
                    <span className="myapps-status-dot" />
                    <span>{selectedApp.status}</span>
                  </span>
                </div>
                <h2 id="app-modal-title" className="modal-role">
                  {selectedApp.internshipTitle}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedApp(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="myapps-modal-body-scroll">
              {/* 1. Internship Information */}
              <div className="myapps-modal-section">
                <h4 className="myapps-modal-section-title">
                  <Briefcase size={16} />
                  <span>Internship Information</span>
                </h4>
                <div className="myapps-modal-fields-grid">
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Internship Title</span>
                    <span className="myapps-modal-val highlight">{selectedApp.internshipTitle}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Company</span>
                    <span className="myapps-modal-val highlight">{selectedApp.company}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Internship ID</span>
                    <span className="myapps-modal-val">{selectedApp.internshipId}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Applied Date</span>
                    <span className="myapps-modal-val">{selectedApp.appliedDate}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Application Status</span>
                    <span className="myapps-modal-val highlight">{selectedApp.status}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Application Reference ID</span>
                    <span className="myapps-modal-val">{selectedApp.id}</span>
                  </div>
                </div>
              </div>

              {/* 2. Personal Information */}
              <div className="myapps-modal-section">
                <h4 className="myapps-modal-section-title">
                  <User size={16} />
                  <span>Personal Information</span>
                </h4>
                <div className="myapps-modal-fields-grid">
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Full Name</span>
                    <span className="myapps-modal-val">{selectedApp.fullName}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Email Address</span>
                    <span className="myapps-modal-val">{selectedApp.email}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Phone Number</span>
                    <span className="myapps-modal-val">{selectedApp.phone}</span>
                  </div>
                </div>
              </div>

              {/* 3. Academic Information */}
              <div className="myapps-modal-section">
                <h4 className="myapps-modal-section-title">
                  <GraduationCap size={16} />
                  <span>Academic Information</span>
                </h4>
                <div className="myapps-modal-fields-grid">
                  <div className="myapps-modal-field full-width">
                    <span className="myapps-modal-label">College / University</span>
                    <span className="myapps-modal-val">{selectedApp.college}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Course</span>
                    <span className="myapps-modal-val">{selectedApp.course}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Department</span>
                    <span className="myapps-modal-val">{selectedApp.department}</span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Year / Semester</span>
                    <span className="myapps-modal-val">
                      {selectedApp.year || 'N/A'} {selectedApp.semester ? `• ${selectedApp.semester}` : ''}
                    </span>
                  </div>
                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Student ID</span>
                    <span className="myapps-modal-val">{selectedApp.studentId}</span>
                  </div>
                  {selectedApp.cgpa && (
                    <div className="myapps-modal-field">
                      <span className="myapps-modal-label">CGPA</span>
                      <span className="myapps-modal-val">{selectedApp.cgpa}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Application Information */}
              <div className="myapps-modal-section">
                <h4 className="myapps-modal-section-title">
                  <Sparkles size={16} />
                  <span>Application Information</span>
                </h4>
                <div className="myapps-modal-fields-grid">
                  <div className="myapps-modal-field full-width">
                    <span className="myapps-modal-label">Skills</span>
                    <div className="skills-tags-container" style={{ marginTop: '6px' }}>
                      {selectedApp.skills && selectedApp.skills.length > 0 ? (
                        selectedApp.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--muted-gray)' }}>
                          No specific skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedApp.whyJoin && (
                    <div className="myapps-modal-field full-width">
                      <span className="myapps-modal-label">Why do you want to join?</span>
                      <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--charcoal)', lineHeight: '1.5' }}>
                        {selectedApp.whyJoin}
                      </p>
                    </div>
                  )}

                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Availability</span>
                    <span className="myapps-modal-val">{selectedApp.availability}</span>
                  </div>

                  <div className="myapps-modal-field">
                    <span className="myapps-modal-label">Preferred Work Mode</span>
                    <span className="myapps-modal-val">{selectedApp.workMode}</span>
                  </div>
                </div>
              </div>

              {/* 5. Documents */}
              <div className="myapps-modal-section">
                <h4 className="myapps-modal-section-title">
                  <FileText size={16} />
                  <span>Submitted Documents</span>
                </h4>
                <div className="myapps-modal-docs-list">
                  {/* Resume */}
                  <div className="myapps-modal-doc-item">
                    <div style={{ display: 'flex', alignItem: 'center', gap: '10px' }}>
                      <FileCheck size={18} style={{ color: 'var(--primary-plum)' }} />
                      <div>
                        <span>{selectedApp.resumeName || 'Resume.pdf'}</span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted-gray)' }}>
                          Primary Curriculum Vitae (Frontend preview)
                        </span>
                      </div>
                    </div>
                    <span className="profile-badge-student">Attached</span>
                  </div>

                  {/* Additional Documents */}
                  {selectedApp.additionalDocumentNames && selectedApp.additionalDocumentNames.length > 0 && (
                    selectedApp.additionalDocumentNames.map((doc, idx) => (
                      <div key={idx} className="myapps-modal-doc-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Paperclip size={18} style={{ color: 'var(--primary-plum)' }} />
                          <div>
                            <span>{doc}</span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted-gray)' }}>
                              Supporting Document
                            </span>
                          </div>
                        </div>
                        <span className="profile-badge-student">Attached</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedApp(null)}
              >
                Close
              </button>
              <Link to="/student/internships" className="btn btn-primary" onClick={() => setSelectedApp(null)}>
                <span>Explore More Opportunities</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentApplications
