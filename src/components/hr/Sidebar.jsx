import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  Award,
  LogOut,
  X,
} from 'lucide-react'

/**
 * HR Sidebar Component
 * Fixed left navigation sidebar for the HR & Employer portal with responsive mobile drawer support.
 */
function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    // Clear any stored HR session data
    localStorage.removeItem('internhubHR')
    localStorage.removeItem('hrToken')
    // Redirect to HR login
    navigate('/hr/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/hr/company-profile', icon: Building2 },
    { label: 'Internships', path: '/hr/internships', icon: Briefcase },
    { label: 'Applications', path: '/hr/applications', icon: Users },
    { label: 'Interns', path: '/hr/interns', icon: UserCheck },
    { label: 'Progress', path: '/hr/progress', icon: TrendingUp },
    { label: 'Certificates', path: '/hr/certificates', icon: Award },
  ]

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="hr-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`hr-sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="hr-sidebar-header">
          <Link to="/" className="hr-sidebar-brand" onClick={onClose}>
            <span className="brand-intern">Intern</span>
            <span className="brand-hub">Hub</span>
            <span className="brand-portal-tag">HR PORTAL</span>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            className="hr-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Company Quick Badge */}
        <div className="hr-sidebar-company">
          <div className="company-avatar">
            <Building2 size={16} />
          </div>
          <div className="company-meta">
            <span className="company-name">TechNova Labs</span>
            <span className="company-tier">Enterprise Recruiter</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hr-sidebar-nav" aria-label="HR navigation">
          <ul className="hr-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path} className="hr-nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `hr-nav-link ${isActive ? 'hr-nav-link-active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <Icon size={18} className="hr-nav-icon" />
                    <span className="hr-nav-text">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Switcher & Logout */}
        <div className="hr-sidebar-footer">
          <button
            type="button"
            className="hr-nav-link hr-logout-btn"
            onClick={handleLogout}
            aria-label="Log out of HR portal"
          >
            <LogOut size={18} className="hr-nav-icon" />
            <span className="hr-nav-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
