
/**
 * StatCard Component
 * Displays a single metric with icon, numeric value, and descriptive label.
 */
function StatCard({ icon: Icon, value, label, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          {Icon && <Icon className="stat-icon" size={24} />}
        </div>
      </div>
      <div className="stat-card-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  )
}

export default StatCard
