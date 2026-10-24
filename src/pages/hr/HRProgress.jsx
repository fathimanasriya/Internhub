import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Clock,
  Search,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Building2,
  Sliders,
  Sparkles,
  Award,
  ArrowRight,
  AlertCircle,
  X,
  Check,
  ChevronRight,
  Briefcase,
  FileCheck,
  Layers,
  RotateCcw,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import './HRProgress.css'

// Initial demo interns fallback (matching HRInterns.jsx)
const INITIAL_DEMO_INTERNS = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+91 98765 01001',
    college: 'IIT Bombay',
    degree: 'B.Tech Computer Science',
    graduationYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    progress: 65,
    status: 'Active',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 2,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+91 98765 01002',
    college: 'BITS Pilani',
    degree: 'B.E. Computer Science',
    graduationYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Remote',
    location: 'Remote',
    startDate: '2026-08-15',
    endDate: '2026-11-15',
    progress: 80,
    status: 'Active',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 3,
    name: 'Daniel Thomas',
    email: 'daniel@example.com',
    phone: '+91 98765 01003',
    college: 'NID Ahmedabad',
    degree: 'M.Des Interaction Design',
    graduationYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Hybrid',
    location: 'Kochi, Kerala',
    startDate: '2026-09-05',
    endDate: '2026-11-05',
    progress: 45,
    status: 'Active',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 4,
    name: 'Olivia Martin',
    email: 'olivia@example.com',
    phone: '+91 98765 01004',
    college: 'Delhi University',
    degree: 'B.Sc Statistics & Analytics',
    graduationYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    progress: 100,
    status: 'Completed',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 5,
    name: 'Sophia Davis',
    email: 'sophia@example.com',
    phone: '+91 98765 01005',
    college: 'ABC College of Engineering',
    degree: 'B.Des',
    graduationYear: '2028',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    startDate: '2026-08-20',
    endDate: '2026-10-20',
    progress: 70,
    status: 'Ending Soon',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 6,
    name: 'Noah Miller',
    email: 'noah@example.com',
    phone: '+91 98765 01006',
    college: 'Kerala Institute of Technology',
    degree: 'B.Tech CSE',
    graduationYear: '2028',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    startDate: '2026-09-10',
    endDate: '2026-12-10',
    progress: 35,
    status: 'Active',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 7,
    name: 'Ava Taylor',
    email: 'ava@example.com',
    phone: '+91 98765 01007',
    college: 'XYZ Institute of Technology',
    degree: 'B.Tech CSE',
    graduationYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    progress: 100,
    status: 'Completed',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
  {
    id: 8,
    name: 'Ethan Brown',
    email: 'ethan@example.com',
    phone: '+91 98765 01008',
    college: 'National College of Engineering',
    degree: 'B.Tech CSE',
    graduationYear: '2028',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    progress: 75,
    status: 'Ending Soon',
    supervisor: 'Sarah Mitchell',
    mentorEmail: 'sarah.m@technovalabs.com',
  },
]

/**
 * Standard milestone stages for internship journey visualization
 */
const MILESTONE_STAGES = [
  { key: 'orientation', label: 'Orientation & Setup', minPct: 25, desc: 'Environment access, tooling & initial briefings' },
  { key: 'foundation', label: 'Foundation & Tasks', minPct: 50, desc: 'Active ticket delivery and sprint contributions' },
  { key: 'advanced', label: 'Advanced Project Work', minPct: 75, desc: 'High-impact feature ownership & peer reviews' },
  { key: 'completion', label: 'Final Review & Wrap-up', minPct: 100, desc: 'Final appraisal, demo, and certificate qualification' },
]

/**
 * HRProgress Component
 * Allows HR to inspect, track, and update student intern progress & milestones.
 */
function HRProgress() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const internIdParam = searchParams.get('internId')

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [bannerMessage, setBannerMessage] = useState(null)
  const [invalidIdWarning, setInvalidIdWarning] = useState(null)

  // Recruiter Profile
  const [hrProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRProfile')
      if (stored) return JSON.parse(stored)
    } catch (err) {
      console.error('Error reading hrProfile:', err)
    }
    return {
      hrName: 'Sarah Mitchell',
      initials: 'SM',
      companyName: 'TechNova Labs',
    }
  })

  // Interns state initialized from localStorage
  const [interns, setInterns] = useState(() => {
    try {
      const saved = localStorage.getItem('internhubHRInterns')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.error('Error reading internhubHRInterns:', err)
    }
    return INITIAL_DEMO_INTERNS
  })

  // Selected intern resolution from query param or selection
  const selectedIntern = useMemo(() => {
    if (!internIdParam) return null
    return interns.find((i) => String(i.id) === String(internIdParam)) || null
  }, [interns, internIdParam])

  // Detect invalid internId in URL parameter gracefully
  useEffect(() => {
    if (internIdParam) {
      const exists = interns.some((i) => String(i.id) === String(internIdParam))
      if (!exists) {
        setInvalidIdWarning(
          `Intern with ID "${internIdParam}" was not found. Please choose an intern from the list below.`
        )
      } else {
        setInvalidIdWarning(null)
      }
    } else {
      setInvalidIdWarning(null)
    }
  }, [internIdParam, interns])

  // Form edit state for currently selected intern
  const [progressVal, setProgressVal] = useState(0)
  const [statusVal, setStatusVal] = useState('Active')
  const [notesVal, setNotesVal] = useState('')

  // Sync edit form fields whenever selected intern changes
  useEffect(() => {
    if (selectedIntern) {
      setProgressVal(typeof selectedIntern.progress === 'number' ? selectedIntern.progress : 0)
      setStatusVal(selectedIntern.status || 'Active')
      setNotesVal(selectedIntern.notes || '')
    }
  }, [selectedIntern])

  // Filtered interns list based on search & status filter
  const filteredInterns = useMemo(() => {
    return interns.filter((intern) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        (intern.name && intern.name.toLowerCase().includes(q)) ||
        (intern.email && intern.email.toLowerCase().includes(q)) ||
        (intern.internship && intern.internship.toLowerCase().includes(q)) ||
        (intern.department && intern.department.toLowerCase().includes(q))

      const matchesStatus =
        statusFilter === 'All' || intern.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [interns, searchQuery, statusFilter])

  // Quick summary stats
  const metrics = useMemo(() => {
    const total = interns.length
    const active = interns.filter((i) => i.status === 'Active').length
    const endingSoon = interns.filter((i) => i.status === 'Ending Soon').length
    const completed = interns.filter((i) => i.status === 'Completed').length
    const avgProgress =
      total > 0
        ? Math.round(interns.reduce((acc, curr) => acc + (curr.progress || 0), 0) / total)
        : 0

    return { total, active, endingSoon, completed, avgProgress }
  }, [interns])

  // Handle intern card selection
  const handleSelectIntern = (id) => {
    setSearchParams({ internId: id })
    setInvalidIdWarning(null)
  }

  // Handle progress slider / number change
  const handleProgressChange = (newVal) => {
    const num = Math.min(100, Math.max(0, Number(newVal) || 0))
    setProgressVal(num)

    // Automatically set status to Completed if progress hits 100%
    if (num === 100) {
      setStatusVal('Completed')
    } else if (statusVal === 'Completed' && num < 100) {
      setStatusVal('Active')
    }
  }

  // Handle status selection
  const handleStatusChange = (newStatus) => {
    setStatusVal(newStatus)
    // If user marks completed manually, optionally push to 100%
    if (newStatus === 'Completed' && progressVal < 100) {
      setProgressVal(100)
    }
  }

  // Reset form to current saved state
  const handleResetForm = () => {
    if (selectedIntern) {
      setProgressVal(selectedIntern.progress || 0)
      setStatusVal(selectedIntern.status || 'Active')
      setNotesVal(selectedIntern.notes || '')
    }
  }

  // Save Progress Update
  const handleSaveProgress = (e) => {
    e.preventDefault()
    if (!selectedIntern) return

    const updatedInterns = interns.map((item) => {
      if (String(item.id) === String(selectedIntern.id)) {
        return {
          ...item,
          progress: progressVal,
          status: statusVal,
          notes: notesVal,
          lastEvaluated: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }
      }
      return item
    })

    setInterns(updatedInterns)

    try {
      localStorage.setItem('internhubHRInterns', JSON.stringify(updatedInterns))
    } catch (err) {
      console.error('Error saving updated interns to localStorage:', err)
    }

    setBannerMessage('Intern progress updated successfully.')
  }

  // Helper for avatar initials
  const getInitials = (name) => {
    if (!name) return 'IN'
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // Helper for date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="hr-dashboard-layout">
      {/* 1. Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="hr-main-content">
        <Topbar
          hrName={hrProfile.hrName}
          initials={hrProfile.initials}
          companyName={hrProfile.companyName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Progress"
          onSearch={(q) => setSearchQuery(q)}
        />

        <main className="hr-dashboard-container">
          {/* Header Banner */}
          <div className="hr-progress-header">
            <div className="hr-progress-title-group">
              <h1 className="hr-progress-title">Intern Progress</h1>
              <p className="hr-progress-subtitle">
                Track, evaluate, and update milestone progress for all active and completed interns.
              </p>
            </div>

            {selectedIntern && (
              <div className="hr-progress-quick-badge">
                <span className="badge-tag">Current Focus</span>
                <span className="badge-name">{selectedIntern.name}</span>
              </div>
            )}
          </div>

          {/* Feedback Success Banner */}
          {bannerMessage && (
            <div className="hr-progress-banner" role="status" aria-live="polite">
              <div className="hr-banner-content">
                <CheckCircle2 size={18} />
                <span>{bannerMessage}</span>
              </div>
              <button
                type="button"
                className="hr-banner-close"
                onClick={() => setBannerMessage(null)}
                aria-label="Dismiss banner"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Invalid URL internId Notice */}
          {invalidIdWarning && (
            <div className="hr-progress-warning-banner" role="alert">
              <div className="hr-banner-content">
                <AlertCircle size={18} />
                <span>{invalidIdWarning}</span>
              </div>
              <button
                type="button"
                className="hr-banner-close"
                onClick={() => setInvalidIdWarning(null)}
                aria-label="Dismiss warning"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Summary Stat Cards */}
          <section className="hr-progress-stats-grid" aria-label="Progress Statistics">
            <div className="hr-progress-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Total Interns</span>
                <div className="hr-stat-icon-box">
                  <UserCheck size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.total}</div>
              <span className="hr-stat-subtext">Students enrolled</span>
            </div>

            <div className="hr-progress-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Average Progress</span>
                <div className="hr-stat-icon-box hr-stat-icon-avg">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.avgProgress}%</div>
              <span className="hr-stat-subtext">Across all cohorts</span>
            </div>

            <div className="hr-progress-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Active Interns</span>
                <div className="hr-stat-icon-box hr-stat-icon-active">
                  <Clock size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.active}</div>
              <span className="hr-stat-subtext">In-progress tracking</span>
            </div>

            <div className="hr-progress-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Completed</span>
                <div className="hr-stat-icon-box hr-stat-icon-completed">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.completed}</div>
              <span className="hr-stat-subtext">100% milestone achieved</span>
            </div>
          </section>

          {/* Master-Detail Layout */}
          <div className="hr-progress-workspace-layout">
            {/* Left Column: Directory & Intern Selector */}
            <aside className="hr-progress-directory-card" aria-label="Interns Directory">
              <div className="hr-directory-header">
                <h2 className="hr-directory-title">Interns Directory</h2>
                <span className="hr-directory-count">{filteredInterns.length} available</span>
              </div>

              {/* Search Bar */}
              <div className="hr-directory-search-wrap">
                <Search size={15} className="hr-directory-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  className="hr-directory-search-input"
                  placeholder="Search by name, role, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search interns directory"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="hr-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="hr-directory-status-tabs" role="tablist" aria-label="Filter interns by status">
                {['All', 'Active', 'Ending Soon', 'Completed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    role="tab"
                    aria-selected={statusFilter === st}
                    className={`hr-dir-tab-btn ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Interns Scrollable List */}
              <div className="hr-directory-list">
                {filteredInterns.length > 0 ? (
                  filteredInterns.map((intern) => {
                    const isSelected = selectedIntern && String(selectedIntern.id) === String(intern.id)
                    const isEndingSoon = intern.status === 'Ending Soon'
                    const isCompleted = intern.status === 'Completed'

                    return (
                      <button
                        key={intern.id}
                        type="button"
                        className={`hr-dir-item-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectIntern(intern.id)}
                      >
                        <div className="hr-dir-item-top">
                          <div className="hr-dir-avatar" aria-hidden="true">
                            {getInitials(intern.name)}
                          </div>
                          <div className="hr-dir-info">
                            <h3 className="hr-dir-name">{intern.name}</h3>
                            <span className="hr-dir-role">{intern.internship}</span>
                          </div>
                          <ChevronRight
                            size={16}
                            className={`hr-dir-arrow ${isSelected ? 'arrow-selected' : ''}`}
                          />
                        </div>

                        {/* Progress Bar & Status Pill */}
                        <div className="hr-dir-item-bottom">
                          <div className="hr-dir-progress-row">
                            <div className="hr-dir-progress-bg">
                              <div
                                className={`hr-dir-progress-fill ${
                                  isCompleted ? 'fill-completed' : isEndingSoon ? 'fill-ending' : ''
                                }`}
                                style={{ width: `${intern.progress || 0}%` }}
                              />
                            </div>
                            <span className="hr-dir-pct">{intern.progress || 0}%</span>
                          </div>

                          <span
                            className={`hr-dir-status-badge ${
                              intern.status === 'Active'
                                ? 'badge-active'
                                : isEndingSoon
                                ? 'badge-ending'
                                : 'badge-completed'
                            }`}
                          >
                            {intern.status}
                          </span>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="hr-dir-empty-state">
                    <AlertCircle size={22} className="hr-dir-empty-icon" />
                    <p className="hr-dir-empty-title">No interns found</p>
                    <p className="hr-dir-empty-desc">
                      Try adjusting your search query or switching status filters.
                    </p>
                    {(searchQuery || statusFilter !== 'All') && (
                      <button
                        type="button"
                        className="hr-btn-link"
                        onClick={() => {
                          setSearchQuery('')
                          setStatusFilter('All')
                        }}
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </aside>

            {/* Right Column: Detailed Progress & Update Section */}
            <section className="hr-progress-detail-panel" aria-label="Intern Progress Manager">
              {selectedIntern ? (
                <div className="hr-detail-content-wrap">
                  {/* Selected Intern Profile Header Card */}
                  <div className="hr-detail-profile-card">
                    <div className="hr-detail-profile-top">
                      <div className="hr-detail-avatar-large" aria-hidden="true">
                        {getInitials(selectedIntern.name)}
                      </div>
                      <div className="hr-detail-title-block">
                        <div className="hr-detail-name-row">
                          <h2 className="hr-detail-intern-name">{selectedIntern.name}</h2>
                          <span
                            className={`hr-progress-status-chip ${
                              selectedIntern.status === 'Active'
                                ? 'status-active'
                                : selectedIntern.status === 'Ending Soon'
                                ? 'status-ending'
                                : 'status-completed'
                            }`}
                          >
                            {selectedIntern.status === 'Active' && <Clock size={12} />}
                            {selectedIntern.status === 'Ending Soon' && <AlertCircle size={12} />}
                            {selectedIntern.status === 'Completed' && <CheckCircle2 size={12} />}
                            <span>{selectedIntern.status}</span>
                          </span>
                        </div>
                        <p className="hr-detail-intern-role">
                          {selectedIntern.internship} • {selectedIntern.department || 'Engineering'}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="hr-detail-meta-grid">
                      <div className="hr-detail-meta-item">
                        <span className="hr-meta-label">
                          <GraduationCap size={13} />
                          <span>Institution & Stream</span>
                        </span>
                        <span className="hr-meta-value">
                          {selectedIntern.college} • {selectedIntern.degree || 'Degree Program'}
                        </span>
                      </div>

                      <div className="hr-detail-meta-item">
                        <span className="hr-meta-label">
                          <Mail size={13} />
                          <span>Student Contact</span>
                        </span>
                        <span className="hr-meta-value">{selectedIntern.email}</span>
                      </div>

                      <div className="hr-detail-meta-item">
                        <span className="hr-meta-label">
                          <MapPin size={13} />
                          <span>Work Mode</span>
                        </span>
                        <span className="hr-meta-value">
                          {selectedIntern.type || 'Hybrid'} • {selectedIntern.location || 'Bengaluru'}
                        </span>
                      </div>

                      <div className="hr-detail-meta-item">
                        <span className="hr-meta-label">
                          <Calendar size={13} />
                          <span>Internship Timeline</span>
                        </span>
                        <span className="hr-meta-value">
                          {formatDate(selectedIntern.startDate)} – {formatDate(selectedIntern.endDate)}
                        </span>
                      </div>

                      <div className="hr-detail-meta-item">
                        <span className="hr-meta-label">
                          <Building2 size={13} />
                          <span>Supervisor</span>
                        </span>
                        <span className="hr-meta-value">
                          {selectedIntern.supervisor || hrProfile.hrName}
                        </span>
                      </div>

                      <div className="hr-detail-meta-item">
                        <span className="hr-meta-label">
                          <CheckCircle2 size={13} />
                          <span>Mentor Email</span>
                        </span>
                        <span className="hr-meta-value">
                          {selectedIntern.mentorEmail || 'hr@technovalabs.com'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Visualization & Milestone Stepper Card */}
                  <div className="hr-detail-milestones-card">
                    <div className="hr-card-section-head">
                      <div className="hr-section-title-wrap">
                        <Layers size={17} className="hr-section-icon" />
                        <h3 className="hr-card-section-title">Milestone Roadmap</h3>
                      </div>
                      <span className="hr-live-pct-badge">{selectedIntern.progress || 0}% Completed</span>
                    </div>

                    {/* Progress Bar Visualization */}
                    <div className="hr-milestone-bar-wrap">
                      <div
                        className="hr-milestone-bar-bg"
                        role="progressbar"
                        aria-valuenow={selectedIntern.progress || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`Current milestone progress for ${selectedIntern.name}`}
                      >
                        <div
                          className={`hr-milestone-bar-fill ${
                            selectedIntern.status === 'Completed'
                              ? 'fill-complete'
                              : selectedIntern.status === 'Ending Soon'
                              ? 'fill-warn'
                              : ''
                          }`}
                          style={{ width: `${selectedIntern.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* 4-Stage Stepper Breakdown */}
                    <div className="hr-stages-stepper">
                      {MILESTONE_STAGES.map((stage, idx) => {
                        const isStageDone = (selectedIntern.progress || 0) >= stage.minPct
                        const isStageCurrent =
                          (selectedIntern.progress || 0) < stage.minPct &&
                          (idx === 0 || (selectedIntern.progress || 0) >= MILESTONE_STAGES[idx - 1].minPct)

                        return (
                          <div
                            key={stage.key}
                            className={`hr-stage-step ${
                              isStageDone ? 'step-done' : isStageCurrent ? 'step-current' : 'step-pending'
                            }`}
                          >
                            <div className="hr-step-indicator">
                              {isStageDone ? (
                                <Check size={13} className="hr-step-check" />
                              ) : (
                                <span className="hr-step-num">{idx + 1}</span>
                              )}
                            </div>
                            <div className="hr-step-content">
                              <span className="hr-step-label">{stage.label}</span>
                              <span className="hr-step-target">{stage.minPct}% Goal</span>
                              <span className="hr-step-desc">{stage.desc}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Progress Update Form Card */}
                  <div className="hr-detail-form-card">
                    <div className="hr-card-section-head">
                      <div className="hr-section-title-wrap">
                        <Sliders size={17} className="hr-section-icon" />
                        <h3 className="hr-card-section-title">Update Progress & Lifecycle</h3>
                      </div>
                      <span className="hr-form-hint">Changes will save directly to intern record</span>
                    </div>

                    <form onSubmit={handleSaveProgress} className="hr-progress-edit-form">
                      {/* Interactive Progress Controller (Slider + Input) */}
                      <div className="hr-form-group">
                        <div className="hr-slider-header">
                          <label htmlFor="intern-progress-slider" className="hr-form-label">
                            Milestone Completion Percentage
                          </label>
                          <div className="hr-slider-live-value">
                            <span className="hr-live-number">{progressVal}%</span>
                          </div>
                        </div>

                        <div className="hr-slider-row">
                          <input
                            id="intern-progress-slider"
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={progressVal}
                            onChange={(e) => handleProgressChange(e.target.value)}
                            className="hr-progress-range-slider"
                            aria-label="Adjust percentage slider"
                          />
                          <div className="hr-number-input-wrap">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={progressVal}
                              onChange={(e) => handleProgressChange(e.target.value)}
                              className="hr-progress-number-input"
                              aria-label="Direct percentage input"
                            />
                            <span className="hr-input-suffix">%</span>
                          </div>
                        </div>

                        {/* Quick adjustment presets */}
                        <div className="hr-preset-chips" aria-label="Preset percentages">
                          <span className="hr-preset-label">Quick Snap:</span>
                          {[25, 50, 75, 100].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              className={`hr-preset-btn ${progressVal === preset ? 'preset-active' : ''}`}
                              onClick={() => handleProgressChange(preset)}
                            >
                              {preset}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="hr-form-group">
                        <label className="hr-form-label">Internship Lifecycle Status</label>
                        <div className="hr-status-options-grid" role="radiogroup" aria-label="Intern status options">
                          {[
                            { value: 'Active', label: 'Active', desc: 'Currently working & progressing' },
                            { value: 'Ending Soon', label: 'Ending Soon', desc: 'Approaching conclusion date' },
                            { value: 'Completed', label: 'Completed', desc: '100% milestone reached & graduated' },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              role="radio"
                              aria-checked={statusVal === opt.value}
                              className={`hr-status-choice-btn ${statusVal === opt.value ? 'selected' : ''}`}
                              onClick={() => handleStatusChange(opt.value)}
                            >
                              <div className="hr-choice-top">
                                <span className="hr-choice-title">{opt.label}</span>
                                {statusVal === opt.value && <Check size={14} className="hr-choice-check" />}
                              </div>
                              <span className="hr-choice-desc">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Supervisor Notes & Feedback */}
                      <div className="hr-form-group">
                        <label htmlFor="supervisor-notes" className="hr-form-label">
                          Supervisor Evaluation & Milestone Notes (Optional)
                        </label>
                        <textarea
                          id="supervisor-notes"
                          rows="3"
                          className="hr-form-textarea"
                          placeholder="Record review feedback, outstanding deliverables, or final comments..."
                          value={notesVal}
                          onChange={(e) => setNotesVal(e.target.value)}
                        />
                      </div>

                      {/* Form Actions Footer */}
                      <div className="hr-form-actions-footer">
                        <button
                          type="button"
                          className="hr-btn-cancel-changes"
                          onClick={handleResetForm}
                        >
                          <RotateCcw size={14} />
                          <span>Reset</span>
                        </button>

                        <button type="submit" className="hr-btn-save-progress">
                          <CheckCircle2 size={16} />
                          <span>Save Progress Update</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                /* Empty / No Intern Selected State */
                <div className="hr-progress-no-selection-card">
                  <div className="hr-no-selection-icon-box" aria-hidden="true">
                    <TrendingUp size={36} />
                  </div>
                  <h2 className="hr-no-selection-title">Select an Intern to Track Progress</h2>
                  <p className="hr-no-selection-desc">
                    Choose an intern from the directory on the left or use the search box to view their milestone roadmap, update completion percentages, and manage lifecycle status.
                  </p>
                  {filteredInterns.length > 0 && (
                    <button
                      type="button"
                      className="hr-btn-select-first"
                      onClick={() => handleSelectIntern(filteredInterns[0].id)}
                    >
                      <span>Select {filteredInterns[0].name}</span>
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HRProgress
