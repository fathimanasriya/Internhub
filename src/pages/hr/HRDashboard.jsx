import { useState, useMemo } from 'react'
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

  // 1. Recruiter Profile (Demo state)
  const [hrInfo] = useState({
    name: 'Sarah Jenkins',
    initials: 'SJ',
    company: 'TechNova Labs',
    tier: 'Enterprise Recruiter',
  })

  // 2. Statistics (Demo values per specification)
  const stats = [
    {
      id: 'active-internships',
      label: 'Active Internships',
      value: 4,
      icon: Briefcase,
      trend: '3 active hiring pipelines',
    },
    {
      id: 'total-applications',
      label: 'Total Applications',
      value: 48,
      icon: Users,
      trend: '+12 new this week',
    },
    {
      id: 'selected-candidates',
      label: 'Selected Candidates',
      value: 12,
      icon: CheckCircle2,
      trend: '4 offers accepted',
    },
    {
      id: 'current-interns',
      label: 'Current Interns',
      value: 8,
      icon: GraduationCap,
      trend: '2 active batches',
    },
  ]

  // 3. Quick Actions
  const quickActions = [
    {
      id: 'post-internship',
      title: 'Post Internship',
      description: 'Publish a new internship listing with customized requirements, skills, and stipends.',
      icon: PlusCircle,
      actionText: 'Post New Role',
      target: '/hr/internships/create',
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

  // 4. Demo Recent Applications Data
  const [applications, setApplications] = useState([
    {
      id: 'app-01',
      studentName: 'Rohan Sharma',
      avatarInitials: 'RS',
      email: 'rohan.sharma@gmail.com',
      university: 'IIT Bombay • Computer Science',
      internship: 'Software Development Intern',
      department: 'Engineering',
      appliedDate: 'Oct 02, 2026',
      status: 'Under Review',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      gpa: '8.8 / 10',
    },
    {
      id: 'app-02',
      studentName: 'Priya Patel',
      avatarInitials: 'PP',
      email: 'priya.patel@gmail.com',
      university: 'NID Ahmedabad • Interaction Design',
      internship: 'UI/UX Design Intern',
      department: 'Design',
      appliedDate: 'Oct 01, 2026',
      status: 'Selected',
      skills: ['Figma', 'Wireframing', 'User Research'],
      gpa: '9.2 / 10',
    },
    {
      id: 'app-03',
      studentName: 'Ananya Iyer',
      avatarInitials: 'AI',
      email: 'ananya.iyer@gmail.com',
      university: 'BITS Pilani • Data Science',
      internship: 'Data Analyst Intern',
      department: 'Analytics',
      appliedDate: 'Sep 30, 2026',
      status: 'Applied',
      skills: ['Python', 'SQL', 'Power BI'],
      gpa: '8.5 / 10',
    },
    {
      id: 'app-04',
      studentName: 'Kabir Mehta',
      avatarInitials: 'KM',
      email: 'kabir.mehta@gmail.com',
      university: 'IIIT Hyderabad • Cloud Computing',
      internship: 'Cloud & DevOps Intern',
      department: 'Infrastructure',
      appliedDate: 'Sep 29, 2026',
      status: 'Selected',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      gpa: '9.0 / 10',
    },
    {
      id: 'app-05',
      studentName: 'Sneha Kulkarni',
      avatarInitials: 'SK',
      email: 'sneha.k@gmail.com',
      university: 'Delhi University • Business Administration',
      internship: 'Business Analyst Intern',
      department: 'Product',
      appliedDate: 'Sep 28, 2026',
      status: 'Rejected',
      skills: ['Excel', 'Agile', 'Market Analysis'],
      gpa: '7.8 / 10',
    },
    {
      id: 'app-06',
      studentName: 'Vikram Malhotra',
      avatarInitials: 'VM',
      email: 'vikram.m@gmail.com',
      university: 'VIT Vellore • Information Technology',
      internship: 'Software Development Intern',
      department: 'Engineering',
      appliedDate: 'Sep 27, 2026',
      status: 'Applied',
      skills: ['JavaScript', 'HTML/CSS', 'Git'],
      gpa: '8.2 / 10',
    },
  ])

  // 5. Demo Active Internships Data
  const [internships] = useState([
    {
      id: 'role-01',
      title: 'Software Development Intern',
      category: 'Engineering',
      location: 'Remote / Bangalore',
      duration: '6 Months',
      applicationsCount: 18,
      status: 'Active',
      stipend: '₹25,000 / mo',
      postedDate: '2 days ago',
      description: 'Building enterprise React microfrontends and REST API integrations.',
    },
    {
      id: 'role-02',
      title: 'UI/UX Design Intern',
      category: 'Design',
      location: 'Mumbai (Hybrid)',
      duration: '4 Months',
      applicationsCount: 14,
      status: 'Active',
      stipend: '₹22,000 / mo',
      postedDate: '3 days ago',
      description: 'Creating design system tokens, wireframes, and candidate user flows.',
    },
    {
      id: 'role-03',
      title: 'Data Analyst Intern',
      category: 'Analytics',
      location: 'Remote',
      duration: '3 Months',
      applicationsCount: 10,
      status: 'Active',
      stipend: '₹20,000 / mo',
      postedDate: '5 days ago',
      description: 'Designing automated executive KPI pipelines and reporting dashboards.',
    },
    {
      id: 'role-04',
      title: 'Cloud & DevOps Intern',
      category: 'Infrastructure',
      location: 'Hyderabad (On-site)',
      duration: '6 Months',
      applicationsCount: 6,
      status: 'Active',
      stipend: '₹28,000 / mo',
      postedDate: '1 week ago',
      description: 'Managing AWS container deployments, CI/CD pipelines, and cluster health.',
    },
  ])

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
                  Open opportunities published by TechNova Labs receiving student applications.
                </p>
              </div>
            </div>

            <div className="hr-internships-grid">
              {internships.map((item) => (
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
              ))}
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
