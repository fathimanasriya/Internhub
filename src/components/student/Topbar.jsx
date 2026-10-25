import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, CheckCheck } from 'lucide-react'
import {
  getStudentNotifications,
  markStudentNotificationRead,
  markAllStudentNotificationsRead,
  getAuthToken,
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
 * Topbar Component
 * Slim header with mobile menu toggle, page title, notifications, and student avatar.
 */
function Topbar({ studentName, initials, onToggleSidebar, title = 'Student Dashboard' }) {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null)

  const fetchNotifications = () => {
    const token = getAuthToken()
    if (!token) return

    getStudentNotifications()
      .then((data) => {
        if (!Array.isArray(data)) return
        setNotifications(data)
      })
      .catch((err) => {
        console.warn('Could not load student notifications:', err.message)
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

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead && !notif.read) {
      try {
        await markStudentNotificationRead(notif.id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true, read: true } : n))
        )
      } catch (err) {
        console.warn('Could not mark notification read:', err.message)
      }
    }
    setShowNotifications(false)
    navigate('/student/applications')
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllStudentNotificationsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      )
    } catch (err) {
      console.warn('Could not mark all notifications read:', err.message)
    }
  }

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
        <div className="notification-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-indicator" />}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="dropdown-count">{unreadCount} unread</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary, #0284c7)',
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
              <ul className="dropdown-list">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const isUnread = !n.isRead && !n.read
                    return (
                      <li
                        key={n.id}
                        className={`dropdown-item ${isUnread ? 'dropdown-item-unread' : ''}`}
                        onClick={() => handleNotificationClick(n)}
                        style={{
                          cursor: 'pointer',
                          background: isUnread ? 'rgba(2, 132, 199, 0.05)' : undefined,
                        }}
                      >
                        <p className="dropdown-text" style={{ fontWeight: isUnread ? 600 : 400 }}>
                          <strong>{n.title}: </strong>
                          {n.message}
                        </p>
                        <span className="dropdown-time">{formatTimeAgo(n.createdAt)}</span>
                      </li>
                    )
                  })
                ) : (
                  <li className="dropdown-item" style={{ textAlign: 'center', color: '#888', padding: '16px' }}>
                    No notifications yet
                  </li>
                )}
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
