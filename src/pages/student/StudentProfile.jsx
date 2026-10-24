import { useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building2,
  BookOpen,
  Hash,
  Sparkles,
  FileText,
  Globe,
  UploadCloud,
  Check,
  CheckCircle2,
  X,
  Plus,
  Edit3,
  Trash2,
  FileCheck,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'

// Inline SVG Icon for GitHub (Lucide style)
function GithubIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

// Inline SVG Icon for LinkedIn (Lucide style)
function LinkedinIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/**
 * Default fallback profile state
 * Note: Never hardcodes a specific student's name. Dynamically populated from
 * localStorage (if logged in / registered) or from mock data.
 */
const initialDefaultProfile = {
  // Personal
  fullName: mockStudentProfile.name || 'Alex Johnson',
  email: mockStudentProfile.email || 'alex.johnson@college.edu',
  phone: mockStudentProfile.phone || '+91 98765 43210',
  dob: '2004-06-18',
  gender: 'Prefer not to say',

  // Academic
  college: mockStudentProfile.college || 'National Institute of Technology',
  course: 'B.Tech',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  semester: '6th Semester',
  studentId: mockStudentProfile.studentId || 'CS2023-089',

  // Skills
  skills: ['Java', 'C', 'Python', 'HTML', 'CSS', 'JavaScript'],

  // About Me
  aboutMe:
    'Dedicated Computer Science undergraduate with a keen focus on full-stack web applications, data structures, and responsive software design. Eager to contribute to high-impact development teams through an immersive internship.',

  // Links
  github: 'https://github.com/alexjohnson',
  linkedin: 'https://linkedin.com/in/alex-johnson',
  portfolio: 'https://alexjohnson.dev',

  // Resume (null by default so "No resume uploaded yet" is clearly shown as requested)
  resume: null,
}

/**
 * StudentProfile Component
 * Real Student Profile page for InternHub.
 * Route: /student/profile
 */
function StudentProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Profile updated successfully.')
  const [newSkill, setNewSkill] = useState('')
  const [skillFeedback, setSkillFeedback] = useState('')

  const fileInputRef = useRef(null)

  // Initialize profile data from localStorage (saved session) or fallback
  const [profileData, setProfileData] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        let parsedSkills = initialDefaultProfile.skills
        if (Array.isArray(parsed.skills)) {
          parsedSkills = parsed.skills
        } else if (typeof parsed.skills === 'string' && parsed.skills.trim()) {
          parsedSkills = parsed.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        }

        // Split year/semester if combined
        let parsedYear = parsed.year || initialDefaultProfile.year
        let parsedSemester = parsed.semester || initialDefaultProfile.semester
        if (parsed.yearSemester && parsed.yearSemester.includes('/')) {
          const parts = parsed.yearSemester.split('/')
          parsedYear = parts[0]?.trim() || parsedYear
          parsedSemester = parts[1]?.trim() || parsedSemester
        }

        return {
          ...initialDefaultProfile,
          fullName: parsed.name || parsed.fullName || initialDefaultProfile.fullName,
          email: parsed.email || initialDefaultProfile.email,
          phone: parsed.phone || initialDefaultProfile.phone,
          college: parsed.college || initialDefaultProfile.college,
          course: parsed.course || initialDefaultProfile.course,
          department: parsed.department || initialDefaultProfile.department,
          year: parsedYear,
          semester: parsedSemester,
          studentId: parsed.studentId || initialDefaultProfile.studentId,
          skills: parsedSkills.length > 0 ? parsedSkills : initialDefaultProfile.skills,
          aboutMe: parsed.aboutMe !== undefined ? parsed.aboutMe : initialDefaultProfile.aboutMe,
          github: parsed.github !== undefined ? parsed.github : initialDefaultProfile.github,
          linkedin: parsed.linkedin !== undefined ? parsed.linkedin : initialDefaultProfile.linkedin,
          portfolio: parsed.portfolio !== undefined ? parsed.portfolio : initialDefaultProfile.portfolio,
          dob: parsed.dob || initialDefaultProfile.dob,
          gender: parsed.gender || initialDefaultProfile.gender,
          resume: parsed.resume !== undefined ? parsed.resume : initialDefaultProfile.resume,
        }
      }
    } catch (err) {
      console.error('Error loading student profile from storage:', err)
    }
    return initialDefaultProfile
  })

  // Snapshot for discarding edits
  const [savedSnapshot, setSavedSnapshot] = useState(profileData)

  // Dynamic Initials from full name
  const studentDisplayName = profileData.fullName || 'Student'
  const initials = useMemo(() => {
    return studentDisplayName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST'
  }, [studentDisplayName])

  // Dynamic Profile Completion calculation
  const profileCompletionPercentage = useMemo(() => {
    let score = 0
    if (profileData.fullName?.trim()) score += 10
    if (profileData.email?.trim()) score += 10
    if (profileData.phone?.trim()) score += 10
    if (profileData.college?.trim()) score += 10
    if (profileData.course?.trim() && profileData.department?.trim()) score += 10
    if (profileData.studentId?.trim()) score += 10
    if (profileData.skills?.length >= 3) score += 15
    if (profileData.aboutMe?.trim().length >= 25) score += 10
    if (profileData.github?.trim() || profileData.linkedin?.trim() || profileData.portfolio?.trim()) {
      score += 10
    }
    if (profileData.resume) score += 5
    return Math.min(score, 100)
  }, [profileData])

  // Field change handler
  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add new skill chip
  const handleAddSkill = (e) => {
    e?.preventDefault()
    const cleanSkill = newSkill.trim()
    if (!cleanSkill) {
      setSkillFeedback('Please enter a skill name.')
      return
    }

    const alreadyExists = profileData.skills.some(
      (s) => s.toLowerCase() === cleanSkill.toLowerCase()
    )

    if (alreadyExists) {
      setSkillFeedback(`"${cleanSkill}" is already in your skills list.`)
      return
    }

    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, cleanSkill],
    }))
    setNewSkill('')
    setSkillFeedback('')
  }

  // Remove skill chip
  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }))
  }

  // Trigger hidden file picker
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Resume selection handler (Frontend-only file simulation)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileSizeKb = Math.round(file.size / 1024)
      const formattedSize = fileSizeKb > 1024 ? `${(fileSizeKb / 1024).toFixed(1)} MB` : `${fileSizeKb} KB`

      const newResume = {
        name: file.name,
        size: formattedSize,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }

      setProfileData((prev) => ({
        ...prev,
        resume: newResume,
      }))

      // Reset file input value so same file can be re-selected if desired
      e.target.value = ''

      // Notify user
      setToastMessage(`Resume "${file.name}" selected. Click "Save Changes" to save.`)
      setShowToast(true)
    }
  }

  // Remove uploaded resume
  const handleRemoveResume = () => {
    setProfileData((prev) => ({
      ...prev,
      resume: null,
    }))
  }

  // Save changes handler (Frontend state + localStorage persistence)
  const handleSaveChanges = (e) => {
    e?.preventDefault()

    // Persist to localStorage so Topbar and StudentDashboard immediately update
    const updatedStudentRecord = {
      ...profileData,
      name: profileData.fullName,
      fullName: profileData.fullName,
      yearSemester: `${profileData.year} / ${profileData.semester}`,
      profileCompletion: profileCompletionPercentage,
    }

    try {
      localStorage.setItem('internhubStudent', JSON.stringify(updatedStudentRecord))
    } catch (err) {
      console.error('Could not save profile to localStorage:', err)
    }

    setSavedSnapshot(profileData)
    setIsEditing(false)
    setToastMessage('Profile updated successfully.')
    setShowToast(true)

    // Auto-dismiss toast after 4 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
  }

  // Cancel / Reset to last saved state
  const handleCancelChanges = () => {
    setProfileData(savedSnapshot)
    setIsEditing(false)
    setSkillFeedback('')
  }

  return (
    <div className="student-dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        <Topbar
          studentName={studentDisplayName}
          initials={initials}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="My Profile"
        />

        <main className="dashboard-container">
          {/* ================================================================
              1. Page Header
              ================================================================ */}
          <div className="profile-page-header">
            <h1 className="profile-page-title">My Profile</h1>
            <p className="profile-page-subtitle">
              Manage your personal information, academic details, skills, and professional links.
            </p>
          </div>

          {/* Toast / Success Notification Message */}
          {showToast && (
            <div className="profile-toast-banner" role="status" aria-live="polite">
              <div className="profile-toast-content">
                <CheckCircle2 size={20} className="profile-toast-icon" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                className="profile-toast-dismiss"
                onClick={() => setShowToast(false)}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* ================================================================
              2. Profile Overview Hero Card
              ================================================================ */}
          <section className="profile-hero-card" aria-label="Profile Overview">
            <div className="profile-hero-main">
              {/* Circular Avatar */}
              <div className="profile-hero-avatar" aria-hidden="true">
                {initials}
              </div>

              <div className="profile-hero-info">
                <div className="profile-hero-name-row">
                  <h2 className="profile-hero-name">{studentDisplayName}</h2>
                  <span className="profile-badge-student">
                    <ShieldCheck size={13} /> Student
                  </span>
                </div>

                <div className="profile-hero-contact-row">
                  <span className="profile-hero-contact-item">
                    <Mail size={14} /> {profileData.email}
                  </span>
                  <span className="profile-hero-contact-item">
                    <Phone size={14} /> {profileData.phone}
                  </span>
                </div>

                <div className="profile-hero-academic-meta">
                  <span>{profileData.college}</span>
                  <span className="meta-sep">•</span>
                  <span>{profileData.course}</span>
                  <span className="meta-sep">•</span>
                  <span>{profileData.department}</span>
                  <span className="meta-sep">•</span>
                  <span>
                    {profileData.year} / {profileData.semester}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion & Quick Edit Toggle */}
            <div className="profile-hero-actions-box">
              <div className="profile-completion-box">
                <div className="profile-completion-header">
                  <span className="profile-completion-label">Profile Completion</span>
                  <span className="profile-completion-score">
                    {profileCompletionPercentage}%
                  </span>
                </div>
                <div
                  className="profile-completion-track"
                  role="progressbar"
                  aria-valuenow={profileCompletionPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="profile-completion-bar"
                    style={{ width: `${profileCompletionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="profile-hero-btn-row">
                <button
                  type="button"
                  className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 size={15} />
                  <span>{isEditing ? 'Editing Profile' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* ================================================================
              Main Content Grid (2 Columns on Desktop)
              ================================================================ */}
          <form onSubmit={handleSaveChanges}>
            <div className="profile-grid-container">
              {/* LEFT COLUMN: Personal, Academic & About Me */}
              <div className="profile-grid-column">
                {/* 3. Personal Information Card */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-card-title-left">
                      <div className="profile-card-icon-wrap">
                        <User size={20} />
                      </div>
                      <div className="profile-card-title-group">
                        <h3 className="profile-card-title">Personal Information</h3>
                        <p className="profile-card-desc">
                          Basic identification and contact credentials
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-form-grid">
                    {/* Full Name */}
                    <div className="profile-form-group full-width">
                      <label htmlFor="fullName" className="profile-label">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleFieldChange}
                        placeholder="e.g. Alex Johnson"
                        className="profile-input"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="profile-form-group">
                      <label htmlFor="email" className="profile-label">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleFieldChange}
                        placeholder="name@college.edu"
                        className="profile-input"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="profile-form-group">
                      <label htmlFor="phone" className="profile-label">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleFieldChange}
                        placeholder="+91 98765 43210"
                        className="profile-input"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="profile-form-group">
                      <label htmlFor="dob" className="profile-label">
                        Date of Birth
                      </label>
                      <input
                        id="dob"
                        type="date"
                        name="dob"
                        value={profileData.dob}
                        onChange={handleFieldChange}
                        className="profile-input"
                      />
                    </div>

                    {/* Gender */}
                    <div className="profile-form-group">
                      <label htmlFor="gender" className="profile-label">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleFieldChange}
                        className="profile-select"
                      >
                        <option value="Prefer not to say">Prefer not to say</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Academic Information Card */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-card-title-left">
                      <div className="profile-card-icon-wrap">
                        <GraduationCap size={20} />
                      </div>
                      <div className="profile-card-title-group">
                        <h3 className="profile-card-title">Academic Information</h3>
                        <p className="profile-card-desc">
                          Current institution, degree program, and student index
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-form-grid">
                    {/* College / University */}
                    <div className="profile-form-group full-width">
                      <label htmlFor="college" className="profile-label">
                        College / University
                      </label>
                      <input
                        id="college"
                        type="text"
                        name="college"
                        value={profileData.college}
                        onChange={handleFieldChange}
                        placeholder="e.g. National Institute of Technology"
                        className="profile-input"
                      />
                    </div>

                    {/* Course */}
                    <div className="profile-form-group">
                      <label htmlFor="course" className="profile-label">
                        Course / Degree
                      </label>
                      <input
                        id="course"
                        type="text"
                        name="course"
                        value={profileData.course}
                        onChange={handleFieldChange}
                        placeholder="e.g. B.Tech / MCA / B.S."
                        className="profile-input"
                      />
                    </div>

                    {/* Department */}
                    <div className="profile-form-group">
                      <label htmlFor="department" className="profile-label">
                        Department
                      </label>
                      <input
                        id="department"
                        type="text"
                        name="department"
                        value={profileData.department}
                        onChange={handleFieldChange}
                        placeholder="e.g. Computer Science & Engineering"
                        className="profile-input"
                      />
                    </div>

                    {/* Year */}
                    <div className="profile-form-group">
                      <label htmlFor="year" className="profile-label">
                        Current Year
                      </label>
                      <input
                        id="year"
                        type="text"
                        name="year"
                        value={profileData.year}
                        onChange={handleFieldChange}
                        placeholder="e.g. 3rd Year"
                        className="profile-input"
                      />
                    </div>

                    {/* Semester */}
                    <div className="profile-form-group">
                      <label htmlFor="semester" className="profile-label">
                        Current Semester
                      </label>
                      <input
                        id="semester"
                        type="text"
                        name="semester"
                        value={profileData.semester}
                        onChange={handleFieldChange}
                        placeholder="e.g. 6th Semester"
                        className="profile-input"
                      />
                    </div>

                    {/* Student ID */}
                    <div className="profile-form-group full-width">
                      <label htmlFor="studentId" className="profile-label">
                        Student ID / Roll No.
                      </label>
                      <input
                        id="studentId"
                        type="text"
                        name="studentId"
                        value={profileData.studentId}
                        onChange={handleFieldChange}
                        placeholder="e.g. CS2023-089"
                        className="profile-input"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. About Me Card */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-card-title-left">
                      <div className="profile-card-icon-wrap">
                        <FileText size={20} />
                      </div>
                      <div className="profile-card-title-group">
                        <h3 className="profile-card-title">About Me</h3>
                        <p className="profile-card-desc">
                          Short professional biography for recruiters and hiring managers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <textarea
                      id="aboutMe"
                      name="aboutMe"
                      rows={4}
                      value={profileData.aboutMe}
                      onChange={handleFieldChange}
                      placeholder="Tell recruiters about yourself, your interests, skills, and career goals..."
                      className="profile-textarea"
                    />
                    <div className="profile-char-count">
                      {profileData.aboutMe ? profileData.aboutMe.length : 0} characters
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Skills, Resume & Professional Links */}
              <div className="profile-grid-column">
                {/* 5. Skills Section Card */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-card-title-left">
                      <div className="profile-card-icon-wrap">
                        <Sparkles size={20} />
                      </div>
                      <div className="profile-card-title-group">
                        <h3 className="profile-card-title">Skills</h3>
                        <p className="profile-card-desc">
                          Key competencies matched with internship listings
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--primary-plum)',
                        backgroundColor: 'var(--soft-lavender)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {profileData.skills.length} skills
                    </span>
                  </div>

                  <div className="profile-skills-box">
                    {/* Skills Chips Container */}
                    <div className="profile-skills-chip-list">
                      {profileData.skills.map((skill) => (
                        <span key={skill} className="profile-skill-chip">
                          <span>{skill}</span>
                          <button
                            type="button"
                            className="profile-skill-remove-btn"
                            onClick={() => handleRemoveSkill(skill)}
                            title={`Remove ${skill}`}
                            aria-label={`Remove skill ${skill}`}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}

                      {profileData.skills.length === 0 && (
                        <span
                          style={{
                            fontSize: '13px',
                            color: 'var(--muted-gray)',
                            padding: '6px',
                          }}
                        >
                          No skills added yet. Add your competencies below.
                        </span>
                      )}
                    </div>

                    {/* Add Skill Row */}
                    <div className="profile-skill-add-row">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value)
                          if (skillFeedback) setSkillFeedback('')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSkill()
                          }
                        }}
                        placeholder="Add a new skill (e.g. Docker, TypeScript)"
                        className="profile-input profile-skill-add-input"
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddSkill}
                      >
                        <Plus size={15} />
                        <span>Add</span>
                      </button>
                    </div>

                    {skillFeedback && (
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#b91c1c',
                          marginTop: '-8px',
                        }}
                      >
                        {skillFeedback}
                      </span>
                    )}
                  </div>
                </div>

                {/* 7. Resume Card */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-card-title-left">
                      <div className="profile-card-icon-wrap">
                        <FileText size={20} />
                      </div>
                      <div className="profile-card-title-group">
                        <h3 className="profile-card-title">Resume</h3>
                        <p className="profile-card-desc">
                          Curriculum vitae automatically attached to your applications
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-resume-box">
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      aria-label="Upload resume file"
                    />

                    {/* State A: No resume uploaded yet */}
                    {!profileData.resume ? (
                      <div className="profile-resume-empty-dropzone">
                        <div className="profile-resume-empty-icon">
                          <UploadCloud size={24} />
                        </div>
                        <h4 className="profile-resume-empty-title">No resume uploaded yet</h4>
                        <p className="profile-resume-empty-hint">
                          Supported format: PDF, DOC, DOCX up to 5MB
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={handleUploadButtonClick}
                          style={{ marginTop: '6px' }}
                        >
                          <UploadCloud size={15} />
                          <span>Upload Resume</span>
                        </button>
                      </div>
                    ) : (
                      /* State B: Resume already uploaded */
                      <div className="profile-resume-file-card">
                        <div className="profile-resume-file-left">
                          <div className="profile-resume-file-icon">
                            <FileCheck size={24} />
                          </div>
                          <div className="profile-resume-file-info">
                            <h4 className="profile-resume-filename">
                              {profileData.resume.name}
                            </h4>
                            <p className="profile-resume-filemeta">
                              {profileData.resume.size} • Uploaded {profileData.resume.uploadedAt}
                            </p>
                          </div>
                        </div>

                        <div className="profile-resume-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={handleUploadButtonClick}
                          >
                            Replace Resume
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={handleRemoveResume}
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--muted-gray)',
                              border: '1px solid rgba(67, 44, 69, 0.15)',
                            }}
                            title="Remove resume"
                            aria-label="Remove resume"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 8. Professional Links Card */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-card-title-left">
                      <div className="profile-card-icon-wrap">
                        <Globe size={20} />
                      </div>
                      <div className="profile-card-title-group">
                        <h3 className="profile-card-title">Professional Links</h3>
                        <p className="profile-card-desc">
                          Portfolios, code repositories, and networking profiles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-form-grid">
                    {/* GitHub */}
                    <div className="profile-form-group full-width">
                      <label htmlFor="github" className="profile-label">
                        GitHub Profile
                      </label>
                      <div className="profile-input-with-icon">
                        <span className="input-icon-prefix">
                          <GithubIcon size={16} />
                        </span>
                        <input
                          id="github"
                          type="url"
                          name="github"
                          value={profileData.github}
                          onChange={handleFieldChange}
                          placeholder="https://github.com/username"
                          className="profile-input"
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="profile-form-group full-width">
                      <label htmlFor="linkedin" className="profile-label">
                        LinkedIn Profile
                      </label>
                      <div className="profile-input-with-icon">
                        <span className="input-icon-prefix">
                          <LinkedinIcon size={16} />
                        </span>
                        <input
                          id="linkedin"
                          type="url"
                          name="linkedin"
                          value={profileData.linkedin}
                          onChange={handleFieldChange}
                          placeholder="https://linkedin.com/in/username"
                          className="profile-input"
                        />
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div className="profile-form-group full-width">
                      <label htmlFor="portfolio" className="profile-label">
                        Personal Portfolio / Website
                      </label>
                      <div className="profile-input-with-icon">
                        <span className="input-icon-prefix">
                          <Globe size={16} />
                        </span>
                        <input
                          id="portfolio"
                          type="url"
                          name="portfolio"
                          value={profileData.portfolio}
                          onChange={handleFieldChange}
                          placeholder="https://yourportfolio.com"
                          className="profile-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================
                9. Save Action Bar
                ================================================================ */}
            <div className="profile-save-action-bar">
              <p className="profile-save-note">
                <CheckCircle2 size={16} style={{ color: 'var(--primary-plum)' }} />
                <span>
                  Updates will instantly synchronize with your dashboard and active internship applications.
                </span>
              </p>

              <div className="profile-save-buttons-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelChanges}
                >
                  <RotateCcw size={15} />
                  <span>Reset Changes</span>
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default StudentProfile
