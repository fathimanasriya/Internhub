import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users,
    UserCheck,
    CheckCircle2,
    Clock,
    Search,
    Plus,
    Calendar,
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    FileText,
    X,
    TrendingUp,
    ArrowRight,
    ShieldCheck,
    Building2,
    AlertTriangle,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import './HRInterns.css'

// Initial demo interns reflecting students selected through the application pipeline
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
 * HRInterns Component
 * Displays and manages active and completed student interns who have been selected by HR.
 */
function HRInterns() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

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

    // Synchronize with localStorage
    useEffect(() => {
        try {
            localStorage.setItem('internhubHRInterns', JSON.stringify(interns))
        } catch (err) {
            console.error('Error saving internhubHRInterns:', err)
        }
    }, [interns])

    // Filters & Search
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [internshipFilter, setInternshipFilter] = useState('All Internships')

    // Modals & Banners
    const [selectedIntern, setSelectedIntern] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [bannerMessage, setBannerMessage] = useState(null)

    // Add Intern Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        degree: '',
        graduationYear: '2027',
        internship: 'Frontend Development Intern',
        department: 'Software Development',
        type: 'Hybrid',
        location: 'Bengaluru, Karnataka',
        startDate: '',
        endDate: '',
        supervisor: 'Sarah Mitchell',
    })

    // Computed summary metrics
    const stats = useMemo(() => {
        return {
            total: interns.length,
            active: interns.filter((i) => i.status === 'Active').length,
            endingSoon: interns.filter((i) => i.status === 'Ending Soon').length,
            completed: interns.filter((i) => i.status === 'Completed').length,
        }
    }, [interns])

    // Available unique internship titles for filter dropdown
    const uniqueInternshipTitles = useMemo(() => {
        const titles = new Set(interns.map((i) => i.internship))
        return ['All Internships', ...Array.from(titles)]
    }, [interns])

    // Filtered interns list
    const filteredInterns = useMemo(() => {
        return interns.filter((intern) => {
            const q = search.trim().toLowerCase()
            const matchesSearch =
                !q ||
                intern.name.toLowerCase().includes(q) ||
                intern.email.toLowerCase().includes(q) ||
                intern.college.toLowerCase().includes(q) ||
                intern.internship.toLowerCase().includes(q)

            const matchesStatus =
                statusFilter === 'All' || intern.status === statusFilter

            const matchesInternship =
                internshipFilter === 'All Internships' ||
                intern.internship === internshipFilter

            return matchesSearch && matchesStatus && matchesInternship
        })
    }, [interns, search, statusFilter, internshipFilter])

    // Handle Form Change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle Adding New Intern
    const handleAddIntern = (e) => {
        e.preventDefault()

        const newIntern = {
            id: Date.now(),
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || '+91 98765 00000',
            college: formData.college.trim(),
            degree: formData.degree.trim(),
            graduationYear: formData.graduationYear || '2027',
            internship: formData.internship,
            department: formData.department,
            type: formData.type,
            location: formData.location || 'Remote',
            startDate: formData.startDate,
            endDate: formData.endDate,
            progress: 0,
            status: 'Active',
            supervisor: formData.supervisor.trim() || hrProfile.hrName,
            mentorEmail: hrProfile.companyName ? `hr@technovalabs.com` : 'hr@example.com',
        }

        setInterns((prev) => [newIntern, ...prev])

        setFormData({
            name: '',
            email: '',
            phone: '',
            college: '',
            degree: '',
            graduationYear: '2027',
            internship: 'Frontend Development Intern',
            department: 'Software Development',
            type: 'Hybrid',
            location: 'Bengaluru, Karnataka',
            startDate: '',
            endDate: '',
            supervisor: hrProfile.hrName,
        })

        setShowAddForm(false)
        setBannerMessage(`Intern ${newIntern.name} onboarded successfully!`)
    }

    // Format date helper
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not specified'
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return dateStr
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
        } catch {
            return dateStr
        }
    }

    // Helper for initials
    const getInitials = (name) => {
        if (!name) return 'IN'
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    // Reset filters
    const handleResetFilters = () => {
        setSearch('')
        setStatusFilter('All')
        setInternshipFilter('All Internships')
    }

    const hasActiveFilters = search || statusFilter !== 'All' || internshipFilter !== 'All Internships'

    return (
        <div className="hr-dashboard-layout">
            {/* 1. Sidebar Navigation */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* 2. Main Content Area */}
            <div className="hr-main-content">
                {/* Topbar */}
                <Topbar
                    hrName={hrProfile.hrName}
                    initials={hrProfile.initials}
                    companyName={hrProfile.companyName}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    title="Interns"
                    onSearch={(query) => setSearch(query)}
                />

                {/* Dashboard Body Container */}
                <main className="hr-dashboard-container">
                    {/* Page Header */}
                    <div className="hr-interns-header">
                        <div className="hr-interns-title-group">
                            <h1 className="hr-interns-title">Interns</h1>
                            <p className="hr-interns-subtitle">
                                Manage and monitor students currently completing their internships at {hrProfile.companyName}.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="hr-interns-add-btn"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus size={16} />
                            <span>Add Intern</span>
                        </button>
                    </div>

                    {/* Feedback Banner */}
                    {bannerMessage && (
                        <div className="hr-interns-banner" role="status" aria-live="polite">
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

                    {/* 1. Summary Statistics (4 Cards) */}
                    <section className="hr-interns-stats-grid" aria-label="Intern Statistics">
                        {/* Total Interns */}
                        <div className="hr-interns-stat-card">
                            <div className="hr-interns-stat-header">
                                <span className="hr-interns-stat-label">Total Interns</span>
                                <div className="hr-interns-stat-icon-box" aria-hidden="true">
                                    <Users size={18} />
                                </div>
                            </div>
                            <div className="hr-interns-stat-value">{stats.total}</div>
                            <span className="hr-interns-stat-subtext">All registered interns</span>
                        </div>

                        {/* Active Interns */}
                        <div className="hr-interns-stat-card">
                            <div className="hr-interns-stat-header">
                                <span className="hr-interns-stat-label">Active Interns</span>
                                <div className="hr-interns-stat-icon-box hr-stat-icon-active" aria-hidden="true">
                                    <UserCheck size={18} />
                                </div>
                            </div>
                            <div className="hr-interns-stat-value">{stats.active}</div>
                            <span className="hr-interns-stat-subtext">Currently working</span>
                        </div>

                        {/* Ending Soon */}
                        <div className="hr-interns-stat-card">
                            <div className="hr-interns-stat-header">
                                <span className="hr-interns-stat-label">Ending Soon</span>
                                <div className="hr-interns-stat-icon-box hr-stat-icon-ending" aria-hidden="true">
                                    <Clock size={18} />
                                </div>
                            </div>
                            <div className="hr-interns-stat-value">{stats.endingSoon}</div>
                            <span className="hr-interns-stat-subtext">Within next 30 days</span>
                        </div>

                        {/* Completed */}
                        <div className="hr-interns-stat-card">
                            <div className="hr-interns-stat-header">
                                <span className="hr-interns-stat-label">Completed</span>
                                <div className="hr-interns-stat-icon-box hr-stat-icon-completed" aria-hidden="true">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <div className="hr-interns-stat-value">{stats.completed}</div>
                            <span className="hr-interns-stat-subtext">Successfully graduated</span>
                        </div>
                    </section>

                    {/* 2. Filter & Search Controls */}
                    <section className="hr-interns-filter-card" aria-label="Intern Filters">
                        <div className="hr-interns-filter-row">
                            {/* Search Bar */}
                            <div className="hr-interns-search-wrap">
                                <Search size={16} className="hr-interns-search-icon" aria-hidden="true" />
                                <input
                                    type="text"
                                    className="hr-interns-search-input"
                                    placeholder="Search by student name, college, email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search interns"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        className="hr-interns-search-clear"
                                        onClick={() => setSearch('')}
                                        aria-label="Clear search"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="hr-interns-filter-controls">
                                {/* Internship Dropdown */}
                                <select
                                    className="hr-interns-select-control"
                                    value={internshipFilter}
                                    onChange={(e) => setInternshipFilter(e.target.value)}
                                    aria-label="Filter by internship role"
                                >
                                    {uniqueInternshipTitles.map((title) => (
                                        <option key={title} value={title}>
                                            {title}
                                        </option>
                                    ))}
                                </select>

                                {/* Status Pills */}
                                <div className="hr-interns-status-pills" role="tablist" aria-label="Status filter">
                                    {['All', 'Active', 'Ending Soon', 'Completed'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            role="tab"
                                            aria-selected={statusFilter === status}
                                            className={`hr-interns-status-btn ${statusFilter === status ? 'active' : ''}`}
                                            onClick={() => setStatusFilter(status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="hr-interns-toolbar-meta">
                            <span>
                                Showing <strong>{filteredInterns.length}</strong> of {interns.length} interns
                            </span>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="hr-interns-clear-filters-btn"
                                    onClick={handleResetFilters}
                                >
                                    Reset all filters
                                </button>
                            )}
                        </div>
                    </section>

                    {/* 3. Interns Grid */}
                    {filteredInterns.length > 0 ? (
                        <section className="hr-interns-cards-grid" aria-label="Interns List">
                            {filteredInterns.map((intern) => {
                                const isEndingSoon = intern.status === 'Ending Soon'
                                const isCompleted = intern.status === 'Completed'

                                return (
                                    <article
                                        key={intern.id}
                                        className={`hr-intern-card ${isEndingSoon
                                                ? 'card-ending-soon'
                                                : isCompleted
                                                    ? 'card-completed'
                                                    : ''
                                            }`}
                                    >
                                        {/* Header */}
                                        <div className="hr-intern-card-header">
                                            <div className="hr-intern-lead">
                                                <div className="hr-intern-avatar" aria-hidden="true">
                                                    {getInitials(intern.name)}
                                                </div>
                                                <div className="hr-intern-headings">
                                                    <h2 className="hr-intern-name">{intern.name}</h2>
                                                    <span className="hr-intern-college">
                                                        <GraduationCap size={14} />
                                                        <span>{intern.college}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`hr-intern-status-badge ${intern.status === 'Active'
                                                        ? 'badge-active'
                                                        : isEndingSoon
                                                            ? 'badge-ending-soon'
                                                            : 'badge-completed'
                                                    }`}
                                            >
                                                {intern.status === 'Active' && <UserCheck size={12} />}
                                                {isEndingSoon && <Clock size={12} />}
                                                {isCompleted && <CheckCircle2 size={12} />}
                                                <span>{intern.status}</span>
                                            </span>
                                        </div>

                                        {/* Metadata Grid */}
                                        <div className="hr-intern-meta-grid">
                                            <div className="hr-intern-meta-item">
                                                <span className="hr-intern-meta-label">Internship</span>
                                                <span className="hr-intern-meta-value" title={intern.internship}>
                                                    {intern.internship}
                                                </span>
                                            </div>

                                            <div className="hr-intern-meta-item">
                                                <span className="hr-intern-meta-label">Department</span>
                                                <span className="hr-intern-meta-value" title={intern.department}>
                                                    {intern.department}
                                                </span>
                                            </div>

                                            <div className="hr-intern-meta-item">
                                                <span className="hr-intern-meta-label">Workplace Mode</span>
                                                <span className="hr-intern-meta-value">
                                                    {intern.type} • {intern.location}
                                                </span>
                                            </div>

                                            <div className="hr-intern-meta-item">
                                                <span className="hr-intern-meta-label">Duration</span>
                                                <span className="hr-intern-meta-value">
                                                    {formatDate(intern.startDate)} – {formatDate(intern.endDate)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="hr-progress-track-wrap">
                                            <div className="hr-progress-label-row">
                                                <span className="hr-progress-label">Milestone Progress</span>
                                                <span className="hr-progress-percentage">{intern.progress}%</span>
                                            </div>
                                            <div
                                                className="hr-progress-bar-bg"
                                                role="progressbar"
                                                aria-valuenow={intern.progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                aria-label={`Internship progress for ${intern.name}`}
                                            >
                                                <div
                                                    className={`hr-progress-bar-fill ${isCompleted
                                                            ? 'fill-completed'
                                                            : isEndingSoon
                                                                ? 'fill-ending-soon'
                                                                : ''
                                                        }`}
                                                    style={{ width: `${intern.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="hr-intern-actions-row">
                                            <button
                                                type="button"
                                                className="hr-btn-details"
                                                onClick={() => setSelectedIntern(intern)}
                                            >
                                                View Details
                                            </button>

                                            <button
                                                type="button"
                                                className="hr-btn-track-progress"
                                                onClick={() => navigate(`/hr/progress?internId=${intern.id}`)}
                                            >
                                                <span>Track Progress</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </article>
                                )
                            })}
                        </section>
                    ) : (
                        <div className="hr-interns-empty-state">
                            <div className="hr-interns-empty-icon" aria-hidden="true">
                                <Users size={28} />
                            </div>
                            <h3 className="hr-interns-empty-title">No interns found</h3>
                            <p className="hr-interns-empty-text">
                                We couldn&apos;t find any interns matching your filter criteria. Try clearing search keywords or changing status tabs.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="hr-interns-add-btn"
                                    onClick={handleResetFilters}
                                    style={{ marginTop: '8px' }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* ======================================================================
          Add Intern Modal
          ====================================================================== */}
            {showAddForm && (
                <div
                    className="hr-modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-intern-title"
                >
                    <div className="hr-modal">
                        <div className="hr-modal-header">
                            <div>
                                <h2 id="add-intern-title" className="hr-modal-title">
                                    Add Selected Intern
                                </h2>
                                <p className="hr-modal-subtitle">
                                    Onboard a candidate who was selected from the application pipeline.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="hr-modal-close"
                                onClick={() => setShowAddForm(false)}
                                aria-label="Close dialog"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddIntern}>
                            <div className="hr-modal-body">
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label htmlFor="form-name">Student Full Name *</label>
                                        <input
                                            id="form-name"
                                            name="name"
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-email">Student Email *</label>
                                        <input
                                            id="form-email"
                                            type="email"
                                            name="email"
                                            placeholder="e.g. student@college.edu"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-phone">Contact Phone</label>
                                        <input
                                            id="form-phone"
                                            name="phone"
                                            placeholder="e.g. +91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-college">College / University *</label>
                                        <input
                                            id="form-college"
                                            name="college"
                                            placeholder="e.g. IIT Bombay"
                                            value={formData.college}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-degree">Degree & Specialization *</label>
                                        <input
                                            id="form-degree"
                                            name="degree"
                                            placeholder="e.g. B.Tech Computer Science"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-gradYear">Graduation Year</label>
                                        <select
                                            id="form-gradYear"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleChange}
                                        >
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label htmlFor="form-internship">Internship Role *</label>
                                        <select
                                            id="form-internship"
                                            name="internship"
                                            value={formData.internship}
                                            onChange={handleChange}
                                        >
                                            <option value="Frontend Development Intern">Frontend Development Intern</option>
                                            <option value="UI/UX Design Intern">UI/UX Design Intern</option>
                                            <option value="Data Analytics Intern">Data Analytics Intern</option>
                                            <option value="Cloud & DevOps Intern">Cloud & DevOps Intern</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-type">Workplace Type</label>
                                        <select
                                            id="form-type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Remote">Remote</option>
                                            <option value="On-site">On-site</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-location">Location</label>
                                        <input
                                            id="form-location"
                                            name="location"
                                            placeholder="e.g. Bengaluru, Karnataka"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-startDate">Start Date *</label>
                                        <input
                                            id="form-startDate"
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-endDate">End Date *</label>
                                        <input
                                            id="form-endDate"
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label htmlFor="form-supervisor">Assigned HR Supervisor</label>
                                        <input
                                            id="form-supervisor"
                                            name="supervisor"
                                            value={formData.supervisor}
                                            onChange={handleChange}
                                            placeholder="Supervisor name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="hr-modal-actions">
                                <button
                                    type="button"
                                    className="hr-btn-secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="hr-btn-primary">
                                    Onboard Intern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================================
          Intern Details Modal
          ====================================================================== */}
            {selectedIntern && (
                <div
                    className="hr-modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="intern-detail-title"
                >
                    <div className="hr-modal">
                        <div className="hr-modal-header">
                            <div>
                                <h2 id="intern-detail-title" className="hr-modal-title">
                                    {selectedIntern.name}
                                </h2>
                                <p className="hr-modal-subtitle">
                                    {selectedIntern.internship} • {selectedIntern.department}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="hr-modal-close"
                                onClick={() => setSelectedIntern(null)}
                                aria-label="Close dialog"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="hr-modal-body">
                            {/* Student Information */}
                            <div className="intern-details-section">
                                <h3 className="intern-details-heading">Candidate Information</h3>
                                <div className="intern-details-grid">
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Email Address</span>
                                        <span className="intern-detail-cell-val">{selectedIntern.email}</span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Contact Number</span>
                                        <span className="intern-detail-cell-val">{selectedIntern.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">College / University</span>
                                        <span className="intern-detail-cell-val">{selectedIntern.college}</span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Degree & Year</span>
                                        <span className="intern-detail-cell-val">
                                            {selectedIntern.degree} (Batch of {selectedIntern.graduationYear})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Internship Program Scope */}
                            <div className="intern-details-section">
                                <h3 className="intern-details-heading">Internship Program Details</h3>
                                <div className="intern-details-grid">
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Work Mode</span>
                                        <span className="intern-detail-cell-val">
                                            {selectedIntern.type} ({selectedIntern.location})
                                        </span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Supervisor / Mentor</span>
                                        <span className="intern-detail-cell-val">{selectedIntern.supervisor}</span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Tenure Start</span>
                                        <span className="intern-detail-cell-val">{formatDate(selectedIntern.startDate)}</span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Tenure End</span>
                                        <span className="intern-detail-cell-val">{formatDate(selectedIntern.endDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress & Milestone */}
                            <div className="intern-details-section">
                                <h3 className="intern-details-heading">Internship Status & Progress</h3>
                                <div className="intern-details-grid">
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Current Status</span>
                                        <span className="intern-detail-cell-val">{selectedIntern.status}</span>
                                    </div>
                                    <div className="intern-detail-cell">
                                        <span className="intern-detail-cell-label">Overall Completion</span>
                                        <span className="intern-detail-cell-val">{selectedIntern.progress}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verified Documents */}
                            <div className="intern-details-section">
                                <h3 className="intern-details-heading">Onboarding Documents</h3>
                                <div className="intern-docs-list">
                                    <div className="intern-doc-item">
                                        <div className="intern-doc-left">
                                            <FileText size={16} color="#67405F" />
                                            <span>Candidate_Resume.pdf</span>
                                        </div>
                                        <span className="intern-doc-badge">Verified</span>
                                    </div>
                                    <div className="intern-doc-item">
                                        <div className="intern-doc-left">
                                            <ShieldCheck size={16} color="#065F46" />
                                            <span>Internship_Offer_Letter.pdf</span>
                                        </div>
                                        <span className="intern-doc-badge">Signed</span>
                                    </div>
                                    <div className="intern-doc-item">
                                        <div className="intern-doc-left">
                                            <FileText size={16} color="#67405F" />
                                            <span>College_NOC_&_ID_Proof.pdf</span>
                                        </div>
                                        <span className="intern-doc-badge">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hr-modal-actions">
                            <button
                                type="button"
                                className="hr-btn-secondary"
                                onClick={() => setSelectedIntern(null)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="hr-btn-primary"
                                onClick={() => {
                                    const id = selectedIntern.id
                                    setSelectedIntern(null)
                                    navigate(`/hr/progress?internId=${id}`)
                                }}
                            >
                                Track Milestone Progress →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HRInterns
