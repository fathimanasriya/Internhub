import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Award,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  GraduationCap,
  Download,
  Printer,
  Eye,
  Sparkles,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  X,
  ExternalLink,
  Users,
  ChevronRight,
  Filter,
  Check,
  Briefcase,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import './HRCertificates.css'

// Initial fallback demo interns (consistent with HRInterns & HRProgress)
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
 * Format date utility
 */
function formatDate(dateStr) {
  if (!dateStr) return 'September 2026'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * Generates unique Certificate ID format: INTH-YYYY-XXXX
 */
function generateCertificateId(internId) {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `INTH-${year}-${String(internId).slice(-3).padStart(3, '0')}${randomSuffix.toString().slice(-2)}`
}

/**
 * HRCertificates Component
 * Manages certificate issuance for completed student interns.
 */
function HRCertificates() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('All') // 'All' | 'Issued' | 'Pending'
  const [bannerMessage, setBannerMessage] = useState(null)

  // Active modal state: { intern, certificate, isNew }
  const [activeCertificateModal, setActiveCertificateModal] = useState(null)

  // Certificate printing ref
  const certPrintRef = useRef(null)

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

  // Load interns from internhubHRInterns (with demo fallback)
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

  // Load certificates from internhubCertificates
  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('internhubCertificates')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch (err) {
      console.error('Error reading internhubCertificates:', err)
    }
    // Seed initial certificate for demo completed intern Olivia Martin
    const initialCert = {
      certificateId: 'INTH-2026-0041',
      internId: 4,
      applicationId: 'app-04',
      studentId: 'STU-2026-004',
      studentName: 'Olivia Martin',
      studentEmail: 'olivia@example.com',
      college: 'Delhi University',
      degree: 'B.Sc Statistics & Analytics',
      internshipId: 'da-02',
      internshipTitle: 'Data Analytics Intern',
      department: 'Data Science',
      companyName: 'TechNova Labs',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      completionDate: '30 September 2026',
      issuedDate: '1 October 2026',
      issuedBy: 'Sarah Mitchell',
      status: 'Issued by HR',
      performance: 'Outstanding Performance',
    }
    return [initialCert]
  })

  // Synchronize certificates to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('internhubCertificates', JSON.stringify(certificates))
    } catch (err) {
      console.error('Error saving internhubCertificates:', err)
    }
  }, [certificates])

  // Filter ONLY interns with status === 'Completed'
  const completedInterns = useMemo(() => {
    return interns.filter((i) => i.status === 'Completed')
  }, [interns])

  // Map certificate by internId or studentEmail
  const certMap = useMemo(() => {
    const map = new Map()
    certificates.forEach((c) => {
      if (c.internId) map.set(String(c.internId), c)
      if (c.studentEmail) map.set(c.studentEmail.toLowerCase(), c)
      if (c.studentName) map.set(c.studentName.toLowerCase().trim(), c)
    })
    return map
  }, [certificates])

  // Filtered list based on search and filter tab
  const filteredCompletedInterns = useMemo(() => {
    return completedInterns.filter((intern) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        intern.name.toLowerCase().includes(q) ||
        intern.email.toLowerCase().includes(q) ||
        intern.internship.toLowerCase().includes(q) ||
        (intern.department && intern.department.toLowerCase().includes(q))

      const hasCert =
        certMap.has(String(intern.id)) ||
        certMap.has(intern.email.toLowerCase()) ||
        certMap.has(intern.name.toLowerCase().trim())

      if (filterMode === 'Issued') return matchesSearch && hasCert
      if (filterMode === 'Pending') return matchesSearch && !hasCert
      return matchesSearch
    })
  }, [completedInterns, searchQuery, filterMode, certMap])

  // Metrics summary
  const metrics = useMemo(() => {
    const totalCompleted = completedInterns.length
    let issuedCount = 0
    completedInterns.forEach((intern) => {
      if (
        certMap.has(String(intern.id)) ||
        certMap.has(intern.email.toLowerCase()) ||
        certMap.has(intern.name.toLowerCase().trim())
      ) {
        issuedCount++
      }
    })
    const pendingCount = totalCompleted - issuedCount
    return { totalCompleted, issuedCount, pendingCount }
  }, [completedInterns, certMap])

  // Handle Opening Certificate for Viewing
  const handleViewCertificate = (intern) => {
    const existingCert =
      certMap.get(String(intern.id)) ||
      certMap.get(intern.email.toLowerCase()) ||
      certMap.get(intern.name.toLowerCase().trim())

    if (existingCert) {
      setActiveCertificateModal({
        intern,
        certificate: existingCert,
        isNew: false,
      })
    } else {
      handleOpenGenerateModal(intern)
    }
  }

  // Handle Opening Generate Modal
  const handleOpenGenerateModal = (intern) => {
    const draftCert = {
      certificateId: generateCertificateId(intern.id),
      internId: intern.id,
      applicationId: intern.applicationId || `app-${intern.id}`,
      studentId: intern.studentId || `STU-${intern.id}`,
      studentName: intern.name,
      studentEmail: intern.email,
      phone: intern.phone || '+91 98765 00000',
      college: intern.college || 'Engineering Institute',
      degree: intern.degree || 'Bachelor Degree',
      internshipId: intern.internshipId || intern.id,
      internshipTitle: intern.internship,
      department: intern.department || 'Software Development',
      type: intern.type || 'Hybrid',
      location: intern.location || 'Bengaluru, Karnataka',
      companyName: hrProfile.companyName || 'TechNova Labs',
      startDate: intern.startDate || '2026-06-01',
      endDate: intern.endDate || '2026-09-30',
      completionDate: formatDate(intern.endDate),
      issuedDate: formatDate(new Date().toISOString()),
      issuedBy: hrProfile.hrName || 'Sarah Mitchell',
      status: 'Issued by HR',
      performance: 'Outstanding Performance',
    }

    setActiveCertificateModal({
      intern,
      certificate: draftCert,
      isNew: true,
    })
  }

  // Confirm Generation & Save to localStorage
  const handleConfirmIssueCertificate = () => {
    if (!activeCertificateModal || !activeCertificateModal.certificate) return
    const certToSave = {
      ...activeCertificateModal.certificate,
      issuedDate: formatDate(new Date().toISOString()),
      status: 'Issued by HR',
    }

    // Update certificates array (replace if already exists or add new)
    setCertificates((prev) => {
      const filtered = prev.filter(
        (c) =>
          String(c.internId) !== String(certToSave.internId) &&
          c.studentEmail.toLowerCase() !== certToSave.studentEmail.toLowerCase()
      )
      return [certToSave, ...filtered]
    })

    // Also mark certificate in internhubHRInterns if present
    setInterns((prev) => {
      const updated = prev.map((item) => {
        if (String(item.id) === String(certToSave.internId)) {
          return {
            ...item,
            certificateIssued: true,
            certificateId: certToSave.certificateId,
          }
        }
        return item
      })
      try {
        localStorage.setItem('internhubHRInterns', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving updated interns:', err)
      }
      return updated
    })

    setBannerMessage(
      `Certificate (${certToSave.certificateId}) generated and issued successfully for ${certToSave.studentName}! It is now available in the student's My Documents section.`
    )

    // Update modal to view mode
    setActiveCertificateModal({
      ...activeCertificateModal,
      certificate: certToSave,
      isNew: false,
    })
  }

  // Frontend Print Functionality
  const handlePrintCertificate = () => {
    window.print()
  }

  // Initials helper
  const getInitials = (name) => {
    if (!name) return 'IN'
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
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
          title="Certificates"
          onSearch={(q) => setSearchQuery(q)}
        />

        <main className="hr-dashboard-container">
          {/* Header */}
          <div className="hr-certs-header">
            <div className="hr-certs-title-group">
              <h1 className="hr-certs-title">Internship Certificates</h1>
              <p className="hr-certs-subtitle">
                Issue and manage verified completion credentials for graduated interns.
              </p>
            </div>

            <div className="hr-certs-meta-badge">
              <Building2 size={15} />
              <span>Issuing Authority: <strong>{hrProfile.companyName}</strong></span>
            </div>
          </div>

          {/* Feedback Banner */}
          {bannerMessage && (
            <div className="hr-certs-banner" role="status" aria-live="polite">
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

          {/* 1. Summary Statistics Cards */}
          <section className="hr-certs-stats-grid" aria-label="Certificate Statistics">
            <div className="hr-certs-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Graduated Interns</span>
                <div className="hr-stat-icon-box hr-stat-icon-completed">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.totalCompleted}</div>
              <span className="hr-stat-subtext">Completed 100% milestone</span>
            </div>

            <div className="hr-certs-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Certificates Issued</span>
                <div className="hr-stat-icon-box hr-stat-icon-issued">
                  <Award size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.issuedCount}</div>
              <span className="hr-stat-subtext">Available in student portal</span>
            </div>

            <div className="hr-certs-stat-card">
              <div className="hr-stat-header">
                <span className="hr-stat-label">Pending Generation</span>
                <div className="hr-stat-icon-box hr-stat-icon-pending">
                  <Clock size={18} />
                </div>
              </div>
              <div className="hr-stat-value">{metrics.pendingCount}</div>
              <span className="hr-stat-subtext">Awaiting HR certificate issuance</span>
            </div>
          </section>

          {/* 2. Filter & Search Controls */}
          <section className="hr-certs-filter-card" aria-label="Filter Certificates">
            <div className="hr-certs-filter-row">
              {/* Search input */}
              <div className="hr-certs-search-wrap">
                <Search size={16} className="hr-certs-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  className="hr-certs-search-input"
                  placeholder="Search completed interns by name, role, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search completed interns"
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

              {/* Status Filter Pills */}
              <div className="hr-certs-status-pills" role="tablist" aria-label="Filter by issuance status">
                {[
                  { key: 'All', label: 'All Completed' },
                  { key: 'Issued', label: 'Issued' },
                  { key: 'Pending', label: 'Pending Issuance' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    aria-selected={filterMode === item.key}
                    className={`hr-certs-status-btn ${filterMode === item.key ? 'active' : ''}`}
                    onClick={() => setFilterMode(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hr-certs-toolbar-meta">
              <span>
                Showing <strong>{filteredCompletedInterns.length}</strong> of{' '}
                <strong>{completedInterns.length}</strong> completed interns
              </span>
              <span className="hr-certs-sync-note">
                <ShieldCheck size={14} />
                <span>Certificates sync instantly with Student &gt; My Documents</span>
              </span>
            </div>
          </section>

          {/* 3. Completed Interns Certificate Cards Grid */}
          {filteredCompletedInterns.length > 0 ? (
            <div className="hr-certs-cards-grid">
              {filteredCompletedInterns.map((intern) => {
                const existingCert =
                  certMap.get(String(intern.id)) ||
                  certMap.get(intern.email.toLowerCase()) ||
                  certMap.get(intern.name.toLowerCase().trim())
                const isIssued = Boolean(existingCert)

                return (
                  <article key={intern.id} className={`hr-cert-card ${isIssued ? 'card-issued' : 'card-pending'}`}>
                    <div className="hr-cert-card-top">
                      <div className="hr-cert-intern-lead">
                        <div className="hr-cert-avatar" aria-hidden="true">
                          {getInitials(intern.name)}
                        </div>
                        <div className="hr-cert-headings">
                          <h2 className="hr-cert-intern-name">{intern.name}</h2>
                          <span className="hr-cert-intern-email">{intern.email}</span>
                        </div>
                      </div>

                      <span className={`hr-cert-status-badge ${isIssued ? 'badge-issued' : 'badge-pending'}`}>
                        {isIssued ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Certificate Issued</span>
                          </>
                        ) : (
                          <>
                            <Clock size={13} />
                            <span>Pending Generation</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="hr-cert-meta-grid">
                      <div className="hr-cert-meta-item">
                        <span className="hr-cert-meta-label">Internship Title</span>
                        <span className="hr-cert-meta-val" title={intern.internship}>
                          {intern.internship}
                        </span>
                      </div>

                      <div className="hr-cert-meta-item">
                        <span className="hr-cert-meta-label">Department</span>
                        <span className="hr-cert-meta-val">{intern.department || 'Engineering'}</span>
                      </div>

                      <div className="hr-cert-meta-item">
                        <span className="hr-cert-meta-label">Institution</span>
                        <span className="hr-cert-meta-val" title={intern.college}>
                          {intern.college}
                        </span>
                      </div>

                      <div className="hr-cert-meta-item">
                        <span className="hr-cert-meta-label">Internship Timeline</span>
                        <span className="hr-cert-meta-val">
                          {formatDate(intern.startDate)} – {formatDate(intern.endDate)}
                        </span>
                      </div>

                      {isIssued && existingCert && (
                        <div className="hr-cert-meta-item" style={{ gridColumn: 'span 2' }}>
                          <span className="hr-cert-meta-label">Certificate ID & Issue Date</span>
                          <span className="hr-cert-meta-val hr-cert-id-tag">
                            <strong>{existingCert.certificateId}</strong> • Issued on {existingCert.issuedDate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="hr-cert-actions-row">
                      {isIssued ? (
                        <>
                          <button
                            type="button"
                            className="hr-btn-view-cert"
                            onClick={() => handleViewCertificate(intern)}
                          >
                            <Eye size={15} />
                            <span>View Certificate</span>
                          </button>
                          <button
                            type="button"
                            className="hr-btn-print-cert"
                            onClick={() => {
                              handleViewCertificate(intern)
                              setTimeout(() => window.print(), 350)
                            }}
                          >
                            <Printer size={15} />
                            <span>Print / PDF</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="hr-btn-generate-cert"
                          onClick={() => handleOpenGenerateModal(intern)}
                        >
                          <Award size={16} />
                          <span>Generate Certificate</span>
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="hr-certs-empty-state">
              <div className="hr-certs-empty-icon" aria-hidden="true">
                <Award size={32} />
              </div>
              <h3 className="hr-certs-empty-title">No completed interns found</h3>
              <p className="hr-certs-empty-desc">
                Only interns whose status is marked as <strong>Completed</strong> (100% milestone progress) are eligible for certificate issuance.
              </p>
              {searchQuery && (
                <button
                  type="button"
                  className="hr-btn-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search query
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ======================================================================
          CERTIFICATE PREVIEW / GENERATION MODAL
          ====================================================================== */}
      {activeCertificateModal && activeCertificateModal.certificate && (
        <div
          className="hr-cert-modal-overlay"
          onClick={() => setActiveCertificateModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="hr-cert-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Topbar */}
            <div className="hr-cert-modal-topbar no-print">
              <div className="hr-cert-modal-head-info">
                <h3 className="hr-cert-modal-title">
                  {activeCertificateModal.isNew
                    ? 'Generate Internship Completion Certificate'
                    : 'Official Certificate Preview'}
                </h3>
                <span className="hr-cert-modal-subtitle">
                  {activeCertificateModal.isNew
                    ? 'Review credential parameters before issuing to student record.'
                    : `Verified Certificate ID: ${activeCertificateModal.certificate.certificateId}`}
                </span>
              </div>
              <button
                type="button"
                className="hr-cert-modal-close"
                onClick={() => setActiveCertificateModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Certificate Sheet Container */}
            <div className="hr-cert-modal-body">
              {/* THE OFFICIAL CERTIFICATE SHEET (Printable) */}
              <div className="hr-certificate-sheet" id="printable-certificate" ref={certPrintRef}>
                <div className="cert-sheet-outer-border">
                  <div className="cert-sheet-inner-border">
                    {/* Corner Ornaments */}
                    <div className="cert-corner corner-tl" aria-hidden="true" />
                    <div className="cert-corner corner-tr" aria-hidden="true" />
                    <div className="cert-corner corner-bl" aria-hidden="true" />
                    <div className="cert-corner corner-br" aria-hidden="true" />

                    {/* Certificate Top Header */}
                    <header className="cert-sheet-header">
                      <div className="cert-company-badge">
                        <div className="cert-company-logo" aria-hidden="true">
                          {activeCertificateModal.certificate.companyName
                            ? activeCertificateModal.certificate.companyName.charAt(0)
                            : 'T'}
                        </div>
                        <div className="cert-company-text">
                          <span className="cert-company-name">
                            {activeCertificateModal.certificate.companyName || 'TechNova Labs'}
                          </span>
                          <span className="cert-company-tagline">
                            Internship Excellence &amp; Talent Program
                          </span>
                        </div>
                      </div>

                      <div className="cert-top-id">
                        <span>CERTIFICATE ID:</span>
                        <strong>{activeCertificateModal.certificate.certificateId}</strong>
                      </div>
                    </header>

                    {/* Certificate Title */}
                    <div className="cert-title-section">
                      <div className="cert-ribbon-tag">
                        <Award size={15} />
                        <span>VERIFIED CREDENTIAL OF COMPLETION</span>
                      </div>
                      <h1 className="cert-main-heading">Certificate of Completion</h1>
                      <p className="cert-presented-text">
                        This is to proudly certify that
                      </p>
                    </div>

                    {/* Student Recipient Name */}
                    <div className="cert-recipient-section">
                      <h2 className="cert-recipient-name">
                        {activeCertificateModal.certificate.studentName}
                      </h2>
                      <div className="cert-recipient-underline" />
                      <p className="cert-recipient-institution">
                        {activeCertificateModal.certificate.college} • {activeCertificateModal.certificate.degree}
                      </p>
                    </div>

                    {/* Certification Statement */}
                    <p className="cert-statement-body">
                      has successfully completed an intensive internship program as a{' '}
                      <strong>{activeCertificateModal.certificate.internshipTitle}</strong> in the{' '}
                      <strong>{activeCertificateModal.certificate.department}</strong> department at{' '}
                      <strong>{activeCertificateModal.certificate.companyName}</strong> from{' '}
                      <span>{activeCertificateModal.certificate.startDate}</span> to{' '}
                      <span>{activeCertificateModal.certificate.endDate}</span>.
                    </p>

                    <p className="cert-performance-quote">
                      During this tenure, the candidate demonstrated outstanding technical capability, collaboration, and accomplished 100% of all assigned project milestones with excellence.
                    </p>

                    {/* Footer: Signatures & Gold Seal */}
                    <footer className="cert-sheet-footer">
                      {/* Left Signature: Supervisor */}
                      <div className="cert-sig-block">
                        <div className="cert-signature-line">
                          <span className="cert-sig-handwriting">
                            {activeCertificateModal.certificate.issuedBy || 'Sarah Mitchell'}
                          </span>
                        </div>
                        <span className="cert-sig-name">
                          {activeCertificateModal.certificate.issuedBy || 'Sarah Mitchell'}
                        </span>
                        <span className="cert-sig-title">Director of Human Resources</span>
                        <span className="cert-sig-company">{activeCertificateModal.certificate.companyName}</span>
                      </div>

                      {/* Center Official Gold Seal */}
                      <div className="cert-official-seal" aria-label="Official Verified Seal">
                        <div className="seal-outer-ring">
                          <div className="seal-inner-ring">
                            <Award size={28} className="seal-icon" />
                            <span className="seal-text-top">OFFICIAL SEAL</span>
                            <span className="seal-text-sub">INTERNHUB</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Signature: Program Director */}
                      <div className="cert-sig-block">
                        <div className="cert-signature-line">
                          <span className="cert-sig-handwriting cert-sig-alt">
                            Alexander Wright
                          </span>
                        </div>
                        <span className="cert-sig-name">Alexander Wright</span>
                        <span className="cert-sig-title">VP of Talent Development</span>
                        <span className="cert-sig-company">InternHub Platform</span>
                      </div>
                    </footer>

                    {/* Fine-print verification banner */}
                    <div className="cert-verification-fineprint">
                      <span>Completed on: <strong>{activeCertificateModal.certificate.completionDate}</strong></span>
                      <span>•</span>
                      <span>Issued on: <strong>{activeCertificateModal.certificate.issuedDate}</strong></span>
                      <span>•</span>
                      <span>Digitally Authenticated by InternHub Credential Authority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="hr-cert-modal-actions no-print">
              <button
                type="button"
                className="hr-btn-modal-cancel"
                onClick={() => setActiveCertificateModal(null)}
              >
                Close Preview
              </button>

              <button
                type="button"
                className="hr-btn-modal-print"
                onClick={handlePrintCertificate}
              >
                <Printer size={15} />
                <span>Print Certificate / PDF</span>
              </button>

              {activeCertificateModal.isNew && (
                <button
                  type="button"
                  className="hr-btn-modal-issue"
                  onClick={handleConfirmIssueCertificate}
                >
                  <Award size={16} />
                  <span>Issue &amp; Save Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HRCertificates
