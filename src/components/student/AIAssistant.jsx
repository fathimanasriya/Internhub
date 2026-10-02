import { useEffect, useRef, useState } from 'react'
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
} from 'lucide-react'

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // ==========================================
  // GET STUDENT NAME
  // ==========================================

  const getStudentName = () => {
    try {
      const stored = localStorage.getItem('internhubStudent')

      if (stored) {
        const parsed = JSON.parse(stored)

        return (
          parsed.name ||
          parsed.fullName ||
          'there'
        )
      }
    } catch (error) {
      console.error('Unable to read student data:', error)
    }

    return 'there'
  }

  const [studentName] = useState(getStudentName)

  // ==========================================
  // INITIAL MESSAGE
  // ==========================================

  const getInitialMessages = () => [
    {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      text: `Hi ${studentName}! 👋 I'm your InternHub AI career assistant. How can I help you today?`,
    },
  ]

  // ==========================================
  // LOAD CHAT HISTORY
  // ==========================================

  const [messages, setMessages] = useState(() => {
    try {
      const savedChat = localStorage.getItem('internhubAIChat')

      if (savedChat) {
        const parsedChat = JSON.parse(savedChat)

        if (
          Array.isArray(parsedChat) &&
          parsedChat.length > 0
        ) {
          return parsedChat
        }
      }
    } catch (error) {
      console.error('Unable to load AI chat:', error)
    }

    return getInitialMessages()
  })

  const messagesEndRef = useRef(null)

  // ==========================================
  // SAVE CHAT
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        'internhubAIChat',
        JSON.stringify(messages)
      )
    } catch (error) {
      console.error('Unable to save AI chat:', error)
    }
  }, [messages])

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isTyping])

  // ==========================================
  // DEMO AI RESPONSE
  // ==========================================

  const getAIResponse = (question) => {
    const text = question.toLowerCase()

    if (
      text.includes('resume') ||
      text.includes('cv')
    ) {
      return `To improve your resume, focus on your technical skills, projects, internships, certifications, and achievements.

For a CSE student, clearly mention your programming languages, frameworks, databases, Git/GitHub experience, and important projects.`
    }

    if (
      text.includes('internship') ||
      text.includes('internships')
    ) {
      return `I can help you explore internships based on your skills, preferred role, location, and work mode.

You can also use the Find Internships page to search and filter opportunities that match your profile.`
    }

    if (
      text.includes('interview') ||
      text.includes('prepare')
    ) {
      return `For interview preparation, start with HR questions, technical fundamentals, project questions, and questions related to the internship role.

You can also practice explaining your projects clearly in 1–2 minutes.`
    }

    if (
      text.includes('cover letter') ||
      text.includes('coverletter')
    ) {
      return `I can help you create a professional cover letter.

A good cover letter should mention the internship role, why you're interested, your relevant skills, and what you can contribute to the company.`
    }

    if (
      text.includes('skill') ||
      text.includes('learn')
    ) {
      return `For a CSE student, focus on programming fundamentals, DSA, Git/GitHub, databases, web development, one strong framework, and practical projects.

Try to build projects while learning instead of only watching tutorials.`
    }

    if (
      text.includes('career') ||
      text.includes('guidance')
    ) {
      return `Build your career step by step.

Strengthen your programming fundamentals, choose a technical direction, build real projects, create a strong resume, practice interviews, and gain internship experience.`
    }

    return `I'm currently running in demo mode 🤖

I can help with internships, resumes, interviews, cover letters, skills, and career guidance.`
  }

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = (messageText = input) => {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isTyping) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmedMessage,
    }

    setMessages((previous) => [
      ...previous,
      userMessage,
    ])

    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: getAIResponse(trimmedMessage),
      }

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ])

      setIsTyping(false)
    }, 900)
  }

  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const quickActions = [
    {
      icon: '🔍',
      label: 'Find Internships',
      message: 'Help me find internships',
    },
    {
      icon: '📄',
      label: 'Improve My Resume',
      message: 'How can I improve my resume?',
    },
    {
      icon: '🎤',
      label: 'Interview Preparation',
      message: 'Help me prepare for an interview',
    },
    {
      icon: '✉️',
      label: 'Write a Cover Letter',
      message: 'Help me write a cover letter',
    },
    {
      icon: '🧠',
      label: 'Skills I Should Learn',
      message: 'What skills should I learn?',
    },
    {
      icon: '🎯',
      label: 'Career Guidance',
      message: 'Give me career guidance',
    },
  ]

  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const clearChat = () => {
    localStorage.removeItem('internhubAIChat')
    setMessages(getInitialMessages())
  }

  // ==========================================
  // KEYBOARD HANDLING
  // ==========================================

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      sendMessage()
    }
  }

  // ==========================================
  // COMPONENT
  // ==========================================

  return (
    <>
      {/* =====================================
          FLOATING AI BUTTON
      ====================================== */}

      <button
        type="button"
        className={`ai-floating-button ${isOpen ? 'ai-floating-button-open' : ''
          }`}
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        aria-label={
          isOpen
            ? 'Close InternHub AI Assistant'
            : 'Open InternHub AI Assistant'
        }
        title="InternHub AI"
      >
        {isOpen ? (
          <X size={25} strokeWidth={2} />
        ) : (
          <Sparkles size={26} strokeWidth={1.8} />
        )}

        {!isOpen && (
          <span className="ai-button-pulse"></span>
        )}
      </button>

      {/* =====================================
          CHATBOT PANEL
      ====================================== */}

      {isOpen && (
        <div
          className="ai-chat-panel"
          role="dialog"
          aria-label="InternHub AI Assistant"
        >
          {/* HEADER */}

          <div className="ai-chat-header">

            <div className="ai-header-left">

              <div className="ai-header-icon">
                <Sparkles size={19} />
              </div>

              <div className="ai-header-text">
                <h3>InternHub AI</h3>
                <span>
                  Your career assistant
                </span>
              </div>

            </div>

            <div className="ai-header-actions">

              <button
                type="button"
                className="ai-header-button"
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>

              <button
                type="button"
                className="ai-header-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
                title="Close"
              >
                <X size={19} />
              </button>

            </div>

          </div>

          {/* ONLINE STATUS */}

          <div className="ai-status-bar">
            <span className="ai-status-dot"></span>
            <span>AI Assistant is ready</span>
          </div>

          {/* MESSAGES */}

          <div className="ai-chat-messages">

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.sender === 'user'
                    ? 'ai-message-row user-message-row'
                    : 'ai-message-row'
                }
              >

                {message.sender === 'ai' && (
                  <div className="ai-message-avatar">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={
                    message.sender === 'user'
                      ? 'ai-message user-message'
                      : 'ai-message assistant-message'
                  }
                >
                  {message.text}
                </div>

              </div>

            ))}

            {/* TYPING INDICATOR */}

            {isTyping && (
              <div className="ai-message-row">

                <div className="ai-message-avatar">
                  <Bot size={15} />
                </div>

                <div className="ai-typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>
            )}

            <div ref={messagesEndRef}></div>

          </div>

          {/* QUICK ACTIONS */}

          {messages.length === 1 &&
            !isTyping && (

              <div className="ai-quick-actions">

                <p className="ai-quick-title">
                  Quick actions
                </p>

                <div className="ai-quick-grid">

                  {quickActions.map((action) => (

                    <button
                      key={action.label}
                      type="button"
                      className="ai-quick-button"
                      onClick={() =>
                        sendMessage(action.message)
                      }
                    >

                      <span className="ai-quick-icon">
                        {action.icon}
                      </span>

                      <span>
                        {action.label}
                      </span>

                    </button>

                  ))}

                </div>

              </div>

            )}

          {/* INPUT */}

          <div className="ai-input-wrapper">

            <textarea
              className="ai-input"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask InternHub AI..."
              rows={1}
              aria-label="Ask InternHub AI"
            />

            <button
              type="button"
              className="ai-send-button"
              onClick={() => sendMessage()}
              disabled={
                !input.trim() || isTyping
              }
              aria-label="Send message"
            >
              <Send size={17} />
            </button>

          </div>

          <p className="ai-demo-note">
            InternHub AI • Demo mode
          </p>

        </div>
      )}

      {/* =====================================
          CSS
      ====================================== */}

      <style>{`

        /* =====================================
           INTERNHUB AI
           Plum + Warm Gray Design System
        ====================================== */
        .ai-floating-button {
          position: fixed;
          right: 26px;
          bottom: 26px;

          width: 62px;
          height: 62px;

          border: 1px solid rgba(103, 64, 95, 0.25);
          border-radius: 50%;

          background: linear-gradient(
            145deg,
            #ffffff,
            #f0eaf0
          );

          color: #67405F;

          display: flex;
          align-items: center;  
          justify-content: center;

          cursor: pointer;

          box-shadow:
           0 8px 25px rgba(67, 44, 69, 0.18),
          0 2px 6px rgba(67, 44, 69, 0.10);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;

            z-index: 1000;
          }

        .ai-floating-button:hover {
          transform: translateY(-4px) scale(1.05);

          background: #67405F;
          color: #ffffff;

          box-shadow:
           0 12px 30px rgba(67, 44, 69, 0.28);
          }

        .ai-floating-button:active {
            transform: scale(0.96);
          }
        .ai-button-pulse {
          position: absolute;
          width: 10px;
          height: 10px;

          top: 7px;
          right: 7px;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 0 6px #ffffff,
            0 0 12px #d8bfd5,
            0 0 20px rgba(103, 64, 95, 0.65);

            animation: aiShine 1.8s ease-in-out infinite;
          }
          .ai-floating-button svg {
            filter:
              drop-shadow(0 0 3px rgba(103, 64, 95, 0.5))
              drop-shadow(0 0 7px rgba(103, 64, 95, 0.25));

            animation: aiSparkle 2s ease-in-out infinite;
          }

          @keyframes aiSparkle {
            0%,
            100% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.12);
            }
          }

        @keyframes aiShine {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.75);
          }

          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      }

        /* =====================================
           CHAT PANEL
        ====================================== */

        .ai-chat-panel {
          position: fixed;

          right: 24px;
          bottom: 96px;

          width: 380px;
          max-width: calc(100vw - 32px);

          height: 560px;
          max-height: calc(100vh - 120px);

          display: flex;
          flex-direction: column;

          background: #FFFFFF;

          border: 1px solid #E6DFE5;

          border-radius: 20px;

          overflow: hidden;

          z-index: 9998;

          box-shadow:
            0 24px 70px rgba(67, 44, 69, 0.20);

          animation: aiPanelOpen 0.25s ease-out;
        }

        @keyframes aiPanelOpen {

          from {
            opacity: 0;
            transform: translateY(15px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }

        /* =====================================
           HEADER
        ====================================== */

        .ai-chat-header {
          min-height: 76px;

          padding: 15px 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: #432C45;

          color: #FFFFFF;
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .ai-header-icon {
          width: 39px;
          height: 39px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: rgba(255, 255, 255, 0.13);

          color: #FFFFFF;
        }

        .ai-header-text h3 {
          margin: 0;

          font-size: 15px;
          font-weight: 700;
        }

        .ai-header-text span {
          display: block;

          margin-top: 3px;

          font-size: 11px;

          color: rgba(255, 255, 255, 0.72);
        }

        .ai-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ai-header-button {
          width: 34px;
          height: 34px;

          border: none;
          border-radius: 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: transparent;
          color: rgba(255, 255, 255, 0.8);

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .ai-header-button:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }

        /* =====================================
           STATUS
        ====================================== */

        .ai-status-bar {
          height: 32px;

          padding: 0 16px;

          display: flex;
          align-items: center;
          gap: 7px;

          background: #F7F5F2;

          border-bottom: 1px solid #EEE8EC;

          color: #6F686B;

          font-size: 10px;
        }

        .ai-status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #67405F;
        }

        /* =====================================
           MESSAGES
        ====================================== */

        .ai-chat-messages {
          flex: 1;

          overflow-y: auto;

          padding: 18px 15px;

          background: #FFFFFF;

          scrollbar-width: thin;
          scrollbar-color: #D9CED7 transparent;
        }

        .ai-chat-messages::-webkit-scrollbar {
          width: 5px;
        }

        .ai-chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .ai-chat-messages::-webkit-scrollbar-thumb {
          background: #D9CED7;
          border-radius: 10px;
        }

        .ai-message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;

          margin-bottom: 13px;

          animation: aiMessageIn 0.2s ease;
        }

        @keyframes aiMessageIn {

          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .user-message-row {
          justify-content: flex-end;
        }

        .ai-message-avatar {
          flex-shrink: 0;

          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #F0EAF0;

          color: #67405F;
        }

        .ai-message {
          max-width: 78%;

          padding: 10px 12px;

          border-radius: 14px;

          font-size: 12px;

          line-height: 1.55;

          white-space: pre-line;
        }

        .assistant-message {
          background: #F0EAF0;

          color: #252326;

          border-bottom-left-radius: 5px;
        }

        .user-message {
          background: #67405F;

          color: #FFFFFF;

          border-bottom-right-radius: 5px;
        }

        /* =====================================
           TYPING INDICATOR
        ====================================== */

        .ai-typing {
          display: flex;
          align-items: center;
          gap: 4px;

          padding: 11px 13px;

          border-radius: 14px;
          border-bottom-left-radius: 5px;

          background: #F0EAF0;
        }

        .ai-typing span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #67405F;

          animation: aiTyping 1.2s infinite;
        }

        .ai-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .ai-typing span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes aiTyping {

          0%,
          60%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }

          30% {
            opacity: 1;
            transform: translateY(-3px);
          }

        }

        /* =====================================
           QUICK ACTIONS
        ====================================== */

        .ai-quick-actions {
          padding: 0 15px 12px;

          background: #FFFFFF;
        }

        .ai-quick-title {
          margin: 0 0 8px;

          font-size: 10px;

          font-weight: 700;

          color: #6F686B;

          text-transform: uppercase;

          letter-spacing: 0.7px;
        }

        .ai-quick-grid {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 6px;
        }

        .ai-quick-button {
          min-height: 40px;

          padding: 7px 9px;

          display: flex;
          align-items: center;

          gap: 7px;

          border: 1px solid #E8E1E7;

          border-radius: 10px;

          background: #F7F5F2;

          color: #432C45;

          font-family: inherit;

          font-size: 10px;

          font-weight: 600;

          text-align: left;

          cursor: pointer;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .ai-quick-button:hover {
          border-color: #C9B6C5;

          background: #F0EAF0;

          transform: translateY(-1px);
        }

        .ai-quick-icon {
          font-size: 13px;
          flex-shrink: 0;
        }

        /* =====================================
           INPUT
        ====================================== */

        .ai-input-wrapper {
          min-height: 61px;

          padding: 10px 12px;

          display: flex;
          align-items: flex-end;
          gap: 8px;

          background: #FFFFFF;

          border-top: 1px solid #EEE8EC;
        }

        .ai-input {
          flex: 1;

          min-height: 40px;
          max-height: 90px;

          padding: 11px 12px;

          resize: none;

          border: 1px solid #DED5DC;

          border-radius: 12px;

          outline: none;

          background: #F7F5F2;

          color: #252326;

          font-family: inherit;

          font-size: 12px;

          line-height: 1.4;

          transition: border-color 0.2s ease,
                      box-shadow 0.2s ease;
        }

        .ai-input::placeholder {
          color: #9A9296;
        }

        .ai-input:focus {
          border-color: #67405F;

          box-shadow:
            0 0 0 3px rgba(103, 64, 95, 0.08);

          background: #FFFFFF;
        }

        .ai-send-button {
          width: 40px;
          height: 40px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 11px;

          background: #67405F;

          color: #FFFFFF;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .ai-send-button:hover:not(:disabled) {
          background: #432C45;

          transform: translateY(-2px);
        }

        .ai-send-button:disabled {
          opacity: 0.45;

          cursor: not-allowed;
        }

        /* =====================================
           FOOTER
        ====================================== */

        .ai-demo-note {
          margin: 0;

          padding: 0 12px 8px;

          background: #FFFFFF;

          color: #A19A9E;

          text-align: center;

          font-size: 9px;
        }

        /* =====================================
           RESPONSIVE
        ====================================== */

        @media (max-width: 600px) {

          .ai-floating-button {
            width: 54px;
            height: 54px;

            right: 16px;
            bottom: 16px;
          }

          .ai-chat-panel {
            right: 12px;
            bottom: 82px;

            width: calc(100vw - 24px);

            height: min(
              600px,
              calc(100vh - 105px)
            );

            max-height: none;

            border-radius: 18px;
          }

          .ai-chat-header {
            min-height: 70px;
          }

          .ai-quick-grid {
            grid-template-columns: 1fr;
          }

          .ai-quick-button {
            min-height: 37px;
          }

        }

        @media (max-width: 380px) {

          .ai-chat-panel {
            right: 8px;

            width: calc(100vw - 16px);

            bottom: 76px;
          }

          .ai-message {
            max-width: 84%;

            font-size: 11px;
          }

          .ai-header-text h3 {
            font-size: 14px;
          }

        }

      `}</style>
    </>
  )
}

export default AIAssistant
