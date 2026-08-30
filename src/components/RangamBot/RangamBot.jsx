import { useEffect, useRef, useState } from 'react'
import neuraCetLogo from '../../assets/logos/logo_neuracet.png'
import './RangamBot.css'

const QUICK_QUESTIONS = [
  'What is Rangam?',
  "What's this year's theme?",
  'When is it happening?',
  'How do I get a pass?',
]

const GREETING = "Ask me anything about Rangam — the theme, dates, passes, past editions. I'll only tell you what's actually confirmed."

const EYE = { cx: 26, cy: 34, r: 5, pupilR: 2, travel: 2.4 }
const EYE_RIGHT_CX = 38

export default function RangamBot() {
  const [open, setOpen] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [messages, setMessages] = useState([{ role: 'bot', text: GREETING }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [pupil, setPupil] = useState({ x: 0, y: 0 })

  const floatRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Eyes track the pointer a little, so the bot feels like it's actually
  // looking at you instead of sitting there dead-eyed.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const handleMove = (e) => {
      const el = floatRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      const clamped = Math.min(EYE.travel, dist / 40)
      setPupil({ x: (dx / dist) * clamped, y: (dy / dist) * clamped })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, sending, open])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setMessages((m) => [...m, { role: 'user', text: trimmed }])
    setInput('')
    setSending(true)
    try {
      const res = await fetch('/api/rangam-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'bot', text: data.reply || "Couldn't find that — check the site directly." }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: "Couldn't reach the archive — try again in a bit." }])
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const releasePress = () => setPressed(false)

  return (
    <div className="rb" data-cursor-theme="plum">
      {open && (
        <div className="rb-panel" data-cursor-theme="butter" role="dialog" aria-label="Ask Rangam Bot">
          <div className="rb-panel-head">
            <span>Ask Rangam Bot</span>
            <button className="rb-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="rb-quick">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} className="rb-quick-btn" onClick={() => sendMessage(q)} disabled={sending}>
                {q}
              </button>
            ))}
          </div>

          <div className="rb-list" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`rb-msg rb-msg--${m.role}`}>{m.text}</div>
            ))}
            {sending && (
              <div className="rb-msg rb-msg--bot rb-msg--typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="rb-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="rb-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={sending}
            />
            <button className="rb-send" type="submit" disabled={sending || !input.trim()} aria-label="Send">➤</button>
          </form>

          <div className="rb-credit">
            <img src={neuraCetLogo} alt="" className="rb-credit-logo" aria-hidden="true" />
            <span>Powered by NeuraCET</span>
          </div>
        </div>
      )}

      <div className="rb-float" ref={floatRef}>
        <button
          className={`rb-toggle${pressed ? ' is-pressed' : ''}`}
          onClick={() => setOpen((v) => !v)}
          onMouseDown={() => setPressed(true)}
          onMouseUp={releasePress}
          onMouseLeave={releasePress}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={releasePress}
          aria-expanded={open}
          aria-label={open ? 'Close Rangam bot' : 'Ask the Rangam bot a question'}
        >
          <span className="rb-pulse" aria-hidden="true" />
          <svg className="rb-face" viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
            <line x1="32" y1="18" x2="32" y2="9" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
            <circle className="rb-antenna" cx="32" cy="7" r="4" fill="var(--paper)" />
            <rect x="13" y="18" width="38" height="30" rx="11" fill="var(--paper)" />
            <circle cx={EYE.cx} cy={EYE.cy} r={EYE.r} fill="var(--ink)" />
            <circle cx={EYE_RIGHT_CX} cy={EYE.cy} r={EYE.r} fill="var(--ink)" />
            <circle cx={EYE.cx + pupil.x} cy={EYE.cy + pupil.y} r={EYE.pupilR} fill="var(--paper)" />
            <circle cx={EYE_RIGHT_CX + pupil.x} cy={EYE.cy + pupil.y} r={EYE.pupilR} fill="var(--paper)" />
          </svg>
        </button>
      </div>
    </div>
  )
}
