import { Link } from 'react-router-dom'
import { FileQuestion, ArrowRight } from 'lucide-react'
import StatusBadge from './StatusBadge'

/**
 * ApplicationsTable Component
 * Shows recent internship applications with statuses and responsive design.
 */
function ApplicationsTable({ applications = [] }) {
  const hasApplications = applications && applications.length > 0

  return (
    <div className="dashboard-card applications-section">
      <div className="card-header">
        <div>
          <h2 className="card-title">Recent Applications</h2>
          <p className="card-subtitle">Keep track of your internship submissions and reviews</p>
        </div>
        <Link to="/student/applications" className="card-action-link">
          <span>View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {!hasApplications ? (
        <div className="empty-state-container">
          <div className="empty-state-icon">
            <FileQuestion size={40} />
          </div>
          <h3 className="empty-state-title">No applications yet</h3>
          <p className="empty-state-text">
            You haven't submitted any internship applications yet. Explore recommended opportunities
            and apply to start your career journey.
          </p>
          <Link to="/student/internships" className="btn btn-primary empty-state-btn">
            Browse Internships
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="table-row">
                  <td className="company-cell">
                    <div className="company-badge">
                      {app.companyLogo || app.company?.charAt(0) || 'C'}
                    </div>
                    <div className="company-info">
                      <span className="company-name">{app.company}</span>
                      {app.location && (
                        <span className="company-location">{app.location}</span>
                      )}
                    </div>
                  </td>
                  <td className="role-cell">
                    <span className="role-title">{app.role}</span>
                    {app.stipend && <span className="role-meta">{app.stipend}</span>}
                  </td>
                  <td className="date-cell">
                    <span className="date-text">
                      {new Date(app.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="status-cell">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ApplicationsTable
