import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, ArrowLeft } from 'lucide-react'
import './StudentDashboard.css'
import Sidebar from '../../components/student/Sidebar'
import Topbar from '../../components/student/Topbar'
import { mockStudentProfile } from '../../data/studentMockData'

/**
 * StudentAIAssistant Placeholder Page
 * Route: /student/ai-assistant
 * Ready to be replaced with full AI Assistant features in future milestones.
 */
function StudentAIAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [studentName] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubStudent')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.name || parsed.fullName || 'Student'
      }
    } catch {
      // fallback
    }
    return mockStudentProfile.name || 'Student'
  })

  const initials = studentName
    .trim()
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="student-dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main-content">
        <Topbar
          studentName={studentName}
          initials={initials}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="AI Assistant"
        />

        <main className="dashboard-container">
          <div className="dashboard-card">
            <div className="empty-state-container">
              <div className="empty-state-icon">
                <Bot size={36} />
              </div>
              <h2 className="empty-state-title">AI Career Assistant</h2>
              <p className="empty-state-text">
                Your intelligent copilot for automated resume tailoring, cover letter generation, skill gap analysis, and mock interview practice is currently being prepared.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Link to="/student/dashboard" className="btn btn-primary">
                  <ArrowLeft size={16} /> Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentAIAssistant
