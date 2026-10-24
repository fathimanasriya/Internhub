import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Search,
  FileText,
  FolderArchive,
  TrendingUp,
  LogOut,
  X,
} from 'lucide-react'

/**
 * Sidebar Component
 * Fixed left navigation sidebar for the student portal with responsive mobile drawer support.
 */
function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    // Clear stored student session data
    localStorage.removeItem('internhubStudent')
    localStorage.removeItem('studentToken')
    // Navigate to student login
    navigate('/student/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Find Internships', path: '/student/internships', icon: Search },
    { label: 'My Applications', path: '/student/applications', icon: FileText },
    { label: 'My Documents', path: '/student/documents', icon: FolderArchive },
    { label: 'Internship Progress', path: '/student/progress', icon: TrendingUp },

  ]

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`student-sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={onClose}>
            <span className="brand-intern">Intern</span>
            <span className="brand-hub">Hub</span>
            <span className="brand-portal-tag">STUDENT</span>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <Icon size={18} className="nav-icon" />
                    <span className="nav-text">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout at bottom */}
        <div className="sidebar-footer">
          <button type="button" className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={18} className="nav-icon" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
