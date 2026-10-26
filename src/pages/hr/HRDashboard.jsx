import { useState, useMemo, useEffect } from 'react'
import {
  Briefcase,
  Users,
  CheckCircle2,
  GraduationCap,
  PlusCircle,
  FileText,
  UserCheck,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Check,
  X,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import { getHrProfile, getHrAuthToken, getHrApplications, getMyInternships } from '../../services/api'
import './HRDashboard.css'

/**
 * HR Dashboard Page
 * Primary management portal for HR and corporate employers on InternHub.
 */
function HRDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModal, setActiveModal] = useState(null) // null | { type: 'quickAction' | 'viewApplication' | 'manageInternship', data: any }

  // 1. Recruiter Profile (Loaded from localStorage or backend /api/hr/me)
  const [hrInfo, setHrInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRProfile') || localStorage.getItem('internhubHR');
      if (stored) {
        const parsed = JSON.parse(stored);
        const name = parsed.hrName || parsed.name || 'HR Recruiter';
        const company = parsed.companyName || parsed.company || 'Enterprise Partner';
        const initials = name.trim().split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'HR';
        return {
          name,
          initials,
          company,
          tier: parsed.designation || 'Enterprise Recruiter',
        };
      }
    } catch (err) {
      console.error('Error loading stored HR profile:', err);
    }
    return {
      name: 'HR Recruiter',
      initials: 'HR',
      company: 'Enterprise Partner',
      tier: 'Enterprise Recruiter',
    };
  });

  // 2. Real Applications & Internships states
  const [applications, setApplications] = useState([])
  const [internships, setInternships] = useState([])

  // 3. Quick Actions
  const quickActions = [
    {
      id: 'post-internship',
      title: 'Post Internship',
      description: 'Publish a new internship listing with customized requirements, skills, and stipends.',
      icon: PlusCircle,
      actionText: 'Post New Role',
      target: '/hr/internships',
    },
    {
      id: 'view-applications',
      title: 'View Applications',
      description: 'Filter, review incoming student profiles, resumes, and evaluate qualification scores.',
      icon: FileText,
      actionText: 'Browse Candidates',
      target: '/hr/applications',
    },
    {
      id: 'manage-interns',
      title: 'Manage Interns',
      description: 'Track ongoing cohort progress, mentor milestones, project delivery, and certificates.',
      icon: UserCheck,
      actionText: 'Manage Cohorts',
      target: '/hr/interns',
    },
  ]

  // Fetch live HR data from backend
  useEffect(() => {
    const token = getHrAuthToken()
    if (!token) return

    let isMounted = true

    // Fetch live HR profile
    getHrProfile()
      .then((profile) => {
        if (!isMounted || !profile) return
        const name = profile.hrName || 'HR Recruiter'
        const company = profile.companyName || 'Enterprise Partner'
        const initials = name.trim().split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'HR'
        setHrInfo({
          name,
          initials,
          company,
          tier: profile.designation || 'Enterprise Recruiter',
        })
      })
      .catch((err) => {
        console.warn('Could not load live HR profile:', err.message)
      })

    // Fetch real applications received for this HR user's postings
    getHrApplications()
      .then((backendApps) => {
        if (!isMounted) return
        if (!Array.isArray(backendApps) || backendApps.length === 0) {
          setApplications([])
          return
        }

        const mapped = backendApps.map((item) => {
          const student = item.student || {}
          const internship = item.internship || {}
          const name = student.name || 'Student Applicant'
          const initials = name.trim().split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'ST'
          let dateStr = 'Recently'
          if (item.appliedDate) {
            try {
              dateStr = new Date(item.appliedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })
            } catch {
              dateStr = String(item.appliedDate)
            }
          }

          let displayStatus = 'Under Review'
          if (item.status === 'APPLIED') displayStatus = 'Applied'
          else if (item.status === 'SHORTLISTED') displayStatus = 'Selected'
          else if (item.status === 'REJECTED') displayStatus = 'Rejected'

          let skillsArr = ['React', 'Java']
          if (student.skills) {
            skillsArr = Array.isArray(student.skills)
              ? student.skills
              : student.skills.split(',').map((s) => s.trim()).filter(Boolean)
          }

          return {
            id: item.id,
            studentName: name,
            avatarInitials: initials,
            email: student.email || '',
            university: `${student.college || 'University'} • ${student.course || student.department || 'Student'}`,
            internship: internship.role || 'Internship Role',
            department: student.department || 'Engineering',
            appliedDate: dateStr,
            status: displayStatus,
            skills: skillsArr,
            gpa: '8.5 / 10',
          }
        })
        setApplications(mapped)
      })
      .catch((err) => {
        console.warn('Could not load HR applications for dashboard:', err.message)
      })

    // Fetch real internships posted by this HR user
    getMyInternships()
      .then((backendList) => {
        if (!isMounted) return
        if (!Array.isArray(backendList) || backendList.length === 0) {
          setInternships([])
          return
        }

        const mapped = backendList.map((item) => {
          const isClosed =
            item.applicationDeadline &&
            new Date(item.applicationDeadline) < new Date(new Date().toDateString())
          return {
            id: item.id,
            title: item.role,
            category: 'Engineering',
            location: item.location,
            duration: '3 Months',
            applicationsCount: 0,
            status: isClosed ? 'Closed' : 'Active',
            stipend: 'Competitive',
            postedDate: 'Recently',
            description: item.description,
          }
        })
        setInternships(mapped)
      })
      .catch((err) => {
        console.warn('Could not load HR internships for dashboard:', err.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // 4. Dynamic Statistics based on live HR account data
  const stats = useMemo(() => {
    const activeCount = internships.filter((i) => i.status === 'Active').length
    const totalApps = applications.length
    const selectedCount = applications.filter((a) => a.status === 'Selected').length
    const currentInternsCount = selectedCount

    return [
      {
        id: 'active-internships',
        label: 'Active Internships',
        value: activeCount,
        icon: Briefcase,
        trend: `${activeCount} active hiring pipelines`,
      },
      {
        id: 'total-applications',
        label: 'Total Applications',
        value: totalApps,
        icon: Users,
        trend: `${totalApps} total applicants`,
      },
      {
        id: 'selected-candidates',
        label: 'Selected Candidates',
        value: selectedCount,
        icon: CheckCircle2,
        trend: `${selectedCount} candidates selected`,
      },
      {
        id: 'current-interns',
        label: 'Current Interns',
        value: currentInternsCount,
        icon: GraduationCap,
        trend: `${currentInternsCount} active interns`,
      },
    ]
  }, [internships, applications])

  // Filtered Applications logic
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === 'All' || app.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.internship.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.university.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [applications, statusFilter, searchQuery])

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    let className = 'hr-status-badge '
    switch (status) {
      case 'Applied':
        className += 'status-applied'
        break
      case 'Under Review':
        className += 'status-under-review'
        break
      case 'Selected':
        className += 'status-selected'
        break
      case 'Rejected':
        className += 'status-rejected'
        break
      default:
        className += 'status-applied'
    }
    return <span className={className}>{status}</span>
  }

  // Update application status demo helper
  const handleUpdateStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    )
    if (activeModal && activeModal.data && activeModal.data.id === appId) {
      setActiveModal({
        ...activeModal,
        data: { ...activeModal.data, status: newStatus },
      })
    }
  }

  return (
    <div className="hr-dashboard-layout">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Wrapper */}
      <div className="hr-main-content">
        {/* Topbar */}
        <Topbar
          hrName={hrInfo.name}
          initials={hrInfo.initials}
          companyName={hrInfo.company}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="HR Dashboard"
          onSearch={(query) => setSearchQuery(query)}
        />

        {/* Dashboard Body Container */}
        <main className="hr-dashboard-container">
          {/* ================================================================
              1. Welcome Section
              ================================================================ */}
          <section className="hr-welcome-card" aria-labelledby="hr-welcome-heading">
            <div className="hr-welcome-content">
              <div className="hr-welcome-pill">
                <Check size={14} />
                <span>TechNova Labs • Employer Portal</span>
              </div>
              <h2 id="hr-welcome-heading" className="hr-welcome-title">
                Welcome back, HR!
              </h2>
              <p className="hr-welcome-subtitle">
                Manage your internships, applications, and interns from one place.
              </p>
            </div>

            <div className="hr-welcome-actions">
              <button
                type="button"
                className="hr-btn-primary"
                onClick={() =>
                  setActiveModal({
                    type: 'quickAction',
                    data: {
                      title: 'Post New Internship',
                      message:
                        'The Internship Posting Wizard will be integrated in the upcoming milestone. You will be able to define responsibilities, stipend, perks, and screening questions.',
                    },
                  })
                }
              >
                <PlusCircle size={17} />
                <span>Post Internship</span>
              </button>
              <button
                type="button"
                className="hr-btn-secondary"
                onClick={() => {
                  const tableElem = document.getElementById('recent-applications-section')
                  if (tableElem) tableElem.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Users size={17} />
                <span>View Applicants</span>
              </button>
            </div>
          </section>

          {/* ================================================================
              2. Statistics Cards Grid (4 Cards)
              ================================================================ */}
          <section className="hr-stats-grid" aria-label="Key Recruiting Metrics">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.id} className="hr-stat-card">
                  <div className="hr-stat-header">
                    <span className="hr-stat-label">{stat.label}</span>
                    <div className="hr-stat-icon-box" aria-hidden="true">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="hr-stat-value">{stat.value}</div>
                  <div className="hr-stat-footer">
                    <span className="hr-stat-trend-up">
                      <TrendingUp size={13} />
                    </span>
                    <span>{stat.trend}</span>
                  </div>
                </div>
              )
            })}
          </section>

          {/* ================================================================
              3. Quick Actions (3 Cards)
              ================================================================ */}
          <section className="hr-section" aria-labelledby="quick-actions-heading">
            <div className="hr-section-header">
              <div>
                <h3 id="quick-actions-heading" className="hr-section-title">
                  Quick Actions
                </h3>
                <p className="hr-section-desc">
                  Frequently accessed workflows to accelerate recruitment and intern management.
                </p>
              </div>
            </div>

            <div className="hr-actions-grid">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <div key={action.id} className="hr-action-card">
                    <div className="hr-action-top">
                      <div className="hr-action-icon" aria-hidden="true">
                        <Icon size={24} />
                      </div>
                      <div className="hr-action-text">
                        <h4>{action.title}</h4>
                        <p>{action.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="hr-action-btn"
                      onClick={() =>
                        setActiveModal({
                          type: 'quickAction',
                          data: {
                            title: action.title,
                            message: `${action.title} module will be connected in future milestones. Current demo navigation is prepared for ${action.target}.`,
                          },
                        })
                      }
                    >
                      <span>{action.actionText}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ================================================================
              4. Recent Applications Table
              ================================================================ */}
          <section
            id="recent-applications-section"
            className="hr-section"
            aria-labelledby="recent-apps-heading"
          >
            <div className="hr-section-header">
              <div>
                <h3 id="recent-apps-heading" className="hr-section-title">
                  Recent Applications
                </h3>
                <p className="hr-section-desc">
                  Candidates who recently applied to your posted internship roles.
                </p>
              </div>
            </div>

            <div className="hr-table-card">
              {/* Filter and Count Toolbar */}
              <div className="hr-table-toolbar">
                <div className="hr-table-filter-group" role="group" aria-label="Filter applications by status">
                  {['All', 'Applied', 'Under Review', 'Selected', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`hr-filter-pill ${statusFilter === status ? 'active' : ''}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="hr-table-count">
                  Showing <strong>{filteredApplications.length}</strong> of{' '}
                  <strong>{applications.length}</strong> candidate applications
                </div>
              </div>

              {/* Table Data */}
              <div className="hr-table-wrapper">
                <table className="hr-table" aria-label="Recent student applications table">
                  <thead>
                    <tr>
                      <th scope="col">Student Name</th>
                      <th scope="col">Internship</th>
                      <th scope="col">Applied Date</th>
                      <th scope="col">Status</th>
                      <th scope="col" style={{ textAlign: 'right' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div className="hr-candidate-cell">
                              <div className="hr-candidate-avatar" aria-hidden="true">
                                {app.avatarInitials}
                              </div>
                              <div>
                                <span className="hr-candidate-name">{app.studentName}</span>
                                <span className="hr-candidate-sub">{app.university}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="hr-internship-cell">
                              <span className="hr-role-title">{app.internship}</span>
                              <span className="hr-role-type">{app.department}</span>
                            </div>
                          </td>
                          <td className="hr-date-cell">{app.appliedDate}</td>
                          <td>{renderStatusBadge(app.status)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="hr-action-btn-sm"
                              onClick={() =>
                                setActiveModal({
                                  type: 'viewApplication',
                                  data: app,
                                })
                              }
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--hr-muted-gray)' }}>
                          No applications found matching the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ================================================================
              5. Active Internships
              ================================================================ */}
          <section className="hr-section" aria-labelledby="active-internships-heading">
            <div className="hr-section-header">
              <div>
                <h3 id="active-internships-heading" className="hr-section-title">
                  Active Internships
                </h3>
                <p className="hr-section-desc">
                  Open opportunities published by {hrInfo.company} receiving student applications.
                </p>
              </div>
            </div>

            <div className="hr-internships-grid">
              {internships.length > 0 ? (
                internships.map((item) => (
                  <div key={item.id} className="hr-internship-card">
                    <div>
                      <div className="hr-card-top-row">
                        <span className="hr-internship-category">{item.category}</span>
                        <span className="hr-badge-active">
                          <CheckCircle2 size={12} />
                          <span>{item.status}</span>
                        </span>
                      </div>

                      <h4 className="hr-internship-title" style={{ marginTop: '10px' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--hr-muted-gray)', margin: '0 0 14px', lineHeight: '1.5' }}>
                        {item.description}
                      </p>

                      <div className="hr-meta-grid">
                        <div className="hr-meta-item">
                          <span className="hr-meta-label">Location</span>
                          <span className="hr-meta-value" title={item.location}>
                            {item.location}
                          </span>
                        </div>
                        <div className="hr-meta-item">
                          <span className="hr-meta-label">Duration</span>
                          <span className="hr-meta-value">{item.duration}</span>
                        </div>
                        <div className="hr-meta-item">
                          <span className="hr-meta-label">Stipend</span>
                          <span className="hr-meta-value">{item.stipend}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hr-card-footer">
                      <div className="hr-applicants-chip">
                        <Users size={16} />
                        <span>{item.applicationsCount} Applicants</span>
                      </div>
                      <button
                        type="button"
                        className="hr-btn-manage"
                        onClick={() =>
                          setActiveModal({
                            type: 'manageInternship',
                            data: item,
                          })
                        }
                      >
                        <span>View / Manage</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 20px', background: 'white', borderRadius: '12px', border: '1px solid var(--hr-border-color)' }}>
                  <p style={{ color: 'var(--hr-muted-gray)', margin: '0 0 16px', fontSize: '15px' }}>
                    You have not posted any active internships yet.
                  </p>
                  <a href="/hr/internships" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
                    <PlusCircle size={18} />
                    <span>Post an Internship</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* ================================================================
          Interactive Modals (Quick Action, Review Application, Manage Role)
          ================================================================ */}
      {activeModal && (
        <div className="hr-modal-overlay" onClick={() => setActiveModal(null)} role="dialog" aria-modal="true">
          <div className="hr-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hr-modal-close-btn"
              onClick={() => setActiveModal(null)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {/* Modal: Quick Action / Future Page Info */}
            {activeModal.type === 'quickAction' && (
              <>
                <div className="hr-modal-header">
                  <span className="hr-modal-badge">PORTAL ACTION</span>
                  <h3 className="hr-modal-title">{activeModal.data.title}</h3>
                </div>
                <div className="hr-modal-body">
                  <p style={{ fontSize: '14px', color: 'var(--hr-charcoal)', lineHeight: '1.6', margin: 0 }}>
                    {activeModal.data.message}
                  </p>
                  <div className="hr-modal-notice">
                    <strong>HR Roadmap:</strong> Full posting editor, candidate scoring filters, and certificate generators will be bound in subsequent frontend & backend milestones.
                  </div>
                </div>
                <div className="hr-modal-actions">
                  <button
                    type="button"
                    className="hr-btn-primary"
                    onClick={() => setActiveModal(null)}
                  >
                    Got It
                  </button>
                </div>
              </>
            )}

            {/* Modal: Review Application Detail */}
            {activeModal.type === 'viewApplication' && (
              <>
                <div className="hr-modal-header">
                  <span className="hr-modal-badge">CANDIDATE REVIEW</span>
                  <h3 className="hr-modal-title">{activeModal.data.studentName}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--hr-muted-gray)', margin: '4px 0 0' }}>
                    {activeModal.data.university}
                  </p>
                </div>

                <div className="hr-modal-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'var(--hr-warm-gray)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--hr-muted-gray)', display: 'block' }}>ROLE APPLIED</span>
                      <strong style={{ fontSize: '13px', color: 'var(--hr-deep-plum)' }}>{activeModal.data.internship}</strong>
                    </div>
                    <div style={{ background: 'var(--hr-warm-gray)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--hr-muted-gray)', display: 'block' }}>APPLIED DATE</span>
                      <strong style={{ fontSize: '13px', color: 'var(--hr-deep-plum)' }}>{activeModal.data.appliedDate}</strong>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--hr-charcoal-muted)', display: 'block', marginBottom: '6px' }}>
                      Key Skills Match
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {activeModal.data.skills?.map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'var(--hr-soft-lavender)',
                            color: 'var(--hr-primary-plum)',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--hr-charcoal-muted)', display: 'block', marginBottom: '8px' }}>
                      Update Candidate Status (Demo)
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Applied', 'Under Review', 'Selected', 'Rejected'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`hr-filter-pill ${activeModal.data.status === st ? 'active' : ''}`}
                          onClick={() => handleUpdateStatus(activeModal.data.id, st)}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="hr-modal-notice">
                    Current Status:{' '}
                    <strong>{activeModal.data.status}</strong>. Changing the status updates the live dashboard demo state.
                  </div>
                </div>

                <div className="hr-modal-actions">
                  <button
                    type="button"
                    className="hr-btn-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="hr-btn-primary"
                    onClick={() => {
                      alert(`Review saved for ${activeModal.data.studentName}!`)
                      setActiveModal(null)
                    }}
                  >
                    Save Status
                  </button>
                </div>
              </>
            )}

            {/* Modal: Manage Internship Detail */}
            {activeModal.type === 'manageInternship' && (
              <>
                <div className="hr-modal-header">
                  <span className="hr-modal-badge">{activeModal.data.category}</span>
                  <h3 className="hr-modal-title">{activeModal.data.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--hr-muted-gray)', margin: '4px 0 0' }}>
                    {activeModal.data.location} • {activeModal.data.duration}
                  </p>
                </div>

                <div className="hr-modal-body">
                  <p style={{ fontSize: '13px', color: 'var(--hr-charcoal-muted)', lineHeight: '1.5', margin: 0 }}>
                    {activeModal.data.description}
                  </p>

                  <div className="hr-meta-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="hr-meta-item">
                      <span className="hr-meta-label">Applications</span>
                      <span className="hr-meta-value">{activeModal.data.applicationsCount} received</span>
                    </div>
                    <div className="hr-meta-item">
                      <span className="hr-meta-label">Stipend</span>
                      <span className="hr-meta-value">{activeModal.data.stipend}</span>
                    </div>
                    <div className="hr-meta-item">
                      <span className="hr-meta-label">Status</span>
                      <span className="hr-meta-value" style={{ color: '#059669' }}>
                        {activeModal.data.status}
                      </span>
                    </div>
                  </div>

                  <div className="hr-modal-notice">
                    Role management allows pausing applicant submissions, extending deadlines, and inviting shortlisted students to interview rounds.
                  </div>
                </div>

                <div className="hr-modal-actions">
                  <button
                    type="button"
                    className="hr-btn-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="hr-btn-primary"
                    onClick={() => {
                      alert(`Opening candidate pipeline for ${activeModal.data.title} (Demo)`)
                      setActiveModal(null)
                    }}
                  >
                    View All {activeModal.data.applicationsCount} Applicants
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HRDashboard
