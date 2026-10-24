import { useState } from 'react'
import { MapPin, Clock, Banknote, Check, ArrowUpRight } from 'lucide-react'

/**
 * InternshipCard Component
 * Displays a recommended internship opportunity with company details, stipend, tags, and actions.
 */
function InternshipCard({ internship, onSelectDetails }) {
  const [applied, setApplied] = useState(false)

  const handleApply = (e) => {
    e.stopPropagation()
    // Simulated apply action - in future connected to backend API
    setApplied(true)
  }

  return (
    <div className="internship-card">
      <div className="internship-card-header">
        <div className="company-avatar">
          {internship.companyInitial || internship.company?.charAt(0) || 'I'}
        </div>
        <div className="internship-meta">
          <span className="internship-company">{internship.company}</span>
          <h3 className="internship-role">{internship.role}</h3>
        </div>
      </div>

      <div className="internship-details-list">
        <div className="detail-item">
          <MapPin size={15} className="detail-icon" />
          <span>{internship.location}</span>
        </div>
        <div className="detail-item">
          <Clock size={15} className="detail-icon" />
          <span>{internship.duration}</span>
        </div>
        <div className="detail-item">
          <Banknote size={15} className="detail-icon" />
          <span className="stipend-text">{internship.stipend}</span>
        </div>
      </div>

      {internship.description && (
        <p className="internship-description">{internship.description}</p>
      )}

      {internship.skills && internship.skills.length > 0 && (
        <div className="skills-tags-container">
          {internship.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="internship-card-footer">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onSelectDetails && onSelectDetails(internship)}
        >
          View Details
        </button>
        <button
          type="button"
          className={`btn btn-sm ${applied ? 'btn-applied' : 'btn-primary'}`}
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? (
            <>
              <Check size={14} /> Applied
            </>
          ) : (
            <>
              Apply Now <ArrowUpRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default InternshipCard
