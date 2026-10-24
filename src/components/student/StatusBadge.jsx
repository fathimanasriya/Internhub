
/**
 * StatusBadge Component
 * Displays application status with themed styling adhering to the design system palette.
 * Statuses: 'Pending', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'
 */
function StatusBadge({ status }) {
  const normalizedStatus = (status || 'Pending').toLowerCase().replace(/\s+/g, '-')

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  )
}

export default StatusBadge
