import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'

/**
 * Topbar Component
 * Slim header with mobile menu toggle, page title, notifications, and student avatar.
 */
function Topbar({ studentName, initials, onToggleSidebar, title = 'Student Dashboard' }) {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: 'TechNova Solutions viewed your application', time: '10m ago' },
    { id: 2, text: 'Interview shortlisted for Stratum Analytics', time: '2h ago' },
    { id: 3, text: 'New internship matching your skills: Vanguard Studios', time: '1d ago' },
  ]

  return (
    <header className="student-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        {/* Notification Bell */}
        <div className="notification-wrapper">
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notification-indicator" />
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications</span>
                <span className="dropdown-count">{notifications.length} new</span>
              </div>
              <ul className="dropdown-list">
                {notifications.map((n) => (
                  <li key={n.id} className="dropdown-item">
                    <p className="dropdown-text">{n.text}</p>
                    <span className="dropdown-time">{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Student Profile Info & Avatar */}
        <div className="topbar-user">
          <div className="user-avatar" title={studentName}>
            {initials || studentName.slice(0, 2).toUpperCase()}
          </div>
          <span className="user-name">{studentName}</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar
