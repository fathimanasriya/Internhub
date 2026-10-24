import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Search, CheckCircle, Clock, UserPlus, X } from 'lucide-react'

/**
 * HR Topbar Component
 * Header navigation bar for the HR portal with mobile drawer toggle, search, notification alerts, and recruiter profile.
 */
function Topbar({
  hrName = 'HR Administrator',
  initials = 'HR',
  companyName = 'TechNova Labs',
  onToggleSidebar,
  title = 'HR Dashboard',
  onSearch,
}) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  const notifications = [
    {
      id: 1,
      icon: UserPlus,
      text: 'Rohan Sharma applied for Software Development Intern',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      icon: CheckCircle,
      text: 'Priya Patel accepted offer for UI/UX Design Intern',
      time: '2h ago',
      unread: true,
    },
    {
      id: 3,
      icon: Clock,
      text: 'Milestone 2 review pending for Cloud & DevOps cohort',
      time: '5h ago',
      unread: false,
    },
  ]

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <header className="hr-topbar">
      <div className="hr-topbar-left">
        <button
          type="button"
          className="hr-hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu size={22} />
        </button>

        <div className="hr-title-group">
          <h1 className="hr-topbar-title">{title}</h1>
          <span className="hr-company-tag" title={companyName}>
            {companyName}
          </span>
        </div>
      </div>

      <div className="hr-topbar-right">
        {/* Search bar */}
        <form className="hr-search-form" onSubmit={handleSearchSubmit}>
          <Search size={16} className="hr-search-icon" />
          <input
            type="search"
            className="hr-search-input"
            placeholder="Search candidates, roles..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (onSearch) onSearch(e.target.value)
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="hr-search-clear"
              onClick={() => {
                setSearchQuery('')
                if (onSearch) onSearch('')
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Notifications Dropdown */}
        <div className="hr-notification-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`hr-icon-btn ${showNotifications ? 'hr-icon-btn-active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={19} />
            <span className="hr-notification-indicator" />
          </button>

          {showNotifications && (
            <div className="hr-notifications-dropdown" role="region" aria-label="Recent notifications">
              <div className="hr-dropdown-header">
                <div>
                  <span className="hr-dropdown-title">Activity Alerts</span>
                  <span className="hr-dropdown-subtitle">HR & Recruitment feed</span>
                </div>
                <span className="hr-dropdown-badge">2 new</span>
              </div>
              <ul className="hr-dropdown-list">
                {notifications.map((item) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.id}
                      className={`hr-dropdown-item ${item.unread ? 'item-unread' : ''}`}
                    >
                      <div className="hr-notif-icon">
                        <Icon size={15} />
                      </div>
                      <div className="hr-notif-content">
                        <p className="hr-notif-text">{item.text}</p>
                        <span className="hr-notif-time">{item.time}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Recruiter Profile Avatar */}
        <div className="hr-topbar-profile" title={`Signed in as ${hrName}`}>
          <div className="hr-user-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="hr-user-info">
            <span className="hr-user-name">{hrName}</span>
            <span className="hr-user-role">Talent Acquisition Lead</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
