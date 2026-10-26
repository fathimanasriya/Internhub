import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  Clock,
  Calendar,
  Banknote,
  Users,
  CheckCircle2,
  X,
  RotateCcw,
  ArrowRight,
  GraduationCap,
  Info,
  Briefcase,
  Sparkles,
  Database,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'
import { sampleInternships } from '../../data/internshipsData'
import { getInternships, API_BASE_URL } from '../../services/api'

// Filter options as required
const CATEGORIES = [
  'All Categories',
  'Software Development',
  'Web Development',
  'Data Science',
  'AI & Machine Learning',
  'Cybersecurity',
  'UI/UX Design',
  'Marketing',
  'Finance',
]

const LOCATIONS = [
  'All Locations',
  'Remote',
  'Kochi',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Mumbai',
]

const STIPENDS = [
  'Any Stipend',
  'Unpaid',
  '₹5,000+',
  '₹10,000+',
  '₹20,000+',
]

const DURATIONS = [
  'Any Duration',
  '1 Month',
  '2 Months',
  '3 Months',
  '6 Months',
]

/**
 * Format a backend ISO date (YYYY-MM-DD) into a friendly presentation string.
 */
function formatDeadline(dateString) {
  if (!dateString) return 'Flexible'
  try {
    const parts = dateString.split('-')
    if (parts.length === 3) {
      const year = parts[0]
      const monthIndex = parseInt(parts[1], 10) - 1
      const day = parts[2]
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ]
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${monthNames[monthIndex]} ${year}`
      }
    }
    return dateString
  } catch {
    return dateString
  }
}

/**
 * Map a backend Internship entity into the frontend card/modal display model.
 */
function mapBackendInternship(backendItem) {
  const company = backendItem.companyName || 'Unknown Company'
  const title = backendItem.role || 'Internship'
  const location = backendItem.location || 'Remote'
  const description = backendItem.description || ''
  const eligibility = backendItem.eligibility || 'Open to all students'
  const deadline = formatDeadline(backendItem.applicationDeadline)

  return {
    id: backendItem.id, // Real numeric backend ID
    title,
    company,
    companyInitial: company.charAt(0).toUpperCase() || 'I',
    category: 'Software Development',
    location,
    duration: '3 Months',
    stipend: 0,
    stipendText: 'Competitive / Performance Stipend',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
    postedDate: 'Recently',
    deadline,
    rawDeadline: backendItem.applicationDeadline,
    vacancies: 3,
    description,
    responsibilities: [
      'Contribute to production-ready software features and collaborate with engineering teams.',
      'Participate in code reviews, daily stand-ups, and architectural discussions.',
      'Write clean, documented, and testable code adhering to platform guidelines.',
    ],
    eligibility,
    isLiveBackend: true,
  }
}

/**
 * StudentInternships Component
 * Explore and filter verified internship listings with search, multifaceted filters,
 * detailed modal preview, and apply redirection.
 * Route: /student/internships
 */
function StudentInternships() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Remote API State
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState('loading') // 'backend' | 'mock' | 'loading'
  const [apiError, setApiError] = useState(null)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [stipendFilter, setStipendFilter] = useState('Any Stipend')
  const [durationFilter, setDurationFilter] = useState('Any Duration')

  // Selected Internship for Details Modal
  const [selectedInternship, setSelectedInternship] = useState(null)

  // Dynamic student identity from localStorage or fallback
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

  const initials =
    studentName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST'

  // Fetch internships from the Spring Boot backend
  const fetchInternships = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const data = await getInternships()
      if (Array.isArray(data)) {
        const mapped = data.map(mapBackendInternship)
        setInternships(mapped)
        setDataSource('backend')
      } else {
        throw new Error('Unexpected response format from backend')
      }
    } catch (err) {
      console.warn('Backend API unavailable. Falling back to local mock data:', err)
      setApiError(err.message || 'Could not connect to backend.')
      // Use existing mock data only as an explicitly identified development fallback
      setInternships(sampleInternships)
      setDataSource('mock')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  // Clear all filters handler
  const handleClearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('All Categories')
    setLocationFilter('All Locations')
    setStipendFilter('Any Stipend')
    setDurationFilter('Any Duration')
  }

  // Check if any filter is actively applied
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'All Categories' ||
    locationFilter !== 'All Locations' ||
    stipendFilter !== 'Any Stipend' ||
    durationFilter !== 'Any Duration'

  // Filtered internships computation
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      // 1. Search Query Filter (Title, Company, Skills, Category)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const matchesTitle = (item.title || '').toLowerCase().includes(query)
        const matchesCompany = (item.company || '').toLowerCase().includes(query)
        const matchesCategory = (item.category || '').toLowerCase().includes(query)
        const matchesSkills = Array.isArray(item.skills)
          ? item.skills.some((skill) => skill.toLowerCase().includes(query))
          : false
        if (!matchesTitle && !matchesCompany && !matchesCategory && !matchesSkills) {
          return false
        }
      }

      // 2. Category Filter
      if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
        return false
      }

      // 3. Location Filter (Handles composite locations like 'Bengaluru / Remote')
      if (locationFilter !== 'All Locations') {
        const locLower = (item.location || '').toLowerCase()
        const filterLower = locationFilter.toLowerCase()
        if (!locLower.includes(filterLower)) {
          return false
        }
      }

      // 4. Stipend Filter
      if (stipendFilter !== 'Any Stipend') {
        const stipendText = (item.stipendText || '').toLowerCase()
        if (stipendFilter === 'Unpaid') {
          if (item.stipend !== 0 && !stipendText.includes('unpaid')) {
            return false
          }
        } else if (stipendFilter === '₹5,000+') {
          if (item.stipend < 5000) return false
        } else if (stipendFilter === '₹10,000+') {
          if (item.stipend < 10000) return false
        } else if (stipendFilter === '₹20,000+') {
          if (item.stipend < 20000) return false
        }
      }

      // 5. Duration Filter
      if (durationFilter !== 'Any Duration') {
        const durationText = (item.duration || '').toLowerCase()
        if (!durationText.includes(durationFilter.toLowerCase())) {
          return false
        }
      }

      return true
    })
  }, [internships, searchQuery, categoryFilter, locationFilter, stipendFilter, durationFilter])

  // Apply Now handler: Navigates to Application Form with selected internship ID
  const handleApplyNow = (internship) => {
    navigate(`/student/apply/${internship.id}`)
  }

  return (
    <div className="student-dashboard-layout">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Page Area */}
      <div className="dashboard-main-content">
        <Topbar
          studentName={studentName}
          initials={initials}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Find Internships"
        />

        <main className="dashboard-container">
          {/* ================================================================
              Page Header
              ================================================================ */}
          <div className="internships-page-header">
            <h1 className="internships-page-title">Find Internships</h1>
            <p className="internships-page-subtitle">
              Discover opportunities that match your skills, interests, and career goals.
            </p>
          </div>

          {/* ================================================================
              Data Source & Connectivity Status Banner
              ================================================================ */}
          {loading ? (
            <div
              className="internships-demo-banner"
              role="status"
              style={{
                backgroundColor: 'var(--soft-lavender)',
                borderColor: 'var(--primary-plum)',
              }}
            >
              <Loader2 size={18} className="demo-icon" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Connecting to Spring Boot backend at <code>{API_BASE_URL}/internships</code>...</span>
            </div>
          ) : dataSource === 'backend' ? (
            <div
              className="internships-demo-banner"
              role="status"
              style={{
                backgroundColor: '#EBF7EE',
                borderColor: '#48A868',
                color: '#1D6335',
              }}
            >
              <Database size={18} style={{ color: '#2B8349', flexShrink: 0 }} />
              <span>
                <strong>Live Backend Connected:</strong> Displaying {internships.length} real internship opportunity {internships.length === 1 ? '' : 'records'} served directly from the Spring Boot MySQL database (<code>GET /api/internships</code>).
              </span>
            </div>
          ) : (
            <div
              className="internships-demo-banner"
              role="note"
              style={{
                backgroundColor: '#FFF7E6',
                borderColor: '#FFB800',
                color: '#8A5800',
              }}
            >
              <AlertCircle size={18} style={{ color: '#D97706', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                <span>
                  <strong>Development Fallback Active:</strong> Unable to connect to backend (<code>{API_BASE_URL}</code>). Currently displaying local sample internships.
                </span>
                <span style={{ fontSize: '12px', opacity: 0.85 }}>
                  {apiError} — Start the backend with <code>mvn spring-boot:run</code> to view live MySQL listings.
                </span>
              </div>
              <button
                type="button"
                onClick={fetchInternships}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px', marginLeft: 'auto' }}
                title="Retry connection to backend"
              >
                Retry
              </button>
            </div>
          )}

          {/* ================================================================
              1 & 2. Search & Filters Card
              ================================================================ */}
          <section className="internships-search-card" aria-label="Search and Filter Internships">
            {/* Search Bar */}
            <div className="internships-search-bar">
              <span className="internships-search-icon">
                <Search size={20} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search internships by title, skill, or company..."
                className="internships-search-input"
                aria-label="Search internships"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="internships-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search text"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="internships-filters-grid">
              {/* Category Filter */}
              <div className="internship-filter-item">
                <label htmlFor="filter-category" className="internship-filter-label">
                  Category
                </label>
                <select
                  id="filter-category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="internship-filter-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="internship-filter-item">
                <label htmlFor="filter-location" className="internship-filter-label">
                  Location
                </label>
                <select
                  id="filter-location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="internship-filter-select"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stipend Filter */}
              <div className="internship-filter-item">
                <label htmlFor="filter-stipend" className="internship-filter-label">
                  Stipend
                </label>
                <select
                  id="filter-stipend"
                  value={stipendFilter}
                  onChange={(e) => setStipendFilter(e.target.value)}
                  className="internship-filter-select"
                >
                  {STIPENDS.map((stip) => (
                    <option key={stip} value={stip}>
                      {stip}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Filter */}
              <div className="internship-filter-item">
                <label htmlFor="filter-duration" className="internship-filter-label">
                  Duration
                </label>
                <select
                  id="filter-duration"
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="internship-filter-select"
                >
                  {DURATIONS.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-secondary internship-clear-btn"
                  onClick={handleClearFilters}
                  title="Reset all search filters"
                >
                  <RotateCcw size={14} />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </section>

          {/* ================================================================
              3. Results Header with Dynamic Count
              ================================================================ */}
          <div className="internships-results-header">
            <div className="internships-results-title-group">
              <h2 className="internships-results-title">Available Internships</h2>
              <span className="internships-count-badge">
                {filteredInternships.length}{' '}
                {filteredInternships.length === 1 ? 'internship found' : 'internships found'}
              </span>
            </div>

            {hasActiveFilters && (
              <span style={{ fontSize: '13px', color: 'var(--muted-gray)' }}>
                Showing filtered results based on your criteria
              </span>
            )}
          </div>

          {/* ================================================================
              4. Internship Cards Grid
              ================================================================ */}
          {filteredInternships.length > 0 ? (
            <div className="internships-explore-grid">
              {filteredInternships.map((internship) => (
                <article
                  key={internship.id}
                  className="internship-explore-card"
                  aria-labelledby={`internship-title-${internship.id}`}
                >
                  {/* Card Top: Avatar, Company, Title & Category */}
                  <div className="internship-card-top">
                    <div className="internship-card-identity">
                      <div className="company-avatar-box" aria-hidden="true">
                        {internship.companyInitial || (internship.company ? internship.company.charAt(0) : 'I')}
                      </div>
                      <div className="internship-title-group">
                        <span className="internship-card-company">{internship.company}</span>
                        <h3
                          id={`internship-title-${internship.id}`}
                          className="internship-card-title"
                        >
                          {internship.title}
                        </h3>
                      </div>
                    </div>

                    <span className="internship-category-badge">{internship.category}</span>
                  </div>

                  {/* Primary Metadata Row (Location, Duration, Stipend) */}
                  <div className="internship-meta-grid">
                    <div className="internship-meta-cell">
                      <MapPin size={14} className="internship-meta-icon" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="internship-meta-cell">
                      <Clock size={14} className="internship-meta-icon" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="internship-meta-cell">
                      <Banknote size={14} className="internship-meta-icon" />
                      <span className="stipend-text">{internship.stipendText}</span>
                    </div>
                  </div>

                  {/* Secondary Metadata: Vacancies, Posted Date, Deadline */}
                  <div className="internship-submeta-row">
                    <span className="internship-submeta-item">
                      <Users size={13} className="internship-meta-icon" />
                      <span>
                        <strong>{internship.vacancies}</strong> Vacancies
                      </span>
                    </span>
                    <span className="internship-submeta-item">
                      <Clock size={13} className="internship-meta-icon" />
                      <span>Posted {internship.postedDate}</span>
                    </span>
                    <span className="internship-submeta-item">
                      <Calendar size={13} className="internship-meta-icon" />
                      <span>
                        Deadline: <strong>{internship.deadline}</strong>
                      </span>
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="internship-description">{internship.description}</p>

                  {/* Skills Tags */}
                  <div className="skills-tags-container">
                    {Array.isArray(internship.skills) &&
                      internship.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="internship-card-action-bar">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedInternship(internship)}
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleApplyNow(internship)}
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* ================================================================
               8. Empty State
               ================================================================ */
            <div className="dashboard-card">
              <div className="empty-state-container">
                <div className="empty-state-icon">
                  <Search size={36} />
                </div>
                <h3 className="empty-state-title">No internships found</h3>
                <p className="empty-state-text">
                  Try changing your search or filters to find more opportunities.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleClearFilters}
                  style={{ marginTop: '8px' }}
                >
                  <RotateCcw size={15} />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================
          6. Internship Details Modal
          ================================================================ */}
      {selectedInternship && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedInternship(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-internship-title"
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="modal-company">{selectedInternship.company}</span>
                  <span className="internship-category-badge">
                    {selectedInternship.category}
                  </span>
                </div>
                <h2 id="modal-internship-title" className="modal-role">
                  {selectedInternship.title}
                </h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedInternship(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div
              className="modal-details-grid"
              style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
            >
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
                <span className="modal-grid-val">{selectedInternship.stipendText}</span>
              </div>
              <div className="modal-grid-item">
                <span className="modal-grid-label">Vacancies</span>
                <span className="modal-grid-val">
                  {selectedInternship.vacancies} Openings
                </span>
              </div>
              <div className="modal-grid-item">
                <span className="modal-grid-label">Posted</span>
                <span className="modal-grid-val">{selectedInternship.postedDate}</span>
              </div>
              <div className="modal-grid-item">
                <span className="modal-grid-label">Deadline</span>
                <span className="modal-grid-val">{selectedInternship.deadline}</span>
              </div>
            </div>

            {/* Modal Body: Description */}
            <div className="modal-body">
              <h4 className="modal-section-title">About the Opportunity</h4>
              <p style={{ marginTop: '6px' }}>{selectedInternship.description}</p>
            </div>

            {/* Responsibilities */}
            {selectedInternship.responsibilities && (
              <div>
                <h4 className="modal-section-title">Key Responsibilities</h4>
                <ul className="modal-responsibilities-list">
                  {selectedInternship.responsibilities.map((resp, idx) => (
                    <li key={idx} className="modal-responsibility-item">
                      <CheckCircle2 size={16} className="modal-responsibility-icon" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            <div className="modal-skills-section">
              <h4 className="modal-section-title">Required Competencies</h4>
              <div className="skills-tags-container">
                {Array.isArray(selectedInternship.skills) &&
                  selectedInternship.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* Eligibility Box */}
            <div className="modal-eligibility-box">
              <GraduationCap size={20} style={{ color: 'var(--primary-plum)' }} />
              <div>
                <strong>Eligibility:</strong> {selectedInternship.eligibility}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedInternship(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleApplyNow(selectedInternship)}
              >
                <span>Apply Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentInternships
