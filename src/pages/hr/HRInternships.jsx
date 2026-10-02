import { useState, useMemo, useEffect } from 'react'
import {
  Plus,
  Search,
  Building2,
  Users,
  Eye,
  Edit3,
  XCircle,
  Trash2,
  CheckCircle2,
  X,
  AlertTriangle,
  Briefcase,
  Sparkles,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import './HRInternships.css'

const DEMO_INTERNSHIPS = [
  {
    id: 'int-01',
    title: 'Frontend Development Intern',
    company: 'NovaTech Labs Pvt Ltd',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    stipend: '₹15,000 / month',
    openings: 5,
    applications: 12,
    status: 'Active',
    deadline: '2026-11-15',
    skills: 'Java, React, MySQL, JavaScript, Git',
    description:
      'We are looking for an enthusiastic Frontend Development Intern to help build responsive, fast, and accessible user interfaces for our enterprise career platform.',
    responsibilities:
      '• Collaborate closely with product managers and UX designers to build clean UI components.\n• Integrate RESTful services and ensure state persistence.\n• Optimize web applications for cross-browser responsiveness and performance.',
    requirements:
      '• Currently pursuing a Bachelor’s degree in Computer Science, IT, or related technical disciplines.\n• Hands-on experience with modern React, JavaScript (ES6+), and CSS.\n• Familiarity with Git version control and REST APIs.',
  },
  {
    id: 'int-02',
    title: 'UI/UX Design Intern',
    company: 'NovaTech Labs Pvt Ltd',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    stipend: '₹10,000 / month',
    openings: 3,
    applications: 8,
    status: 'Active',
    deadline: '2026-11-20',
    skills: 'Figma, Wireframing, User Research, Prototyping',
    description:
      'Join our product design team to create thoughtful design systems, prototypes, and user experiences for thousands of student candidates and corporate recruiters.',
    responsibilities:
      '• Design user flows, wireframes, and high-fidelity mockups in Figma.\n• Participate in usability tests and gather qualitative user feedback.\n• Maintain and expand the InternHub corporate design system token library.',
    requirements:
      '• Strong portfolio showcasing web and mobile UI design projects.\n• Proficiency in Figma, interactive prototyping, and layout principles.\n• Eagerness to iterate based on feedback and analytical insights.',
  },
  {
    id: 'int-03',
    title: 'Data Analytics Intern',
    company: 'NovaTech Labs Pvt Ltd',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    stipend: '₹18,000 / month',
    openings: 2,
    applications: 6,
    status: 'Active',
    deadline: '2026-12-01',
    skills: 'Python, SQL, Power BI, Excel, Statistics',
    description:
      'Exciting opportunity for a data-driven intern to analyze talent placement trends, build real-time executive reports, and uncover pipeline bottlenecks.',
    responsibilities:
      '• Query and transform complex data sources using SQL and Python.\n• Build interactive KPI dashboards using Power BI and Excel.\n• Present monthly actionable insights to senior HR leaders.',
    requirements:
      '• Academic background in Statistics, Data Science, Economics, or Engineering.\n• Solid command of SQL queries, relational joins, and Python (Pandas/NumPy).\n• Good communication skills and visual data storytelling abilities.',
  },
]

const EMPTY_FORM = {
  title: '',
  department: 'Software Development',
  type: 'Hybrid',
  location: '',
  duration: '3 Months',
  stipend: '₹15,000 / month',
  openings: 1,
  deadline: '',
  skills: '',
  description: '',
  responsibilities: '',
  requirements: '',
}

/**
 * HRInternships Component
 * Comprehensive management page for HR recruiters to create, view, edit, close, and delete internships.
 */
function HRInternships() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [bannerMessage, setBannerMessage] = useState('')

  // Company and HR Recruiter info
  const [hrProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRProfile')
      if (stored) return JSON.parse(stored)
    } catch (err) {
      console.error('Error reading hrProfile:', err)
    }
    return {
      hrName: 'Sarah Mitchell',
      companyName: 'NovaTech Labs Pvt Ltd',
    }
  })

  // Internships list state loaded from localStorage with demo fallback
  const [internships, setInternships] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRInternships')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.error('Error loading stored internships:', err)
    }
    return DEMO_INTERNSHIPS
  })

  // Synchronize internships to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('internhubHRInternships', JSON.stringify(internships))
    } catch (err) {
      console.error('Error saving internships to localStorage:', err)
    }
  }, [internships])

  // Modals state: null | { type: 'form' | 'view' | 'delete', data?: any }
  const [activeModal, setActiveModal] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isEditing, setIsEditing] = useState(false)
  const [editTargetId, setEditTargetId] = useState(null)

  // Handlers for creating / editing
  const handleOpenCreate = () => {
    setFormData({
      ...EMPTY_FORM,
      company: hrProfile.companyName || 'NovaTech Labs Pvt Ltd',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })
    setIsEditing(false)
    setEditTargetId(null)
    setActiveModal({ type: 'form' })
  }

  const handleOpenEdit = (item) => {
    setFormData({ ...item })
    setIsEditing(true)
    setEditTargetId(item.id)
    setActiveModal({ type: 'form', data: item })
  }

  const handleOpenView = (item) => {
    setActiveModal({ type: 'view', data: item })
  }

  const handleOpenDelete = (item) => {
    setActiveModal({ type: 'delete', data: item })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (isEditing && editTargetId) {
      setInternships((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? { ...formData, id: editTargetId }
            : item
        )
      )
      setBannerMessage('Internship updated successfully.')
    } else {
      const newInternship = {
        ...formData,
        id: `int-${Date.now()}`,
        company: hrProfile.companyName || 'NovaTech Labs Pvt Ltd',
        applications: 0,
        status: 'Active',
      }
      setInternships((prev) => [newInternship, ...prev])
      setBannerMessage('Internship published successfully.')
    }

    setActiveModal(null)
  }

  const handleCloseInternship = (id) => {
    setInternships((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Closed' } : item))
    )
    setBannerMessage('Internship closed. Students will no longer be able to submit new applications.')
  }

  const handleReopenInternship = (id) => {
    setInternships((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Active' } : item))
    )
    setBannerMessage('Internship reopened as Active.')
  }

  const handleConfirmDelete = () => {
    if (!activeModal || !activeModal.data) return
    const targetId = activeModal.data.id
    setInternships((prev) => prev.filter((item) => item.id !== targetId))
    setActiveModal(null)
    setBannerMessage('Internship deleted successfully.')
  }

  // Filtered internships
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesType =
        typeFilter === 'All' || item.type.toLowerCase() === typeFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesType
    })
  }, [internships, searchQuery, statusFilter, typeFilter])

  return (
    <div className="hr-dashboard-layout">
      {/* 1. Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content */}
      <div className="hr-main-content">
        <Topbar
          hrName={hrProfile.hrName}
          companyName={hrProfile.companyName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Internships"
        />

        <main className="hr-dashboard-container">
          {/* Header */}
          <div className="hr-internships-header">
            <div className="hr-internships-title-group">
              <h2 className="hr-internships-title">Internships</h2>
              <p className="hr-internships-subtitle">
                Create and manage internship opportunities for students.
              </p>
            </div>

            <button
              type="button"
              className="hr-btn-primary"
              onClick={handleOpenCreate}
            >
              <Plus size={18} />
              <span>+ Post New Internship</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {bannerMessage && (
            <div className="hr-internships-banner" role="status" aria-live="polite">
              <div className="hr-banner-content">
                <CheckCircle2 size={18} />
                <span>{bannerMessage}</span>
              </div>
              <button
                type="button"
                className="hr-banner-close"
                onClick={() => setBannerMessage('')}
                aria-label="Dismiss banner"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search & Filter Toolbar Card */}
          <section className="hr-internships-filter-card" aria-label="Internship Filters">
            <div className="hr-filter-controls-row">
              {/* Search Bar */}
              <div className="hr-internships-search">
                <Search size={16} className="hr-internships-search-icon" />
                <input
                  type="search"
                  className="hr-internships-search-input"
                  placeholder="Search internships by title, department, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="hr-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="hr-filter-groups-wrap">
                {/* Status Filter */}
                <div className="hr-filter-segment">
                  <span className="hr-filter-label">Status:</span>
                  <div className="hr-filter-pill-group" role="group" aria-label="Status filter">
                    {['All', 'Active', 'Closed'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`hr-filter-pill-btn ${statusFilter === st ? 'active' : ''}`}
                        onClick={() => setStatusFilter(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="hr-filter-segment">
                  <span className="hr-filter-label">Type:</span>
                  <div className="hr-filter-pill-group" role="group" aria-label="Type filter">
                    {['All', 'Remote', 'Hybrid', 'On-site'].map((tp) => (
                      <button
                        key={tp}
                        type="button"
                        className={`hr-filter-pill-btn ${typeFilter === tp ? 'active' : ''}`}
                        onClick={() => setTypeFilter(tp)}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="hr-internships-summary-row">
              <span>
                Showing <strong>{filteredInternships.length}</strong> {filteredInternships.length === 1 ? 'internship' : 'internships'}
                {searchQuery || statusFilter !== 'All' || typeFilter !== 'All' ? ' (filtered)' : ''}
              </span>
              <span>Organization: <strong>{hrProfile.companyName || 'NovaTech Labs Pvt Ltd'}</strong></span>
            </div>
          </section>

          {/* Internship Cards Grid or Empty State */}
          {filteredInternships.length > 0 ? (
            <div className="hr-internships-cards-grid">
              {filteredInternships.map((item) => (
                <div
                  key={item.id}
                  className={`hr-card ${item.status === 'Closed' ? 'card-closed' : ''}`}
                >
                  <div>
                    {/* Top Row: Department, Type & Status */}
                    <div className="hr-card-header-row">
                      <div className="hr-card-meta-top">
                        <div className="hr-card-tags-row">
                          <span className="hr-dept-tag">{item.department}</span>
                          <span className="hr-type-tag">{item.type}</span>
                        </div>
                        <h3 className="hr-card-title">{item.title}</h3>
                        <span className="hr-card-company">
                          <Building2 size={13} />
                          {item.company || hrProfile.companyName || 'NovaTech Labs Pvt Ltd'}
                        </span>
                      </div>

                      <span
                        className={`hr-status-pill ${item.status === 'Active' ? 'status-active' : 'status-closed'
                          }`}
                      >
                        {item.status === 'Active' ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            <span>Closed</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="hr-card-info-grid" style={{ marginTop: '16px' }}>
                      <div className="hr-info-stat-block">
                        <span className="hr-info-stat-label">Location</span>
                        <span className="hr-info-stat-value" title={item.location}>
                          {item.location}
                        </span>
                      </div>
                      <div className="hr-info-stat-block">
                        <span className="hr-info-stat-label">Duration</span>
                        <span className="hr-info-stat-value">{item.duration}</span>
                      </div>
                      <div className="hr-info-stat-block">
                        <span className="hr-info-stat-label">Stipend</span>
                        <span className="hr-info-stat-value">{item.stipend}</span>
                      </div>
                      <div className="hr-info-stat-block">
                        <span className="hr-info-stat-label">Openings</span>
                        <span className="hr-info-stat-value">{item.openings} Seats</span>
                      </div>
                      <div className="hr-info-stat-block">
                        <span className="hr-info-stat-label">Applications</span>
                        <span className="hr-info-stat-value">{item.applications || 0} Applied</span>
                      </div>
                      <div className="hr-info-stat-block">
                        <span className="hr-info-stat-label">Deadline</span>
                        <span className="hr-info-stat-value">{item.deadline || 'Rolling'}</span>
                      </div>
                    </div>

                    {/* Skills Chips */}
                    {item.skills && (
                      <div className="hr-card-skills-row" style={{ marginTop: '14px' }}>
                        {item.skills
                          .split(',')
                          .slice(0, 4)
                          .map((sk, idx) => (
                            <span key={idx} className="hr-card-skill-chip">
                              {sk.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="hr-card-actions-footer">
                    <div className="hr-applications-counter">
                      <Users size={15} />
                      <span>{item.applications || 0} Candidate Applications</span>
                    </div>

                    <div className="hr-actions-btn-group">
                      <button
                        type="button"
                        className="hr-btn-card-action"
                        onClick={() => handleOpenView(item)}
                        title="View Full Details"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        className="hr-btn-card-action"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Internship"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>

                      {item.status === 'Active' ? (
                        <button
                          type="button"
                          className="hr-btn-card-action"
                          onClick={() => handleCloseInternship(item.id)}
                          title="Close Internship to new applications"
                        >
                          <XCircle size={14} />
                          <span>Close</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="hr-btn-card-action"
                          onClick={() => handleReopenInternship(item.id)}
                          title="Reopen Internship"
                        >
                          <CheckCircle2 size={14} />
                          <span>Reopen</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="hr-btn-card-action hr-btn-card-danger"
                        onClick={() => handleOpenDelete(item)}
                        title="Delete Internship"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="hr-internships-empty-state">
              <div className="hr-empty-icon-box" aria-hidden="true">
                <Briefcase size={28} />
              </div>
              <h3 className="hr-empty-title">No internships found</h3>
              <p className="hr-empty-desc">
                {searchQuery || statusFilter !== 'All' || typeFilter !== 'All'
                  ? 'No opportunities match your current filters. Try resetting search or filter options.'
                  : 'Create your first internship opportunity to start receiving applications.'}
              </p>
              <button
                type="button"
                className="hr-btn-primary"
                onClick={handleOpenCreate}
              >
                <Plus size={16} />
                <span>+ Post New Internship</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================
          MODAL 1: Post / Edit Internship Form
          ================================================================ */}
      {activeModal && activeModal.type === 'form' && (
        <div
          className="hr-modal-overlay"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="hr-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hr-modal-topbar">
              <div className="hr-modal-heading-group">
                <h3 className="hr-modal-main-title">
                  {isEditing ? 'Edit Internship' : 'Post New Internship'}
                </h3>
                <p className="hr-modal-main-subtitle">
                  {isEditing
                    ? 'Update role specifications and requirements for this listing.'
                    : 'Publish an internship opportunity to receive student applications.'}
                </p>
              </div>
              <button
                type="button"
                className="hr-modal-close-icon"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="hr-modal-scrollable-body">
              {/* Field 1: Title */}
              <div className="hr-form-group">
                <label htmlFor="title" className="hr-form-label">
                  Internship Title <span className="required-star">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="hr-form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Frontend Development Intern"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Row 2: Department & Type */}
              <div className="hr-modal-form-grid-2col">
                <div className="hr-form-group">
                  <label htmlFor="department" className="hr-form-label">
                    Department / Category <span className="required-star">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="hr-modal-select"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div className="hr-form-group">
                  <label htmlFor="type" className="hr-form-label">
                    Internship Type <span className="required-star">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="hr-modal-select"
                    value={formData.type}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Location, Duration & Stipend */}
              <div className="hr-modal-form-grid-3col">
                <div className="hr-form-group">
                  <label htmlFor="location" className="hr-form-label">
                    Location <span className="required-star">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    className="hr-form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="e.g. Bengaluru, Karnataka or Remote"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="hr-form-group">
                  <label htmlFor="duration" className="hr-form-label">
                    Duration <span className="required-star">*</span>
                  </label>
                  <input
                    id="duration"
                    type="text"
                    name="duration"
                    className="hr-form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="e.g. 3 Months"
                    value={formData.duration}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="hr-form-group">
                  <label htmlFor="stipend" className="hr-form-label">
                    Stipend <span className="required-star">*</span>
                  </label>
                  <input
                    id="stipend"
                    type="text"
                    name="stipend"
                    className="hr-form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="e.g. ₹15,000 / month or Unpaid"
                    value={formData.stipend}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Row 4: Openings & Application Deadline */}
              <div className="hr-modal-form-grid-2col">
                <div className="hr-form-group">
                  <label htmlFor="openings" className="hr-form-label">
                    Number of Openings <span className="required-star">*</span>
                  </label>
                  <input
                    id="openings"
                    type="number"
                    min="1"
                    name="openings"
                    className="hr-form-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="e.g. 5"
                    value={formData.openings}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="hr-form-group">
                  <label htmlFor="deadline" className="hr-form-label">
                    Application Deadline <span className="required-star">*</span>
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    name="deadline"
                    className="hr-form-input"
                    style={{ paddingLeft: '14px' }}
                    value={formData.deadline}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Field 5: Required Skills */}
              <div className="hr-form-group">
                <label htmlFor="skills" className="hr-form-label">
                  Required Skills <span className="required-star">*</span>
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  className="hr-form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Java, React, MySQL"
                  value={formData.skills}
                  onChange={handleFormChange}
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--hr-muted-gray, #6F686B)' }}>
                  Separate individual skills with commas.
                </span>
              </div>

              {/* Field 6: Description */}
              <div className="hr-form-group">
                <label htmlFor="description" className="hr-form-label">
                  Internship Description <span className="required-star">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="hr-modal-textarea"
                  placeholder="Provide an overview of the internship role, team background, and learning outcomes..."
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Field 7: Responsibilities */}
              <div className="hr-form-group">
                <label htmlFor="responsibilities" className="hr-form-label">
                  Responsibilities <span className="required-star">*</span>
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  className="hr-modal-textarea"
                  placeholder="List the day-to-day duties, project contributions, and expectations..."
                  value={formData.responsibilities}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Field 8: Requirements / Qualifications */}
              <div className="hr-form-group">
                <label htmlFor="requirements" className="hr-form-label">
                  Requirements / Qualifications <span className="required-star">*</span>
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  className="hr-modal-textarea"
                  placeholder="Specify academic requirements, tools knowledge, coursework, or certifications..."
                  value={formData.requirements}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="hr-modal-footer" style={{ padding: '0', marginTop: '10px' }}>
                <button
                  type="button"
                  className="hr-btn-secondary"
                  onClick={() => setActiveModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hr-btn-primary"
                >
                  <Sparkles size={16} />
                  <span>{isEditing ? 'Save Changes' : 'Publish Internship'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL 2: View Internship Details
          ================================================================ */}
      {activeModal && activeModal.type === 'view' && activeModal.data && (
        <div
          className="hr-modal-overlay"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="hr-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hr-modal-topbar">
              <div className="hr-modal-heading-group">
                <span className="hr-dept-tag" style={{ width: 'fit-content' }}>
                  {activeModal.data.department} • {activeModal.data.type}
                </span>
                <h3 className="hr-modal-main-title" style={{ marginTop: '6px' }}>
                  {activeModal.data.title}
                </h3>
                <p className="hr-modal-main-subtitle">
                  {activeModal.data.company || hrProfile.companyName || 'NovaTech Labs Pvt Ltd'}
                </p>
              </div>
              <button
                type="button"
                className="hr-modal-close-icon"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="hr-modal-scrollable-body">
              {/* Key Overview Grid */}
              <div className="hr-card-info-grid">
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Location</span>
                  <span className="hr-info-stat-value">{activeModal.data.location}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Duration</span>
                  <span className="hr-info-stat-value">{activeModal.data.duration}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Stipend</span>
                  <span className="hr-info-stat-value">{activeModal.data.stipend}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Openings</span>
                  <span className="hr-info-stat-value">{activeModal.data.openings} Seats</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Applications</span>
                  <span className="hr-info-stat-value">{activeModal.data.applications || 0} Candidates</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Status</span>
                  <span className="hr-info-stat-value" style={{ color: activeModal.data.status === 'Active' ? '#059669' : '#57534E' }}>
                    {activeModal.data.status}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hr-deep-plum, #432C45)', marginBottom: '8px' }}>
                  Required Skills
                </h4>
                <div className="hr-card-skills-row">
                  {activeModal.data.skills?.split(',').map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--hr-soft-lavender, #F0EAF0)',
                        color: 'var(--hr-primary-plum, #67405F)',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hr-deep-plum, #432C45)', marginBottom: '8px' }}>
                  Internship Description
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--hr-charcoal, #252326)', lineHeight: '1.6', margin: 0 }}>
                  {activeModal.data.description}
                </p>
              </div>

              {/* Responsibilities */}
              {activeModal.data.responsibilities && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hr-deep-plum, #432C45)', marginBottom: '8px' }}>
                    Key Responsibilities
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--hr-charcoal, #252326)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                    {activeModal.data.responsibilities}
                  </p>
                </div>
              )}

              {/* Requirements */}
              {activeModal.data.requirements && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hr-deep-plum, #432C45)', marginBottom: '8px' }}>
                    Requirements / Qualifications
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--hr-charcoal, #252326)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                    {activeModal.data.requirements}
                  </p>
                </div>
              )}
            </div>

            <div className="hr-modal-footer">
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
                onClick={() => handleOpenEdit(activeModal.data)}
              >
                <Edit3 size={15} />
                <span>Edit Internship</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL 3: Delete Confirmation
          ================================================================ */}
      {activeModal && activeModal.type === 'delete' && activeModal.data && (
        <div
          className="hr-modal-overlay"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="hr-modal-container hr-modal-container-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hr-modal-topbar">
              <h3 className="hr-modal-main-title">Delete Internship</h3>
              <button
                type="button"
                className="hr-modal-close-icon"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="hr-modal-scrollable-body">
              <div className="hr-delete-warning-box">
                <AlertTriangle size={24} className="hr-delete-warning-icon" />
                <div className="hr-delete-warning-text">
                  <h4>Are you sure you want to delete this internship?</h4>
                  <p>
                    <strong>{activeModal.data.title}</strong> will be permanently removed from your active recruitment postings. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="hr-modal-footer">
              <button
                type="button"
                className="hr-btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="hr-btn-danger-solid"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={15} />
                <span>Delete Internship</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HRInternships
