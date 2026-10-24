import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderArchive,
  FileText,
  UploadCloud,
  Upload,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Award,
  FileCheck,
  File,
  X,
  ExternalLink,
  Download,
  Printer,
  Info,
  Briefcase,
  Calendar,
  Layers,
} from 'lucide-react'
import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'

/**
 * Format bytes into human-readable size string (e.g. "1.8 MB", "420 KB")
 */
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.2 MB'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Extracts uppercase file extension from a filename
 */
function getFileExtension(filename = '') {
  if (!filename) return 'PDF'
  const parts = filename.split('.')
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase()
  }
  return 'PDF'
}

/**
 * Automatically infers document category from filename if not explicitly set
 */
function inferDocumentCategory(filename = '') {
  const lower = filename.toLowerCase()
  if (lower.includes('cert') || lower.includes('award') || lower.includes('diploma') || lower.includes('license')) {
    return 'Certificate'
  }
  if (lower.includes('cover') || lower.includes('letter')) {
    return 'Cover Letter'
  }
  if (lower.includes('port') || lower.includes('project') || lower.includes('design') || lower.includes('github')) {
    return 'Portfolio'
  }
  if (lower.includes('resume') || lower.includes('cv')) {
    return 'Resume'
  }
  return 'Other'
}

/**
 * Returns appropriate icon for a document type
 */
function getDocumentIcon(type = '') {
  switch (type) {
    case 'Certificate':
      return <Award size={22} />
    case 'Cover Letter':
      return <FileText size={22} />
    case 'Portfolio':
      return <Layers size={22} />
    case 'Resume':
      return <FileCheck size={22} />
    default:
      return <FileText size={22} />
  }
}

/**
 * StudentDocuments Component
 * Real My Documents page for InternHub – AI-Assisted Internship Management System.
 * Route: /student/documents
 */
function StudentDocuments() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Student Identity: read from localStorage (key: "internhubStudent"), fallback to mock
  const [studentName] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.name || parsed.fullName || 'Student'
      }
    } catch (err) {
      console.error('Error reading student profile:', err)
    }
    return mockStudentProfile.name || 'Student'
  })

  // Student Email resolution for linking HR certificates
  const studentEmail = useMemo(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.email || ''
      }
    } catch {
      // ignore
    }
    return mockStudentProfile.email || 'alex.johnson@college.edu'
  }, [])

  const initials = studentName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST'

  // In-session File references for live browser preview/download (Frontend session only)
  const [sessionFiles, setSessionFiles] = useState({})

  // Local state trigger to re-fetch/sync documents on add/delete
  const [syncVersion, setSyncVersion] = useState(0)

  // Modals state
  const [viewingDoc, setViewingDoc] = useState(null)
  const [viewingCertificate, setViewingCertificate] = useState(null)
  const [deletingDoc, setDeletingDoc] = useState(null)

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const showToastNotification = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
  }

  // Upload Form State
  const [uploadCategory, setUploadCategory] = useState('Certificate')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const replaceResumeInputRef = useRef(null)
  const uploadSectionRef = useRef(null)

  // =========================================================================
  // Load HR-Issued Internship Completion Certificates
  // Structure prepared for Java Spring Boot + MySQL backend:
  // {
  //   certificateId, studentId, studentName, internshipId, internshipTitle,
  //   companyName, startDate, endDate, completionDate, issuedDate, issuedBy,
  //   certificateFileUrl, status
  // }
  // =========================================================================
  const hrCertificates = useMemo(() => {
    let certs = []

    try {
      // Get the currently logged-in student
      const studentRaw = localStorage.getItem('internhubStudent')
      const currentStudent = studentRaw ? JSON.parse(studentRaw) : {}

      const currentStudentId = String(
        currentStudent.studentId || currentStudent.id || ''
      )
        .trim()
        .toLowerCase()

      const currentEmail = String(
        currentStudent.email || studentEmail || ''
      )
        .trim()
        .toLowerCase()

      // Load certificates created by HR
      const stored = localStorage.getItem('internhubCertificates')

      if (stored) {
        const parsed = JSON.parse(stored)

        if (Array.isArray(parsed)) {
          certs = parsed.filter((certificate) => {
            const certificateStudentId = String(
              certificate.studentId || certificate.internId || ''
            )
              .trim()
              .toLowerCase()

            const certificateEmail = String(
              certificate.studentEmail || certificate.email || ''
            )
              .trim()
              .toLowerCase()

            // Match by unique student ID
            const idMatch =
              currentStudentId &&
              certificateStudentId &&
              currentStudentId === certificateStudentId

            // Match by exact email
            const emailMatch =
              currentEmail &&
              certificateEmail &&
              currentEmail === certificateEmail

            return idMatch || emailMatch
          })
        }
      }

      // Also check certificates attached directly to the logged-in student
      if (Array.isArray(currentStudent.certificates)) {
        currentStudent.certificates.forEach((certificate) => {
          if (
            !certs.some(
              (existing) =>
                existing.certificateId === certificate.certificateId
            )
          ) {
            certs.push(certificate)
          }
        })
      }
    } catch (error) {
      console.error('Error loading student certificates:', error)
    }

    return certs
  }, [syncVersion, studentEmail])

  // =========================================================================
  // Load & Aggregate Documents from:
  // 1. Local My Documents Storage (key: 'internhubDocuments')
  // 2. Student Profile (key: 'internhubStudent')
  // 3. Applications history (key: 'internhubApplications')
  // 4. Exclude user-deleted documents (key: 'internhubDeletedDocNames')
  // =========================================================================

  const { activeResume, additionalDocuments } = useMemo(() => {
    // 1. Deleted filenames set
    let deletedSet = new Set()
    try {
      const deletedStored = localStorage.getItem('internhubDeletedDocNames')
      if (deletedStored) {
        const parsed = JSON.parse(deletedStored)
        if (Array.isArray(parsed)) {
          parsed.forEach((name) => deletedSet.add(name.toLowerCase().trim()))
        }
      }
    } catch {
      // ignore
    }

    // 2. Read explicit documents from localStorage
    let storedDocs = []
    try {
      const docsRaw = localStorage.getItem('internhubDocuments')
      if (docsRaw) {
        const parsed = JSON.parse(docsRaw)
        if (Array.isArray(parsed)) {
          storedDocs = parsed
        }
      }
    } catch (e) {
      console.error('Error loading internhubDocuments:', e)
    }

    // 3. Read applications from localStorage
    let applications = []
    try {
      const appsRaw = localStorage.getItem('internhubApplications')
      if (appsRaw) {
        const parsed = JSON.parse(appsRaw)
        if (Array.isArray(parsed)) {
          applications = parsed
        }
      }
    } catch (e) {
      console.error('Error loading internhubApplications:', e)
    }

    // Build application usage mapping for filenames
    const fileUsageMap = {}
    applications.forEach((app) => {
      const title = app.internshipTitle || 'Internship'
      const company = app.company || 'Partner Company'
      const usedDescription = `${title} – ${company}`

      if (app.resumeName) {
        const key = app.resumeName.toLowerCase().trim()
        if (!fileUsageMap[key]) fileUsageMap[key] = []
        if (!fileUsageMap[key].includes(usedDescription)) {
          fileUsageMap[key].push(usedDescription)
        }
      }

      const rawAddDocs = app.additionalDocumentNames || app.additionalDocs || []
      const addList = Array.isArray(rawAddDocs) ? rawAddDocs : []
      addList.forEach((docName) => {
        if (typeof docName === 'string' && docName.trim()) {
          const key = docName.toLowerCase().trim()
          if (!fileUsageMap[key]) fileUsageMap[key] = []
          if (!fileUsageMap[key].includes(usedDescription)) {
            fileUsageMap[key].push(usedDescription)
          }
        }
      })
    })

    // 4. Resolve Active Resume
    let resolvedResume = null

    // Check stored docs for explicitly added Resume
    const storedResume = storedDocs.find(
      (doc) => doc.type === 'Resume' && !deletedSet.has(doc.name.toLowerCase().trim())
    )

    if (storedResume) {
      const key = storedResume.name.toLowerCase().trim()
      resolvedResume = {
        ...storedResume,
        fileExtension: getFileExtension(storedResume.name),
        usedIn: fileUsageMap[key]?.join(', ') || null,
        status: 'Available',
      }
    } else {
      // Check internhubStudent profile
      try {
        const studentRaw = localStorage.getItem('internhubStudent')
        if (studentRaw) {
          const parsedStudent = JSON.parse(studentRaw)
          if (
            parsedStudent.resume &&
            parsedStudent.resume.name &&
            !deletedSet.has(parsedStudent.resume.name.toLowerCase().trim())
          ) {
            const key = parsedStudent.resume.name.toLowerCase().trim()
            resolvedResume = {
              id: 'profile-resume',
              name: parsedStudent.resume.name,
              type: 'Resume',
              size: parsedStudent.resume.size || '1.8 MB',
              uploadedAt: parsedStudent.resume.uploadedAt || 'Available in profile',
              fileExtension: getFileExtension(parsedStudent.resume.name),
              usedIn: fileUsageMap[key]?.join(', ') || null,
              status: 'Available',
              source: 'profile',
            }
          }
        }
      } catch (e) {
        console.error('Error reading resume from student profile:', e)
      }
    }

    // If still no resume, check applications for most recent resumeName
    if (!resolvedResume) {
      for (let i = applications.length - 1; i >= 0; i--) {
        const app = applications[i]
        if (app.resumeName && !deletedSet.has(app.resumeName.toLowerCase().trim())) {
          const key = app.resumeName.toLowerCase().trim()
          let dateStr = 'Recent Application'
          if (app.submittedAt) {
            try {
              dateStr = new Date(app.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            } catch {
              dateStr = 'Recent Application'
            }
          }
          resolvedResume = {
            id: `app-resume-${app.id || i}`,
            name: app.resumeName,
            type: 'Resume',
            size: 'Standard Attachment',
            uploadedAt: dateStr,
            fileExtension: getFileExtension(app.resumeName),
            usedIn: fileUsageMap[key]?.join(', ') || null,
            status: 'Available',
            source: 'application',
          }
          break
        }
      }
    }

    // 5. Resolve Additional Documents
    const additionalDocsMap = new Map()

    // Add stored additional documents
    storedDocs
      .filter((doc) => doc.type !== 'Resume')
      .forEach((doc) => {
        const key = doc.name.toLowerCase().trim()
        if (!deletedSet.has(key)) {
          if (resolvedResume && resolvedResume.name.toLowerCase().trim() === key) {
            return
          }
          additionalDocsMap.set(key, {
            ...doc,
            fileExtension: getFileExtension(doc.name),
            usedIn: fileUsageMap[key]?.join(', ') || null,
            source: 'documents_storage',
          })
        }
      })

    // Add documents found in applications
    applications.forEach((app, appIdx) => {
      const rawAddDocs = app.additionalDocumentNames || app.additionalDocs || []
      const addList = Array.isArray(rawAddDocs) ? rawAddDocs : []

      let appDate = 'Recently'
      if (app.submittedAt) {
        try {
          appDate = new Date(app.submittedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        } catch {
          appDate = 'Recently'
        }
      }

      addList.forEach((filename) => {
        if (!filename || typeof filename !== 'string') return
        const key = filename.toLowerCase().trim()

        if (deletedSet.has(key)) return
        if (resolvedResume && resolvedResume.name.toLowerCase().trim() === key) return

        if (!additionalDocsMap.has(key)) {
          additionalDocsMap.set(key, {
            id: `app-doc-${app.id || appIdx}-${filename}`,
            name: filename,
            type: inferDocumentCategory(filename),
            size: 'Standard Attachment',
            uploadedAt: appDate,
            fileExtension: getFileExtension(filename),
            usedIn: fileUsageMap[key]?.join(', ') || null,
            source: 'application',
          })
        }
      })
    })

    const additionalDocsList = Array.from(additionalDocsMap.values())

    return {
      activeResume: resolvedResume,
      additionalDocuments: additionalDocsList,
    }
  }, [syncVersion])

  // Dynamic Document Summary Calculations
  const metrics = useMemo(() => {
    const resumeCount = activeResume ? 1 : 0
    const uploadedCerts = additionalDocuments.filter((d) => d.type === 'Certificate').length
    const totalCertificates = uploadedCerts + hrCertificates.length
    const otherCount = additionalDocuments.filter((d) => d.type !== 'Certificate').length
    const totalCount = resumeCount + additionalDocuments.length + hrCertificates.length

    return {
      total: totalCount,
      resume: resumeCount,
      certificates: totalCertificates,
      other: otherCount,
    }
  }, [activeResume, additionalDocuments, hrCertificates])

  // =========================================================================
  // Handlers: File Selection & Upload
  // =========================================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(
        `File "${file.name}" exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller file.`
      )
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedFile(file)
  }

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null)
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddDocument = (e) => {
    e.preventDefault()

    if (!selectedFile) {
      setUploadError('Please select a file to upload.')
      return
    }

    const formattedSize = formatFileSize(selectedFile.size)
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: selectedFile.name,
      type: uploadCategory,
      size: formattedSize,
      uploadedAt: today,
      fileSizeRaw: selectedFile.size,
    }

    // Save File object in memory for in-session preview/download
    setSessionFiles((prev) => ({
      ...prev,
      [selectedFile.name.toLowerCase().trim()]: selectedFile,
    }))

    let storedDocs = []
    try {
      const raw = localStorage.getItem('internhubDocuments')
      if (raw) storedDocs = JSON.parse(raw)
      if (!Array.isArray(storedDocs)) storedDocs = []
    } catch {
      storedDocs = []
    }

    if (uploadCategory === 'Resume') {
      const filtered = storedDocs.filter((d) => d.type !== 'Resume')
      filtered.push(newDoc)
      localStorage.setItem('internhubDocuments', JSON.stringify(filtered))

      try {
        const studentRaw = localStorage.getItem('internhubStudent')
        if (studentRaw) {
          const parsedStudent = JSON.parse(studentRaw)
          parsedStudent.resume = {
            name: selectedFile.name,
            size: formattedSize,
            uploadedAt: today,
          }
          localStorage.setItem('internhubStudent', JSON.stringify(parsedStudent))
        }
      } catch (err) {
        console.error('Error updating internhubStudent resume:', err)
      }

      showToastNotification(`Resume "${selectedFile.name}" added successfully.`)
    } else {
      try {
        const deletedRaw = localStorage.getItem('internhubDeletedDocNames')
        if (deletedRaw) {
          const deletedList = JSON.parse(deletedRaw)
          if (Array.isArray(deletedList)) {
            const updatedDeleted = deletedList.filter(
              (name) => name.toLowerCase().trim() !== selectedFile.name.toLowerCase().trim()
            )
            localStorage.setItem('internhubDeletedDocNames', JSON.stringify(updatedDeleted))
          }
        }
      } catch {
        // ignore
      }

      const filtered = storedDocs.filter(
        (d) => d.name.toLowerCase().trim() !== selectedFile.name.toLowerCase().trim()
      )
      filtered.push(newDoc)
      localStorage.setItem('internhubDocuments', JSON.stringify(filtered))

      showToastNotification(`Document "${selectedFile.name}" added successfully.`)
    }

    setSelectedFile(null)
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setSyncVersion((v) => v + 1)
  }

  // =========================================================================
  // Handlers: Replace Resume Directly
  // =========================================================================

  const handleReplaceResume = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert(`Resume must be smaller than 5 MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`)
      if (replaceResumeInputRef.current) replaceResumeInputRef.current.value = ''
      return
    }

    const formattedSize = formatFileSize(file.size)
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const newResume = {
      id: `resume-${Date.now()}`,
      name: file.name,
      type: 'Resume',
      size: formattedSize,
      uploadedAt: today,
      fileSizeRaw: file.size,
    }

    setSessionFiles((prev) => ({
      ...prev,
      [file.name.toLowerCase().trim()]: file,
    }))

    try {
      let storedDocs = []
      const raw = localStorage.getItem('internhubDocuments')
      if (raw) storedDocs = JSON.parse(raw)
      if (!Array.isArray(storedDocs)) storedDocs = []
      const filtered = storedDocs.filter((d) => d.type !== 'Resume')
      filtered.push(newResume)
      localStorage.setItem('internhubDocuments', JSON.stringify(filtered))
    } catch {
      // ignore
    }

    try {
      const studentRaw = localStorage.getItem('internhubStudent')
      if (studentRaw) {
        const parsedStudent = JSON.parse(studentRaw)
        parsedStudent.resume = {
          name: file.name,
          size: formattedSize,
          uploadedAt: today,
        }
        localStorage.setItem('internhubStudent', JSON.stringify(parsedStudent))
      }
    } catch (err) {
      console.error('Error updating internhubStudent resume:', err)
    }

    if (replaceResumeInputRef.current) replaceResumeInputRef.current.value = ''
    setSyncVersion((v) => v + 1)
    showToastNotification(`Resume updated with "${file.name}".`)
  }

  // =========================================================================
  // Handlers: Delete Document Confirmation & Execution
  // =========================================================================

  const handleConfirmDelete = () => {
    if (!deletingDoc) return

    const docName = deletingDoc.name
    const normName = docName.toLowerCase().trim()

    try {
      const raw = localStorage.getItem('internhubDocuments')
      if (raw) {
        const storedDocs = JSON.parse(raw)
        if (Array.isArray(storedDocs)) {
          const updated = storedDocs.filter((d) => d.name.toLowerCase().trim() !== normName)
          localStorage.setItem('internhubDocuments', JSON.stringify(updated))
        }
      }
    } catch {
      // ignore
    }

    try {
      let deletedList = []
      const deletedRaw = localStorage.getItem('internhubDeletedDocNames')
      if (deletedRaw) {
        const parsed = JSON.parse(deletedRaw)
        if (Array.isArray(parsed)) deletedList = parsed
      }
      if (!deletedList.includes(normName)) {
        deletedList.push(normName)
        localStorage.setItem('internhubDeletedDocNames', JSON.stringify(deletedList))
      }
    } catch {
      // ignore
    }

    if (deletingDoc.type === 'Resume') {
      try {
        const studentRaw = localStorage.getItem('internhubStudent')
        if (studentRaw) {
          const parsed = JSON.parse(studentRaw)
          parsed.resume = null
          localStorage.setItem('internhubStudent', JSON.stringify(parsed))
        }
      } catch {
        // ignore
      }
    }

    setSessionFiles((prev) => {
      const copy = { ...prev }
      delete copy[normName]
      return copy
    })

    setDeletingDoc(null)
    setSyncVersion((v) => v + 1)
    showToastNotification(`Document "${docName}" removed.`)
  }

  // =========================================================================
  // Handlers: Download Certificate (HR Issued)
  // =========================================================================
  const handleDownloadCertificate = (cert) => {
    if (cert.certificateFileUrl) {
      window.open(cert.certificateFileUrl, '_blank')
    } else {
      showToastNotification(
        `Preparing official certificate ${cert.certificateId || 'INTH-2026-0001'} for print & PDF download...`
      )
      setViewingCertificate(cert)
      setTimeout(() => {
        window.print()
      }, 350)
    }
  }

  const handleScrollToUpload = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
  }

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
          title="My Documents"
        />

        <main className="dashboard-container documents-page">
          {/* Page Header */}
          <div className="documents-header">
            <div className="documents-header-left">
              <h1 className="documents-title">My Documents</h1>
              <p className="documents-subtitle">
                Manage your resumes and other documents for internship applications.
              </p>
            </div>
          </div>

          {/* Document Summary Cards */}
          <div className="documents-summary">
            {/* Total Documents */}
            <div className="documents-summary-card">
              <div className="documents-summary-icon-wrap">
                <FolderArchive size={22} />
              </div>
              <div className="documents-summary-info">
                <span className="documents-summary-label">Total Documents</span>
                <span className="documents-summary-value">{metrics.total}</span>
              </div>
            </div>

            {/* Resume */}
            <div className="documents-summary-card">
              <div className="documents-summary-icon-wrap">
                <FileCheck size={22} />
              </div>
              <div className="documents-summary-info">
                <span className="documents-summary-label">Resume</span>
                <span className="documents-summary-value">{metrics.resume}</span>
              </div>
            </div>

            {/* Certificates */}
            <div className="documents-summary-card">
              <div className="documents-summary-icon-wrap">
                <Award size={22} />
              </div>
              <div className="documents-summary-info">
                <span className="documents-summary-label">Certificates</span>
                <span className="documents-summary-value">{metrics.certificates}</span>
              </div>
            </div>

            {/* Other Documents */}
            <div className="documents-summary-card">
              <div className="documents-summary-icon-wrap">
                <Layers size={22} />
              </div>
              <div className="documents-summary-info">
                <span className="documents-summary-label">Other Documents</span>
                <span className="documents-summary-value">{metrics.other}</span>
              </div>
            </div>
          </div>

          {/* Primary Layout Grid: Resume Hero & Upload Area */}
          <div className="documents-main-grid">
            {/* Left: Primary Resume Section */}
            <div className="resume-section-container">
              <h2 className="documents-section-title">
                <FileCheck size={20} />
                Primary Resume
                <span className="documents-section-badge">Required</span>
              </h2>

              {activeResume ? (
                <div className="resume-card">
                  <div className="resume-card-header">
                    <div className="resume-file-block">
                      <div className="resume-file-icon">
                        <FileText size={26} />
                      </div>
                      <div className="resume-file-details">
                        <span className="resume-file-name">{activeResume.name}</span>
                        <div className="resume-file-meta">
                          <span>{activeResume.fileExtension}</span>
                          <span className="resume-meta-dot" />
                          <span>{activeResume.size}</span>
                          {activeResume.uploadedAt && (
                            <>
                              <span className="resume-meta-dot" />
                              <span>Added {activeResume.uploadedAt}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="resume-status-pill">
                      <CheckCircle2 size={13} />
                      Available
                    </span>
                  </div>

                  {activeResume.usedIn && (
                    <div className="resume-used-callout">
                      <Briefcase size={14} style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Used for:</strong> {activeResume.usedIn}
                      </span>
                    </div>
                  )}

                  <div className="resume-actions">
                    <button
                      type="button"
                      className="doc-btn doc-btn-outline"
                      onClick={() => setViewingDoc(activeResume)}
                    >
                      <Eye size={15} />
                      View
                    </button>
                    <button
                      type="button"
                      className="doc-btn doc-btn-primary"
                      onClick={() => replaceResumeInputRef.current?.click()}
                    >
                      <RefreshCw size={15} />
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Resume State */
                <div className="resume-empty-card">
                  <div className="resume-empty-icon">
                    <FileText size={24} />
                  </div>
                  <h3 className="resume-empty-title">No Resume Added</h3>
                  <p className="resume-empty-desc">
                    Add your resume to make applying for internships easier.
                  </p>
                  <button
                    type="button"
                    className="doc-btn doc-btn-primary"
                    onClick={() => replaceResumeInputRef.current?.click()}
                  >
                    <Plus size={16} />
                    Add Resume
                  </button>
                </div>
              )}

              {/* Hidden file input for Replace/Add Resume */}
              <input
                ref={replaceResumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleReplaceResume}
              />
            </div>

            {/* Right: Upload Area */}
            <div className="upload-card" ref={uploadSectionRef}>
              <div className="upload-card-header">
                <h2 className="upload-card-title">Add a Document</h2>
                <p className="upload-card-subtitle">
                  Upload certificates, cover letters, portfolios, or update your resume.
                </p>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="upload-form-row">
                  <div className="upload-field-group">
                    <label className="upload-label" htmlFor="doc-category-select">
                      Document Type
                    </label>
                    <select
                      id="doc-category-select"
                      className="upload-select"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                    >
                      <option value="Certificate">Certificate</option>
                      <option value="Cover Letter">Cover Letter</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Other">Other Document</option>
                      <option value="Resume">Primary Resume</option>
                    </select>
                  </div>
                  <div className="upload-field-group">
                    <label className="upload-label">Max File Size</label>
                    <input
                      type="text"
                      className="upload-input-text"
                      value="5 MB (PDF, DOC, DOCX, JPG, PNG)"
                      disabled
                      readOnly
                      style={{ opacity: 0.8, cursor: 'default' }}
                    />
                  </div>
                </div>

                {/* File Dropzone / Picker */}
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer?.files?.[0]
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        setUploadError(
                          `File "${file.name}" exceeds the 5 MB limit. Please select a smaller file.`
                        )
                        setSelectedFile(null)
                      } else {
                        setSelectedFile(file)
                        setUploadError('')
                      }
                    }
                  }}
                >
                  <UploadCloud size={28} className="upload-dropzone-icon" />
                  <span className="upload-dropzone-text">
                    Choose file or drag & drop here
                  </span>
                  <span className="upload-dropzone-hint">
                    PDF, DOC, DOCX, JPG, PNG up to 5 MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>

                {/* Selected File Badge */}
                {selectedFile && (
                  <div className="upload-file-selected-badge">
                    <div className="upload-file-selected-info">
                      <FileText size={16} />
                      <span className="upload-file-selected-name">
                        {selectedFile.name}
                      </span>
                      <span className="upload-file-selected-size">
                        ({formatFileSize(selectedFile.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      className="upload-file-remove-btn"
                      onClick={handleRemoveSelectedFile}
                      aria-label="Remove selected file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {uploadError && (
                  <div className="upload-error-banner">
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Frontend Limitations Notice */}
                <div className="upload-notice">
                  <strong>Frontend Demonstration:</strong> Document metadata is stored securely in your browser's local storage. Full cloud file storage will be connected in the production backend.
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="upload-submit-btn"
                  disabled={!selectedFile}
                >
                  <Upload size={15} />
                  Add Document
                </button>
              </form>
            </div>
          </div>

          {/* =================================================================
              NEW SECTION: Internship Completion Certificates (Issued by HR)
              ================================================================= */}
          <div className="certificates-section">
            <div className="certificates-section-header">
              <h2 className="certificates-section-title">
                <Award size={20} />
                Internship Completion Certificates
              </h2>
              <p className="certificates-section-subtitle">
                Certificates issued by HR after successfully completing an internship.
              </p>
            </div>

            {hrCertificates.length > 0 ? (
              <div className="certificates-grid">
                {hrCertificates.map((cert) => (
                  <div key={cert.certificateId || cert.id} className="certificate-card">
                    <div className="certificate-card-top">
                      <div className="certificate-card-info-group">
                        <div className="certificate-card-icon-wrap">
                          <Award size={24} />
                        </div>
                        <div className="certificate-card-details">
                          <h3 className="certificate-card-title">
                            {cert.internshipTitle || 'Internship Completion Certificate'}
                          </h3>
                          <span className="certificate-card-company">
                            {cert.companyName || 'Partner Company'}
                          </span>
                        </div>
                      </div>
                      <span className="certificate-card-badge">
                        <CheckCircle2 size={13} />
                        {cert.status || 'Issued by HR'}
                      </span>
                    </div>

                    <div className="certificate-meta-grid">
                      <div className="certificate-meta-item">
                        <span className="certificate-meta-label">Certificate ID</span>
                        <span className="certificate-meta-val">{cert.certificateId || 'INTH-2026-0001'}</span>
                      </div>
                      <div className="certificate-meta-item">
                        <span className="certificate-meta-label">Recipient</span>
                        <span className="certificate-meta-val">{cert.studentName || studentName}</span>
                      </div>
                      {cert.completionDate && (
                        <div className="certificate-meta-item">
                          <span className="certificate-meta-label">Completed</span>
                          <span className="certificate-meta-val">{cert.completionDate}</span>
                        </div>
                      )}
                      {cert.issuedDate && (
                        <div className="certificate-meta-item">
                          <span className="certificate-meta-label">Issued Date</span>
                          <span className="certificate-meta-val">{cert.issuedDate}</span>
                        </div>
                      )}
                      {cert.issuedBy && (
                        <div className="certificate-meta-item" style={{ gridColumn: 'span 2' }}>
                          <span className="certificate-meta-label">Issued By</span>
                          <span className="certificate-meta-val">{cert.issuedBy}</span>
                        </div>
                      )}
                    </div>

                    <div className="certificate-card-actions">
                      <button
                        type="button"
                        className="doc-btn doc-btn-outline"
                        onClick={() => setViewingCertificate(cert)}
                      >
                        <Eye size={14} />
                        View Certificate
                      </button>
                      <button
                        type="button"
                        className="doc-btn doc-btn-primary"
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        <Download size={14} />
                        Download Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State when no certificates exist */
              <div className="empty-certificates-card">
                <div className="empty-certificates-icon">
                  <Award size={26} />
                </div>
                <h3 className="empty-certificates-title">No Certificates Yet</h3>
                <p className="empty-certificates-text">
                  Your internship completion certificate will appear here after it is issued by HR.
                </p>
              </div>
            )}
          </div>

          {/* Supporting / Additional Documents Section */}
          <div className="documents-section">
            <div className="documents-section-header">
              <div className="documents-section-header-left">
                <h2 className="documents-section-title">
                  <FolderArchive size={20} />
                  Additional Documents
                </h2>
                <span className="documents-section-badge">
                  {additionalDocuments.length}
                </span>
              </div>
            </div>

            {additionalDocuments.length > 0 ? (
              <div className="documents-grid">
                {additionalDocuments.map((doc) => {
                  let badgeModifier = 'badge-other'
                  if (doc.type === 'Certificate') badgeModifier = 'badge-certificate'
                  if (doc.type === 'Cover Letter') badgeModifier = 'badge-cover-letter'
                  if (doc.type === 'Portfolio') badgeModifier = 'badge-portfolio'

                  return (
                    <div key={doc.id || doc.name} className="document-card">
                      <div className="document-card-top">
                        <div className="document-card-icon-group">
                          <div className="document-card-icon">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="document-card-title-wrap">
                            <span className="document-card-name" title={doc.name}>
                              {doc.name}
                            </span>
                            <div className="document-card-meta">
                              <span>{doc.fileExtension}</span>
                              <span className="resume-meta-dot" />
                              <span>{doc.size}</span>
                              {doc.uploadedAt && (
                                <>
                                  <span className="resume-meta-dot" />
                                  <span>{doc.uploadedAt}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`document-type-badge ${badgeModifier}`}>
                          {doc.type}
                        </span>
                      </div>

                      {doc.usedIn && (
                        <div className="document-used-tag">
                          <strong>Used for:</strong> {doc.usedIn}
                        </div>
                      )}

                      <div className="document-card-actions">
                        <button
                          type="button"
                          className="doc-btn doc-btn-outline"
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          type="button"
                          className="doc-btn doc-btn-danger"
                          onClick={() => setDeletingDoc(doc)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : metrics.total === 0 ? (
              /* Global Empty State */
              <div className="empty-documents-card">
                <div className="empty-documents-icon">
                  <FolderArchive size={32} />
                </div>
                <h3 className="empty-documents-title">No Documents Yet</h3>
                <p className="empty-documents-text">
                  Your resumes and supporting documents will appear here.
                </p>
                <button
                  type="button"
                  className="doc-btn doc-btn-primary"
                  onClick={handleScrollToUpload}
                >
                  <Plus size={16} />
                  Add Document
                </button>
              </div>
            ) : (
              /* Supporting Documents Empty State */
              <div className="empty-documents-card" style={{ padding: '36px 20px' }}>
                <p className="empty-documents-text" style={{ maxWidth: '480px' }}>
                  No additional supporting documents uploaded yet. Upload certificates, cover letters, or portfolio links above to strengthen your internship applications.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ===================================================================
          View Document Modal
          =================================================================== */}
      {viewingDoc && (
        <div className="doc-modal-overlay" onClick={() => setViewingDoc(null)}>
          <div
            className="doc-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="doc-modal-header">
              <h3 className="doc-modal-title">
                <FileText size={18} />
                Document Details
              </h3>
              <button
                type="button"
                className="doc-modal-close-btn"
                onClick={() => setViewingDoc(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="doc-modal-body">
              {/* File Banner */}
              <div className="doc-modal-file-banner">
                <div className="doc-modal-file-icon">
                  {getDocumentIcon(viewingDoc.type)}
                </div>
                <div className="doc-modal-file-info">
                  <span className="doc-modal-file-name">{viewingDoc.name}</span>
                  <span className="doc-modal-file-sub">{viewingDoc.type}</span>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="doc-modal-meta-grid">
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">File Type</span>
                  <span className="doc-modal-meta-value">
                    {viewingDoc.fileExtension || getFileExtension(viewingDoc.name)}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Estimated Size</span>
                  <span className="doc-modal-meta-value">{viewingDoc.size || '1.8 MB'}</span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Added Date</span>
                  <span className="doc-modal-meta-value">
                    {viewingDoc.uploadedAt || 'Available'}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Storage Status</span>
                  <span className="doc-modal-meta-value" style={{ color: '#198754' }}>
                    Available in Local Storage
                  </span>
                </div>
              </div>

              {/* Application Usage */}
              {viewingDoc.usedIn && (
                <div className="resume-used-callout">
                  <Briefcase size={16} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Attached to Applications:</strong>
                    <div style={{ marginTop: '2px' }}>{viewingDoc.usedIn}</div>
                  </div>
                </div>
              )}

              {/* Frontend Explanation Notice */}
              <div className="doc-modal-info-box">
                <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Frontend Architecture Notice:</strong>
                  <br />
                  Document filenames and metadata are linked with your student profile and application history in browser local storage.
                  {sessionFiles[viewingDoc.name.toLowerCase().trim()]
                    ? ' You uploaded this file during this session, so you can preview/download it below.'
                    : ' Live document preview and download will be enabled when backend file storage is connected.'}
                </div>
              </div>
            </div>

            <div className="doc-modal-footer">
              {sessionFiles[viewingDoc.name.toLowerCase().trim()] && (
                <button
                  type="button"
                  className="doc-btn doc-btn-primary"
                  onClick={() => {
                    const file = sessionFiles[viewingDoc.name.toLowerCase().trim()]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      window.open(url, '_blank')
                    }
                  }}
                >
                  <Download size={14} />
                  Preview / Download
                </button>
              )}
              <button
                type="button"
                className="doc-btn doc-btn-outline"
                onClick={() => setViewingDoc(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          View HR-Issued Certificate Details Modal
          =================================================================== */}
      {viewingCertificate && (
        <div className="doc-modal-overlay" onClick={() => setViewingCertificate(null)}>
          <div
            className="doc-modal"
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="doc-modal-header">
              <h3 className="doc-modal-title">
                <Award size={20} color="#92400E" />
                Internship Completion Certificate
              </h3>
              <button
                type="button"
                className="doc-modal-close-btn"
                onClick={() => setViewingCertificate(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="doc-modal-body">
              {/* Certificate Banner */}
              <div className="cert-modal-banner">
                <div className="cert-modal-banner-icon">
                  <Award size={28} />
                </div>
                <div className="cert-modal-banner-info">
                  <span className="cert-modal-banner-title">
                    {viewingCertificate.internshipTitle || 'Internship Completion Certificate'}
                  </span>
                  <span className="cert-modal-banner-sub">
                    Issued by {viewingCertificate.companyName || 'Partner Company'}
                  </span>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="doc-modal-meta-grid">
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Certificate ID</span>
                  <span className="doc-modal-meta-value">
                    {viewingCertificate.certificateId || 'INTH-2026-0001'}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Status</span>
                  <span className="doc-modal-meta-value" style={{ color: '#198754' }}>
                    {viewingCertificate.status || 'Issued by HR'}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Recipient</span>
                  <span className="doc-modal-meta-value">
                    {viewingCertificate.studentName || studentName}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Student ID</span>
                  <span className="doc-modal-meta-value">
                    {viewingCertificate.studentId || 'Verified Student'}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Completion Date</span>
                  <span className="doc-modal-meta-value">
                    {viewingCertificate.completionDate || '30 November 2026'}
                  </span>
                </div>
                <div className="doc-modal-meta-item">
                  <span className="doc-modal-meta-label">Issued Date</span>
                  <span className="doc-modal-meta-value">
                    {viewingCertificate.issuedDate || 'Recently'}
                  </span>
                </div>
                <div className="doc-modal-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="doc-modal-meta-label">Issued By / HR</span>
                  <span className="doc-modal-meta-value">
                    {viewingCertificate.issuedBy || 'HR Department'}
                  </span>
                </div>
                {(viewingCertificate.startDate || viewingCertificate.endDate) && (
                  <div className="doc-modal-meta-item" style={{ gridColumn: 'span 2' }}>
                    <span className="doc-modal-meta-label">Internship Duration</span>
                    <span className="doc-modal-meta-value">
                      {viewingCertificate.startDate} to {viewingCertificate.endDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Verified Notice */}
              <div className="doc-modal-info-box">
                <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Official HR Record:</strong>
                  <br />
                  This completion certificate was issued and recorded by HR upon verified completion of your internship.
                  {viewingCertificate.certificateFileUrl
                    ? ' An official certificate document file is attached and available below.'
                    : ' PDF document download and digital verification will connect with cloud storage in the upcoming production release.'}
                </div>
              </div>
            </div>

            <div className="doc-modal-footer">
              <button
                type="button"
                className="doc-btn doc-btn-primary"
                onClick={() => handleDownloadCertificate(viewingCertificate)}
              >
                <Printer size={14} />
                Print / Save PDF
              </button>
              <button
                type="button"
                className="doc-btn doc-btn-outline"
                onClick={() => setViewingCertificate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          Delete Confirmation Modal
          =================================================================== */}
      {deletingDoc && (
        <div className="doc-modal-overlay" onClick={() => setDeletingDoc(null)}>
          <div
            className="doc-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="doc-modal-header">
              <h3 className="doc-modal-title" style={{ color: '#DC3545' }}>
                <AlertCircle size={20} />
                Delete this document?
              </h3>
              <button
                type="button"
                className="doc-modal-close-btn"
                onClick={() => setDeletingDoc(null)}
                aria-label="Cancel deletion"
              >
                <X size={20} />
              </button>
            </div>

            <div className="doc-modal-body">
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--charcoal)', lineHeight: 1.5 }}>
                Are you sure you want to remove <strong>"{deletingDoc.name}"</strong>? This document will be removed from your documents list.
              </p>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--muted-gray)',
                  backgroundColor: 'var(--warm-gray)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  lineHeight: 1.4,
                }}
              >
                Note: Since cloud storage is not connected yet, this removes the document metadata from your local browser session.
              </div>
            </div>

            <div className="doc-modal-footer">
              <button
                type="button"
                className="doc-btn doc-btn-outline"
                onClick={() => setDeletingDoc(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="doc-btn doc-btn-danger"
                style={{ backgroundColor: '#DC3545', color: '#fff', borderColor: '#DC3545' }}
                onClick={handleConfirmDelete}
              >
                <Trash2 size={14} />
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          Floating Toast Notification
          =================================================================== */}
      {showToast && (
        <div className="doc-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default StudentDocuments
