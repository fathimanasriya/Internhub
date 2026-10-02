import { useState, useMemo } from 'react'
import {
  Building2,
  MapPin,
  Briefcase,
  User,
  Mail,
  Phone,
  IdCard,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Check,
  ShieldCheck,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import './HRCompanyProfile.css'

const DEFAULT_PROFILE = {
  hrName: 'Sarah Mitchell',
  officialEmail: 'sarah@novatech.com',
  phone: '+91 98765 12345',
  companyName: 'NovaTech Labs Pvt Ltd',
  companyLocation: 'Bengaluru, Karnataka',
  industry: 'Information Technology',
  designation: 'Talent Acquisition Lead',
  employeeId: 'EMP-2041',
}

/**
 * HRCompanyProfile Component
 * View and manage organization and HR recruiter profile information.
 */
function HRCompanyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Load saved profile data from localStorage with fallback to default demo data
  const [profileData, setProfileData] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRProfile')
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) }
      }
      // Check if registered in HRRegister
      const hrStored = localStorage.getItem('internhubHR')
      if (hrStored) {
        const parsed = JSON.parse(hrStored)
        return {
          ...DEFAULT_PROFILE,
          hrName: parsed.hrName || DEFAULT_PROFILE.hrName,
          officialEmail: parsed.officialEmail || DEFAULT_PROFILE.officialEmail,
          phone: parsed.phone || DEFAULT_PROFILE.phone,
          companyName: parsed.companyName || DEFAULT_PROFILE.companyName,
          companyLocation: parsed.companyLocation || DEFAULT_PROFILE.companyLocation,
          industry: parsed.industry || DEFAULT_PROFILE.industry,
          designation: parsed.designation || DEFAULT_PROFILE.designation,
          employeeId: parsed.employeeId || DEFAULT_PROFILE.employeeId,
        }
      }
    } catch (err) {
      console.error('Error loading stored HR profile:', err)
    }
    return DEFAULT_PROFILE
  })

  // Temporary edit buffer so Cancel restores previous values
  const [formData, setFormData] = useState(profileData)

  // Compute initials for avatar emblem
  const initials = useMemo(() => {
    const source = profileData.companyName || profileData.hrName || 'NT'
    return source
      .trim()
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [profileData.companyName, profileData.hrName])

  const handleStartEdit = () => {
    setFormData(profileData)
    setIsEditing(true)
    setSuccessMessage('')
  }

  const handleCancel = () => {
    setFormData(profileData)
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setProfileData(formData)
    try {
      localStorage.setItem('internhubHRProfile', JSON.stringify(formData))
    } catch (err) {
      console.error('Error saving HR profile to localStorage:', err)
    }
    setIsEditing(false)
    setSuccessMessage('Profile updated successfully.')
  }

  return (
    <div className="hr-dashboard-layout">
      {/* 1. Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="hr-main-content">
        <Topbar
          hrName={profileData.hrName}
          initials={initials}
          companyName={profileData.companyName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Company Profile"
        />

        <main className="hr-dashboard-container">
          {/* Page Title & Subtitle */}
          <div className="hr-profile-header-group">
            <h2 className="hr-profile-page-title">Company Profile</h2>
            <p className="hr-profile-page-subtitle">
              Manage your company and HR account information.
            </p>
          </div>

          {/* Success Message Banner */}
          {successMessage && (
            <div className="hr-profile-success-banner" role="status" aria-live="polite">
              <div className="hr-success-content">
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                className="hr-success-close"
                onClick={() => setSuccessMessage('')}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Profile Overview Card */}
          <section className="hr-profile-overview-card" aria-label="Company Overview">
            <div className="hr-profile-identity">
              <div className="hr-company-emblem" aria-hidden="true">
                {initials}
              </div>
              <div className="hr-profile-meta">
                <h3 className="hr-profile-company-title">
                  {isEditing ? formData.companyName || 'Company Name' : profileData.companyName}
                </h3>
                <div className="hr-profile-chips-row">
                  <span className="hr-profile-chip">
                    <Briefcase size={12} />
                    <span>{isEditing ? formData.industry || 'Industry' : profileData.industry}</span>
                  </span>
                  <span className="hr-profile-location-chip">
                    <MapPin size={13} />
                    <span>{isEditing ? formData.companyLocation || 'Location' : profileData.companyLocation}</span>
                  </span>
                  <span className="hr-profile-chip" style={{ background: '#ECFDF5', color: '#065F46' }}>
                    <ShieldCheck size={12} />
                    <span>Verified Employer</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="hr-profile-header-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="hr-btn-primary"
                  onClick={handleStartEdit}
                >
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="hr-btn-secondary"
                    onClick={handleCancel}
                  >
                    <X size={15} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    className="hr-btn-primary"
                    onClick={handleSave}
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Form wrapper for editable fields or read-only view */}
          <form onSubmit={handleSave} className="hr-profile-sections-wrapper">
            {/* ================================================================
                Section 1: Company Information
                ================================================================ */}
            <section className="hr-info-card" aria-labelledby="company-info-heading">
              <div className="hr-info-card-header">
                <div className="hr-info-card-title-group">
                  <div className="hr-info-icon-badge" aria-hidden="true">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 id="company-info-heading" className="hr-info-card-title">
                      Company Information
                    </h3>
                    <p className="hr-info-card-subtitle">
                      Organization profile details visible to prospective student candidates.
                    </p>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                /* Read-Only Mode */
                <div className="hr-fields-grid-3col">
                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <Building2 size={13} />
                      Company Name
                    </span>
                    <span className="hr-field-value">{profileData.companyName}</span>
                    <span className="hr-field-subtext">Registered Legal Entity</span>
                  </div>

                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <Briefcase size={13} />
                      Industry / Sector
                    </span>
                    <span className="hr-field-value">{profileData.industry}</span>
                    <span className="hr-field-subtext">Primary Corporate Domain</span>
                  </div>

                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <MapPin size={13} />
                      Company Location / City
                    </span>
                    <span className="hr-field-value">{profileData.companyLocation}</span>
                    <span className="hr-field-subtext">Headquarters / Primary Office</span>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="hr-form-grid">
                  <div className="hr-form-group">
                    <label htmlFor="companyName" className="hr-form-label">
                      Company Name <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <Building2 size={16} className="hr-form-input-icon" />
                      <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        className="hr-form-input"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. NovaTech Labs Pvt Ltd"
                      />
                    </div>
                  </div>

                  <div className="hr-form-group">
                    <label htmlFor="industry" className="hr-form-label">
                      Industry / Sector <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <Briefcase size={16} className="hr-form-input-icon" />
                      <input
                        id="industry"
                        type="text"
                        name="industry"
                        className="hr-form-input"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Information Technology"
                      />
                    </div>
                  </div>

                  <div className="hr-form-group">
                    <label htmlFor="companyLocation" className="hr-form-label">
                      Company Location / City <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <MapPin size={16} className="hr-form-input-icon" />
                      <input
                        id="companyLocation"
                        type="text"
                        name="companyLocation"
                        className="hr-form-input"
                        value={formData.companyLocation}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Bengaluru, Karnataka"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ================================================================
                Section 2: HR Information
                ================================================================ */}
            <section className="hr-info-card" aria-labelledby="hr-info-heading">
              <div className="hr-info-card-header">
                <div className="hr-info-card-title-group">
                  <div className="hr-info-icon-badge" aria-hidden="true">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 id="hr-info-heading" className="hr-info-card-title">
                      HR Information
                    </h3>
                    <p className="hr-info-card-subtitle">
                      Recruiter account credentials and official workplace contact details.
                    </p>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                /* Read-Only Mode */
                <div className="hr-fields-grid-3col">
                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <User size={13} />
                      HR / Recruiter Full Name
                    </span>
                    <span className="hr-field-value">{profileData.hrName}</span>
                    <span className="hr-field-subtext">Primary Account Holder</span>
                  </div>

                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <Mail size={13} />
                      Official Work Email
                    </span>
                    <span className="hr-field-value">{profileData.officialEmail}</span>
                    <span className="hr-field-subtext">Verified Business Email</span>
                  </div>

                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <Phone size={13} />
                      Contact Phone Number
                    </span>
                    <span className="hr-field-value">{profileData.phone}</span>
                    <span className="hr-field-subtext">Recruiter Direct Line</span>
                  </div>

                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <Briefcase size={13} />
                      Job Designation
                    </span>
                    <span className="hr-field-value">{profileData.designation}</span>
                    <span className="hr-field-subtext">Official Title</span>
                  </div>

                  <div className="hr-field-display-box">
                    <span className="hr-field-label">
                      <IdCard size={13} />
                      Employee / HR ID
                    </span>
                    <span className="hr-field-value">{profileData.employeeId}</span>
                    <span className="hr-field-subtext">Internal Organization Reference</span>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="hr-form-grid">
                  <div className="hr-form-group">
                    <label htmlFor="hrName" className="hr-form-label">
                      HR / Recruiter Full Name <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <User size={16} className="hr-form-input-icon" />
                      <input
                        id="hrName"
                        type="text"
                        name="hrName"
                        className="hr-form-input"
                        value={formData.hrName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Sarah Mitchell"
                      />
                    </div>
                  </div>

                  <div className="hr-form-group">
                    <label htmlFor="officialEmail" className="hr-form-label">
                      Official Work Email <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <Mail size={16} className="hr-form-input-icon" />
                      <input
                        id="officialEmail"
                        type="email"
                        name="officialEmail"
                        className="hr-form-input"
                        value={formData.officialEmail}
                        onChange={handleChange}
                        required
                        placeholder="e.g. sarah@novatech.com"
                      />
                    </div>
                  </div>

                  <div className="hr-form-group">
                    <label htmlFor="phone" className="hr-form-label">
                      Contact Phone Number <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <Phone size={16} className="hr-form-input-icon" />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        className="hr-form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. +91 98765 12345"
                      />
                    </div>
                  </div>

                  <div className="hr-form-group">
                    <label htmlFor="designation" className="hr-form-label">
                      Job Designation <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <Briefcase size={16} className="hr-form-input-icon" />
                      <input
                        id="designation"
                        type="text"
                        name="designation"
                        className="hr-form-input"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Talent Acquisition Lead"
                      />
                    </div>
                  </div>

                  <div className="hr-form-group">
                    <label htmlFor="employeeId" className="hr-form-label">
                      Employee / HR ID <span className="required-star">*</span>
                    </label>
                    <div className="hr-form-input-wrapper">
                      <IdCard size={16} className="hr-form-input-icon" />
                      <input
                        id="employeeId"
                        type="text"
                        name="employeeId"
                        className="hr-form-input"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. EMP-2041"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions Bar (Edit Mode Only) */}
              {isEditing && (
                <div className="hr-edit-actions-bar">
                  <button
                    type="button"
                    className="hr-btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hr-btn-primary"
                  >
                    <Check size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </section>
          </form>
        </main>
      </div>
    </div>
  )
}

export default HRCompanyProfile
