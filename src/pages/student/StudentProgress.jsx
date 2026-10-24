import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Circle,
  Sparkles,
  Layers,
  MessageSquare,
  AlertCircle,
  FileText,
  ExternalLink,
  Eye,
  Info,
  Target,
  Compass,
} from 'lucide-react'
import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'
import { getInternshipById } from '../../data/internshipsData'

/**
 * Structured Frontend Demo Data for Internship Progress
 * Can later be replaced seamlessly with live backend/API payload.
 */
const demoInternshipProgress = {
  internship: {
    title: 'Frontend Development Intern',
    company: 'TechNova Labs',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    duration: '3 Months',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    status: 'complete',
  },

  overview: {
    percentage: 100,
    completedTasks: 20,
    totalTasks: 20,
    completedDays: 90,
    totalDays: 90,
    completedMilestones: 6,
    totalMilestones: 6,
  },

  timeline: [
    {
      id: 1,
      title: 'Application',
      status: 'Completed',
      date: 'Aug 15, 2026',
      description: 'Application submitted, resume and academic credentials verified.',
    },
    {
      id: 2,
      title: 'Selection',
      status: 'Completed',
      date: 'Aug 24, 2026',
      description: 'Technical evaluation and interview cleared; offer letter accepted.',
    },
    {
      id: 3,
      title: 'Internship Started',
      status: 'Completed',
      date: 'Sep 01, 2026',
      description: 'First official day, welcome orientation, and workstation access provisioned.',
    },
    {
      id: 4,
      title: 'Initial Orientation',
      status: 'Completed',
      date: 'Sep 08, 2026',
      description: 'Engineering standards, code repositories, and safety briefings completed.',
    },
    {
      id: 5,
      title: 'Midpoint Review',
      status: 'Completed',
      date: 'Oct 15, 2026',
      description: 'Evaluation with mentor and submission of first major feature milestone.',
    },
    {
      id: 6,
      title: 'Final Project',
      status: 'Completed',
      date: 'Nov 15, 2026',
      description: 'Deployment of core module and capstone technical presentation.',
    },
    {
      id: 7,
      title: 'Internship Completed',
      status: 'Completed',
      date: 'Nov 30, 2026',
      description: 'Final appraisal, experience certificate issuance, and college sign-off.',
    },
  ],

  tasks: [
    {
      id: 't-1',
      title: 'Complete project onboarding',
      description: 'Review developer guidelines, engineering handbook, and compliance documentation.',
      dueDate: 'Sep 05, 2026',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 't-2',
      title: 'Set up development environment',
      description: 'Configure local Docker environment, Node runtime, database proxies, and SSH keys.',
      dueDate: 'Sep 07, 2026',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 't-3',
      title: 'Understand project architecture',
      description: 'Walk through database ER diagrams, API schemas, and microservice communication flows.',
      dueDate: 'Sep 15, 2026',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 't-4',
      title: 'Build assigned module',
      description: 'Implement student document verification UI and connecting REST endpoints.',
      dueDate: 'Oct 20, 2026',
      status: 'In Progress',
      progress: 65,
    },
    {
      id: 't-5',
      title: 'Submit weekly report',
      description: 'Document sprint progress, blockers, completed tasks, and verified weekly hours.',
      dueDate: 'Oct 24, 2026',
      status: 'Pending',
      progress: 0,
    },
    {
      id: 't-6',
      title: 'Complete final project',
      description: 'Deliver production-ready module with automated unit tests and user documentation.',
      dueDate: 'Nov 20, 2026',
      status: 'Pending',
      progress: 0,
    },
  ],

  milestones: [
    {
      id: 'm-1',
      title: 'Orientation Completed',
      date: 'Sep 08, 2026',
      status: 'Completed',
      description: 'All introductory sessions, team syncs, and system access setup finished.',
    },
    {
      id: 'm-2',
      title: 'First Task Completed',
      date: 'Sep 18, 2026',
      status: 'Completed',
      description: 'Successfully merged first pull request and resolved initial onboarding issues.',
    },
    {
      id: 'm-3',
      title: 'First Review',
      date: 'Sep 30, 2026',
      status: 'Completed',
      description: 'Monthly feedback meeting with tech lead; received positive performance ratings.',
    },
    {
      id: 'm-4',
      title: 'Midpoint Review',
      date: 'Oct 15, 2026',
      status: 'In Progress',
      description: 'Formal 45-day review of code quality, adherence to specs, and collaboration.',
    },
    {
      id: 'm-5',
      title: 'Final Project',
      date: 'Nov 15, 2026',
      status: 'Upcoming',
      description: 'Deliver the core capstone module into staging for QA sign-off.',
    },
    {
      id: 'm-6',
      title: 'Internship Completion',
      date: 'Nov 30, 2026',
      status: 'Upcoming',
      description: 'Final evaluation certificate, exit interview, and academic credit report.',
    },
  ],

  weeklyProgress: [
    { week: 'Week 1', label: 'Onboarding & Setup', percentage: 100, status: 'Completed' },
    { week: 'Week 2', label: 'Architecture & Docs', percentage: 100, status: 'Completed' },
    { week: 'Week 3', label: 'Initial Bug Fixes', percentage: 100, status: 'Completed' },
    { week: 'Week 4', label: 'Core Module Scaffold', percentage: 100, status: 'Completed' },
    { week: 'Week 5', label: 'Feature Development', percentage: 75, status: 'In Progress' },
    { week: 'Week 6', label: 'Midterm Review Sprint', percentage: 30, status: 'In Progress' },
  ],

  updates: [
    {
      id: 'u-1',
      type: 'Supervisor Feedback',
      author: 'Vikram Mehta (Tech Lead)',
      message:
        'Continue improving the assigned module and prepare the first progress report. Solid progress on the component architecture last sprint.',
      date: 'Oct 01, 2026',
    },
  ],

  performance: [
    { category: 'Technical Skills', score: 88 },
    { category: 'Communication', score: 82 },
    { category: 'Teamwork', score: 90 },
    { category: 'Problem Solving', score: 85 },
    { category: 'Professionalism', score: 95 },
  ],
}

/**
 * StudentProgress Component
 * Real Internship Progress page for InternHub.
 * Route: /student/progress
 */
function StudentProgress() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [taskFilter, setTaskFilter] = useState('All')
  const [showDemoPreview, setShowDemoPreview] = useState(false)

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

  // Look for any application marked as 'Selected' in localStorage
  const selectedApplication = useMemo(() => {
    try {
      const stored = localStorage.getItem('internhubApplications')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return (
            parsed.find(
              (app) => (app.status || '').toLowerCase() === 'selected'
            ) || null
          )
        }
      }
    } catch (err) {
      console.error('Error reading internhubApplications:', err)
    }
    return null
  }, [])

  // Resolve active internship (from real selected application or demo preview)
  const activeInternship = useMemo(() => {
    if (selectedApplication) {
      return {
        title: selectedApplication.internshipTitle || 'Software Developer Intern',
        company: selectedApplication.company || 'Partner Company',
        location: selectedApplication.location || 'Bengaluru',
        workMode: selectedApplication.workMode || 'Hybrid',
        duration: selectedApplication.duration || '3 Months',
        startDate: '2026-09-01',
        endDate: '2026-11-30',
        status: 'Active',
        isRealSelected: true,
      }
    }
    if (showDemoPreview) {
      return {
        ...demoInternshipProgress.internship,
        isDemo: true,
      }
    }
    return null
  }, [selectedApplication, showDemoPreview])

  // Read real documents from localStorage if available
  const existingDocuments = useMemo(() => {
    const docs = []
    try {
      // Check internhubDocuments
      const rawDocs = localStorage.getItem('internhubDocuments')
      if (rawDocs) {
        const parsed = JSON.parse(rawDocs)
        if (Array.isArray(parsed)) {
          parsed.forEach((d) => {
            if (d.name) docs.push(d)
          })
        }
      }

      // Check internhubStudent.resume
      const studentRaw = localStorage.getItem('internhubStudent')
      if (studentRaw) {
        const parsedStudent = JSON.parse(studentRaw)
        if (parsedStudent.resume && parsedStudent.resume.name) {
          const exists = docs.some(
            (d) => d.name.toLowerCase() === parsedStudent.resume.name.toLowerCase()
          )
          if (!exists) {
            docs.push({
              name: parsedStudent.resume.name,
              type: 'Resume',
              size: parsedStudent.resume.size || '1.8 MB',
            })
          }
        }
      }
    } catch {
      // ignore
    }
    return docs
  }, [])

  // Filter tasks dynamically
  const filteredTasks = useMemo(() => {
    if (taskFilter === 'All') return demoInternshipProgress.tasks
    return demoInternshipProgress.tasks.filter((t) => t.status === taskFilter)
  }, [taskFilter])

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
          title="Internship Progress"
        />

        <main className="dashboard-container progress-page">
          {/* Page Header */}
          <div className="progress-header">
            <div className="progress-header-left">
              <h1 className="progress-title">Internship Progress</h1>
              <p className="progress-subtitle">
                Track your internship journey, tasks, milestones, and overall progress.
              </p>
            </div>

            {/* If in demo preview mode without a real selected application, show toggle back */}
            {!selectedApplication && showDemoPreview && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowDemoPreview(false)}
                style={{ alignSelf: 'center', fontSize: '13px' }}
              >
                Exit Demo View
              </button>
            )}
          </div>

          {/* Demo Preview Notice Banner */}
          {!selectedApplication && showDemoPreview && (
            <div className="progress-demo-banner">
              <div className="progress-demo-banner-content">
                <span className="progress-demo-pill">Demo Mode</span>
                <span>
                  Previewing sample progress data. This interactive view simulates what you will see after an employer marks your application as <strong>Selected</strong>.
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => setShowDemoPreview(false)}
              >
                Back to Empty State
              </button>
            </div>
          )}

          {/* =================================================================
              ACTIVE INTERNSHIP EXISTS (or Demo Mode Activated)
              ================================================================= */}
          {activeInternship ? (
            <>
              {/* Active Internship Header Card */}
              <div className="active-internship-card">
                <div className="active-internship-header">
                  <div className="active-internship-info">
                    <div className="active-internship-icon">
                      <Building size={26} />
                    </div>
                    <div className="active-internship-text">
                      <h2 className="active-internship-title">
                        {activeInternship.title}
                      </h2>
                      <span className="active-internship-company">
                        {activeInternship.company}
                      </span>
                    </div>
                  </div>

                  <span className="active-internship-status-badge">
                    <CheckCircle2 size={14} />
                    Status: {activeInternship.status}
                  </span>
                </div>

                <div className="active-internship-meta-grid">
                  <div className="active-internship-meta-item">
                    <MapPin size={18} className="active-internship-meta-icon" />
                    <div>
                      <div className="active-internship-meta-label">Location</div>
                      <div className="active-internship-meta-val">
                        {activeInternship.location} • {activeInternship.workMode}
                      </div>
                    </div>
                  </div>

                  <div className="active-internship-meta-item">
                    <Clock size={18} className="active-internship-meta-icon" />
                    <div>
                      <div className="active-internship-meta-label">Duration</div>
                      <div className="active-internship-meta-val">
                        {activeInternship.duration}
                      </div>
                    </div>
                  </div>

                  <div className="active-internship-meta-item">
                    <Calendar size={18} className="active-internship-meta-icon" />
                    <div>
                      <div className="active-internship-meta-label">Start Date</div>
                      <div className="active-internship-meta-val">
                        {activeInternship.startDate}
                      </div>
                    </div>
                  </div>

                  <div className="active-internship-meta-item">
                    <Calendar size={18} className="active-internship-meta-icon" />
                    <div>
                      <div className="active-internship-meta-label">Expected End</div>
                      <div className="active-internship-meta-val">
                        {activeInternship.endDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Progress Section */}
              <div className="progress-overview">
                <div className="progress-overview-top">
                  <h3 className="progress-overview-title">
                    <TrendingUp size={20} />
                    Overall Progress
                  </h3>
                  <div className="progress-overview-pct">
                    {demoInternshipProgress.overview.percentage}%
                  </div>
                </div>

                {/* Progress Bar (Accessible) */}
                <div
                  className="progress-bar-track"
                  role="progressbar"
                  aria-valuenow={demoInternshipProgress.overview.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Internship overall completion progress"
                >
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${demoInternshipProgress.overview.percentage}%`,
                    }}
                  />
                </div>

                <div className="progress-overview-metrics">
                  <div className="progress-overview-metric-item">
                    Completed Tasks:{' '}
                    <strong>
                      {demoInternshipProgress.overview.completedTasks} of{' '}
                      {demoInternshipProgress.overview.totalTasks}
                    </strong>
                  </div>
                  <div className="progress-overview-metric-item">
                    Days Completed:{' '}
                    <strong>
                      {demoInternshipProgress.overview.completedDays} of{' '}
                      {demoInternshipProgress.overview.totalDays} Days
                    </strong>
                  </div>
                  <div className="progress-overview-metric-item">
                    Milestones:{' '}
                    <strong>
                      {demoInternshipProgress.overview.completedMilestones} of{' '}
                      {demoInternshipProgress.overview.totalMilestones} Completed
                    </strong>
                  </div>
                </div>
              </div>

              {/* Progress Summary Cards (4 Metrics) */}
              <div className="progress-summary">
                {/* Completed Tasks */}
                <div className="progress-summary-card">
                  <div className="progress-summary-icon-wrap">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="progress-summary-info">
                    <span className="progress-summary-label">Completed Tasks</span>
                    <span className="progress-summary-value">
                      {demoInternshipProgress.overview.completedTasks}
                    </span>
                  </div>
                </div>

                {/* Pending Tasks */}
                <div className="progress-summary-card">
                  <div className="progress-summary-icon-wrap">
                    <Clock size={22} />
                  </div>
                  <div className="progress-summary-info">
                    <span className="progress-summary-label">Pending Tasks</span>
                    <span className="progress-summary-value">
                      {demoInternshipProgress.overview.totalTasks -
                        demoInternshipProgress.overview.completedTasks}
                    </span>
                  </div>
                </div>

                {/* Milestones */}
                <div className="progress-summary-card">
                  <div className="progress-summary-icon-wrap">
                    <Award size={22} />
                  </div>
                  <div className="progress-summary-info">
                    <span className="progress-summary-label">Milestones</span>
                    <span className="progress-summary-value">
                      {demoInternshipProgress.overview.completedMilestones} /{' '}
                      {demoInternshipProgress.overview.totalMilestones}
                    </span>
                  </div>
                </div>

                {/* Days Completed */}
                <div className="progress-summary-card">
                  <div className="progress-summary-icon-wrap">
                    <Calendar size={22} />
                  </div>
                  <div className="progress-summary-info">
                    <span className="progress-summary-label">Days Completed</span>
                    <span className="progress-summary-value">
                      {demoInternshipProgress.overview.completedDays} /{' '}
                      {demoInternshipProgress.overview.totalDays}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Timeline & Tasks */}
              <div className="progress-two-col-grid">
                {/* Left: Internship Timeline */}
                <div className="progress-timeline-card">
                  <div className="progress-timeline-header">
                    <h3 className="progress-timeline-title">
                      <Target size={20} />
                      Internship Journey Timeline
                    </h3>
                  </div>

                  <div className="progress-timeline">
                    {demoInternshipProgress.timeline.map((item) => {
                      let statusClass = 'status-upcoming'
                      if (item.status === 'Completed') statusClass = 'status-completed'
                      if (item.status === 'In Progress') statusClass = 'status-in-progress'

                      return (
                        <div
                          key={item.id}
                          className={`timeline-item ${statusClass}`}
                        >
                          <div className="timeline-node">
                            {item.status === 'Completed' ? (
                              <Check size={13} strokeWidth={3} />
                            ) : item.status === 'In Progress' ? (
                              <Circle size={10} fill="currentColor" />
                            ) : (
                              <Circle size={8} />
                            )}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-header-line">
                              <h4 className="timeline-title">{item.title}</h4>
                              {item.date && (
                                <span className="timeline-date">{item.date}</span>
                              )}
                            </div>
                            <p className="timeline-desc">{item.description}</p>
                            <span className={`timeline-status ${statusClass}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Right: Tasks & Activities */}
                <div className="tasks-section">
                  <div className="tasks-section-header">
                    <h3 className="tasks-section-title">
                      <Layers size={20} />
                      Tasks & Activities
                    </h3>

                    {/* Filter Tabs */}
                    <div className="tasks-filter-tabs">
                      {['All', 'In Progress', 'Completed', 'Pending'].map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          className={`task-filter-btn ${taskFilter === filter ? 'active' : ''}`}
                          onClick={() => setTaskFilter(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="tasks-list">
                    {filteredTasks.map((task) => {
                      let cardStatusClass = 'task-pending'
                      if (task.status === 'Completed') cardStatusClass = 'task-completed'
                      if (task.status === 'In Progress') cardStatusClass = 'task-in-progress'

                      return (
                        <div
                          key={task.id}
                          className={`task-card ${cardStatusClass}`}
                        >
                          <div className="task-card-header">
                            <div className="task-card-left">
                              <div className="task-card-icon">
                                {task.status === 'Completed' ? (
                                  <CheckCircle2 size={18} />
                                ) : task.status === 'In Progress' ? (
                                  <TrendingUp size={18} />
                                ) : (
                                  <Clock size={18} />
                                )}
                              </div>
                              <div className="task-card-details">
                                <span className="task-card-title">{task.title}</span>
                                <p className="task-card-desc">{task.description}</p>
                              </div>
                            </div>
                            <span className={`task-status ${cardStatusClass}`}>
                              {task.status}
                            </span>
                          </div>

                          <div className="task-card-footer">
                            <div className="task-due-date">
                              <Calendar size={13} />
                              <span>Due: {task.dueDate}</span>
                            </div>

                            {task.progress !== undefined && (
                              <div className="task-progress-mini">
                                <div className="task-mini-track">
                                  <div
                                    className="task-mini-fill"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                                <span>{task.progress}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Milestones Section */}
              <div className="milestones-section">
                <div className="milestones-header">
                  <h3 className="milestones-title">
                    <Award size={20} />
                    Internship Milestones
                  </h3>
                </div>

                <div className="milestones-grid">
                  {demoInternshipProgress.milestones.map((m) => {
                    let statusClass = 'task-pending'
                    if (m.status === 'Completed') statusClass = 'task-completed'
                    if (m.status === 'In Progress') statusClass = 'task-in-progress'

                    return (
                      <div key={m.id} className="milestone-card">
                        <div className="milestone-card-top">
                          <h4 className="milestone-card-title">{m.title}</h4>
                          <span className={`task-status ${statusClass}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="milestone-card-desc">{m.description}</p>
                        <div className="milestone-card-date">
                          <Calendar size={13} />
                          <span>{m.date}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Weekly Progress Section (Simple HTML/CSS without external chart lib) */}
              <div className="weekly-progress-card">
                <h3 className="weekly-progress-title">
                  <Calendar size={20} />
                  Weekly Progress Overview
                </h3>

                <div className="weekly-progress-grid">
                  {demoInternshipProgress.weeklyProgress.map((wp) => (
                    <div key={wp.week} className="weekly-item-card">
                      <span className="weekly-item-week">{wp.week}</span>
                      <span className="weekly-item-label">{wp.label}</span>
                      <div className="weekly-item-bar">
                        <div
                          className="weekly-item-fill"
                          style={{ width: `${wp.percentage}%` }}
                        />
                      </div>
                      <span className="weekly-item-pct">{wp.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Grid: Latest Mentor Update & Performance Overview */}
              <div className="progress-two-col-grid">
                {/* Latest Update (Mentor / HR) */}
                <div className="latest-update-card">
                  <div className="latest-update-header">
                    <h3 className="latest-update-title">
                      <MessageSquare size={20} />
                      Latest Supervisor Update
                    </h3>
                  </div>

                  {demoInternshipProgress.updates.map((update) => (
                    <div key={update.id} className="latest-update-box">
                      <p className="latest-update-quote">"{update.message}"</p>
                      <div className="latest-update-meta">
                        <span className="latest-update-author">
                          {update.author}
                        </span>
                        <span>{update.date}</span>
                      </div>
                    </div>
                  ))}

                  <div className="latest-update-disclaimer">
                    <Info size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Note: Frontend demo evaluation feedback. Real supervisor notes and weekly review ratings will be synchronized when company HR services are connected.
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="performance-section">
                  <div className="performance-header">
                    <h3 className="performance-title">
                      <Sparkles size={20} />
                      Performance Overview
                    </h3>
                  </div>

                  <div className="performance-items-list">
                    {demoInternshipProgress.performance.map((item) => (
                      <div key={item.category} className="performance-item">
                        <div className="performance-item-top">
                          <span className="performance-item-name">
                            {item.category}
                          </span>
                          <span className="performance-item-pct">
                            {item.score}%
                          </span>
                        </div>
                        <div
                          className="performance-track"
                          role="progressbar"
                          aria-valuenow={item.score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${item.category} score`}
                        >
                          <div
                            className="performance-fill"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="latest-update-disclaimer">
                    Performance indicators represent preliminary workplace review assessments across core engineering and collaboration criteria.
                  </div>
                </div>
              </div>

              {/* Document / Report Connection Section */}
              <div className="progress-docs-card">
                <div className="progress-docs-header">
                  <h3 className="progress-docs-title">
                    <FileText size={20} />
                    Internship Documents
                  </h3>
                  <Link
                    to="/student/documents"
                    className="btn btn-outline"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Go to My Documents
                  </Link>
                </div>

                {existingDocuments.length > 0 ? (
                  <div className="progress-docs-list">
                    {existingDocuments.map((doc, idx) => (
                      <div key={doc.id || doc.name || idx} className="progress-doc-item">
                        <FileText size={18} className="progress-doc-item-icon" />
                        <div className="progress-doc-item-details">
                          <span className="progress-doc-item-name" title={doc.name}>
                            {doc.name}
                          </span>
                          <span className="progress-doc-item-meta">
                            {doc.type || 'Document'} • {doc.size || 'Saved'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--muted-gray)', lineHeight: 1.5 }}>
                    No internship documents or weekly reports stored in your account yet. You can upload and organize documents on the{' '}
                    <Link to="/student/documents" style={{ color: 'var(--primary-plum)', fontWeight: 600 }}>
                      My Documents
                    </Link>{' '}
                    page.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* =================================================================
               EMPTY STATE: NO SELECTED / ACTIVE INTERNSHIP
               ================================================================= */
            <div className="empty-progress">
              <div className="empty-progress-icon">
                <Compass size={32} />
              </div>
              <h2 className="empty-progress-title">No Active Internship</h2>
              <p className="empty-progress-text">
                You don't have an active internship yet. Once an application is marked as selected, your internship progress will appear here.
              </p>
              <div className="empty-progress-actions">
                <Link to="/student/applications" className="btn btn-primary">
                  View My Applications
                </Link>
                <Link to="/student/internships" className="btn btn-outline">
                  Find Internships
                </Link>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowDemoPreview(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="Simulate active internship tracking with demo data"
                >
                  <Eye size={15} />
                  Preview Demo Progress
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentProgress
