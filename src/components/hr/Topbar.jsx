import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, CheckCircle, Clock, UserPlus, X, CheckCheck } from 'lucide-react'
import {
  getHrNotifications,
  markHrNotificationRead,
  markAllHrNotificationsRead,
  getHrAuthToken,
} from '../../services/api'

function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now'
  try {
    const diffMs = Date.now() - new Date(dateString).getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 7) return `${diffDay}d ago`
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Recently'
  }
}

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
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null)

  const fetchNotifications = () => {
    const token = getHrAuthToken()
    if (!token) return

    getHrNotifications()
      .then((data) => {
        if (!Array.isArray(data)) return
        setNotifications(data)
      })
      .catch((err) => {
        console.warn('Could not load HR notifications:', err.message)
      })
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
    }
  }, [showNotifications])

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead && !notif.read) {
      try {
        await markHrNotificationRead(notif.id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true, read: true } : n))
        )
      } catch (err) {
        console.warn('Could not mark HR notification read:', err.message)
      }
    }
    setShowNotifications(false)
    navigate('/hr/applications')
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllHrNotificationsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      )
    } catch (err) {
      console.warn('Could not mark all HR notifications read:', err.message)
    }
  }

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
            {unreadCount > 0 && <span className="hr-notification-indicator" />}
          </button>

          {showNotifications && (
            <div className="hr-notifications-dropdown" role="region" aria-label="Recent notifications">
              <div className="hr-dropdown-header">
                <div>
                  <span className="hr-dropdown-title">Activity Alerts</span>
                  <span className="hr-dropdown-subtitle">HR & Recruitment feed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="hr-dropdown-badge">{unreadCount} unread</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--hr-primary-plum, #67405F)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: '2px 4px',
                      }}
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                </div>
              </div>
              <ul className="hr-dropdown-list">
                {notifications.length > 0 ? (
                  notifications.map((item) => {
                    const isUnread = !item.isRead && !item.read
                    return (
                      <li
                        key={item.id}
                        className={`hr-dropdown-item ${isUnread ? 'item-unread' : ''}`}
                        onClick={() => handleNotificationClick(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="hr-notif-icon">
                          <UserPlus size={15} />
                        </div>
                        <div className="hr-notif-content">
                          <p className="hr-notif-text" style={{ fontWeight: isUnread ? 600 : 400 }}>
                            <strong>{item.title}: </strong>
                            {item.message}
                          </p>
                          <span className="hr-notif-time">{formatTimeAgo(item.createdAt)}</span>
                        </div>
                      </li>
                    )
                  })
                ) : (
                  <li className="hr-dropdown-item" style={{ textAlign: 'center', color: '#888', padding: '16px' }}>
                    No alerts yet
                  </li>
                )}
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
