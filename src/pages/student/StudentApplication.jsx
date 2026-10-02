import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    Upload,
    FileText,
    CheckCircle2,
} from 'lucide-react'

import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'
import { sampleInternships } from '../../data/internshipsData'

function StudentApplication() {
    const navigate = useNavigate()
    const { internshipId } = useParams()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)

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

    const [formData, setFormData] = useState({
        fullName: studentName,
        email: '',
        phone: '',
        college: '',
        course: '',
        department: '',
        year: '',
        semester: '',
        studentId: '',
        cgpa: '',
        skills: '',
        whyInternship: '',
        availability: '',
        workMode: '',
        declaration: false,
    })

    const [resume, setResume] = useState(null)
    const [additionalDocs, setAdditionalDocs] = useState([])

    const internship = sampleInternships.find(
        (item) => String(item.id) === String(internshipId)
    )

    const initials = studentName
        .trim()
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleResumeChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            alert('Resume must be smaller than 5 MB.')
            return
        }

        setResume(file)
    }

    const handleAdditionalDocsChange = (e) => {
        const files = Array.from(e.target.files || [])
        setAdditionalDocs(files)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const existingApplications = JSON.parse(
            localStorage.getItem('internhubApplications') || '[]'
        )

        const alreadyApplied = existingApplications.some(
            (application) =>
                String(application.internshipId) === String(internshipId) &&
                application.studentName === studentName
        )

        if (alreadyApplied) {
            alert('You have already applied for this internship.')
            return
        }

        const application = {
            id: Date.now(),
            internshipId,
            internshipTitle: internship?.title || 'Internship',
            company: internship?.company || 'Company',
            studentName,
            ...formData,
            resumeName: resume?.name || '',
            additionalDocumentNames: additionalDocs.map((file) => file.name),
            status: 'Applied',
            submittedAt: new Date().toISOString(),
        }

        localStorage.setItem(
            'internhubApplications',
            JSON.stringify([...existingApplications, application])
        )

        setSubmitted(true)
    }

    if (!internship) {
        return (
            <div className="student-dashboard-layout">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="dashboard-main-content">
                    <Topbar
                        studentName={studentName}
                        initials={initials}
                        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        title="Application"
                    />

                    <main className="dashboard-container">
                        <div className="dashboard-card">
                            <h2>Internship not found</h2>
                            <p>
                                The internship you are trying to apply for could not be found.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/student/internships')}
                            >
                                <ArrowLeft size={16} />
                                Back to Internships
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="student-dashboard-layout">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="dashboard-main-content">
                    <Topbar
                        studentName={studentName}
                        initials={initials}
                        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        title="Application Submitted"
                    />

                    <main className="dashboard-container">
                        <div className="dashboard-card">
                            <div className="empty-state-container">
                                <div className="empty-state-icon">
                                    <CheckCircle2 size={40} />
                                </div>

                                <h2 className="empty-state-title">
                                    Application Submitted!
                                </h2>

                                <p className="empty-state-text">
                                    Your application for <strong>{internship.title}</strong> at{' '}
                                    <strong>{internship.company}</strong> has been submitted
                                    successfully.
                                </p>

                                <p className="empty-state-text">
                                    Application status: <strong>Applied</strong>
                                </p>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        marginTop: '20px',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate('/student/applications')}
                                    >
                                        View My Applications
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/student/internships')}
                                    >
                                        Find More Internships
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="student-dashboard-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="dashboard-main-content">
                <Topbar
                    studentName={studentName}
                    initials={initials}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    title="Apply for Internship"
                />

                <main className="dashboard-container">

                    {/* Internship Summary */}

                    <div className="dashboard-card">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/student/internships')}
                            style={{ marginBottom: '20px' }}
                        >
                            <ArrowLeft size={16} />
                            Back to Internships
                        </button>

                        <div style={{ marginBottom: '25px' }}>
                            <h2>{internship.title}</h2>

                            <p style={{ marginTop: '8px' }}>
                                <strong>{internship.company}</strong>
                            </p>

                            <p style={{ marginTop: '8px' }}>
                                {internship.location} • {internship.duration}
                            </p>
                        </div>
                    </div>

                    {/* Application Form */}

                    <form onSubmit={handleSubmit}>

                        {/* Personal Information */}

                        <div className="dashboard-card" style={{ marginTop: '20px' }}>
                            <h2>Personal Information</h2>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Academic Information */}

                        <div className="dashboard-card" style={{ marginTop: '20px' }}>
                            <h2>Academic Information</h2>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>College *</label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Course *</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Department *</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Year *</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Semester *</label>
                                    <select
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="S1">S1</option>
                                        <option value="S2">S2</option>
                                        <option value="S3">S3</option>
                                        <option value="S4">S4</option>
                                        <option value="S5">S5</option>
                                        <option value="S6">S6</option>
                                        <option value="S7">S7</option>
                                        <option value="S8">S8</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Student ID *</label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>CGPA</label>
                                    <input
                                        type="number"
                                        name="cgpa"
                                        value={formData.cgpa}
                                        onChange={handleChange}
                                        min="0"
                                        max="10"
                                        step="0.01"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Skills & Motivation */}

                        <div className="dashboard-card" style={{ marginTop: '20px' }}>
                            <h2>Skills & Motivation</h2>

                            <div className="form-group">
                                <label>Skills *</label>
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Example: Java, React, MySQL, Python"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Why do you want to join this internship? *</label>
                                <textarea
                                    name="whyInternship"
                                    value={formData.whyInternship}
                                    onChange={handleChange}
                                    placeholder="Tell the company why you are interested..."
                                    rows="5"
                                    required
                                />
                            </div>
                        </div>

                        {/* Internship Preferences */}

                        <div className="dashboard-card" style={{ marginTop: '20px' }}>
                            <h2>Internship Preferences</h2>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>Availability *</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Availability</option>
                                        <option value="Immediately">Immediately</option>
                                        <option value="Within 1 week">Within 1 week</option>
                                        <option value="Within 2 weeks">Within 2 weeks</option>
                                        <option value="Within 1 month">Within 1 month</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Preferred Work Mode *</label>
                                    <select
                                        name="workMode"
                                        value={formData.workMode}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Work Mode</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                        {/* Documents */}

                        <div className="dashboard-card" style={{ marginTop: '20px' }}>
                            <h2>Documents</h2>

                            <div className="form-group">
                                <label>Resume *</label>

                                <label
                                    className="upload-box"
                                    htmlFor="resume"
                                >
                                    <Upload size={24} />
                                    <span>
                                        {resume ? resume.name : 'Upload Resume'}
                                    </span>
                                    <small>PDF, DOC or DOCX • Maximum 5 MB</small>
                                </label>

                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeChange}
                                    required
                                    hidden
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '25px' }}>
                                <label>Additional Documents</label>

                                <label
                                    className="upload-box"
                                    htmlFor="additionalDocs"
                                >
                                    <FileText size={24} />
                                    <span>
                                        {additionalDocs.length > 0
                                            ? `${additionalDocs.length} file(s) selected`
                                            : 'Upload Certificates / Other Documents'}
                                    </span>
                                    <small>
                                        PDF, DOC, DOCX, JPG or PNG
                                    </small>
                                </label>

                                <input
                                    id="additionalDocs"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    multiple
                                    onChange={handleAdditionalDocsChange}
                                    hidden
                                />

                                {additionalDocs.length > 0 && (
                                    <ul style={{ marginTop: '10px' }}>
                                        {additionalDocs.map((file) => (
                                            <li key={file.name}>{file.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Declaration */}

                        <div className="dashboard-card" style={{ marginTop: '20px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'flex-start',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="declaration"
                                    checked={formData.declaration}
                                    onChange={handleChange}
                                    required
                                />

                                <span>
                                    I confirm that the information provided in this application
                                    is accurate and complete.
                                </span>
                            </label>
                        </div>

                        {/* Submit */}

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '20px',
                                marginBottom: '40px',
                            }}
                        >
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Submit Application
                            </button>
                        </div>

                    </form>
                </main>
            </div>
        </div>
    )
}

export default StudentApplication

