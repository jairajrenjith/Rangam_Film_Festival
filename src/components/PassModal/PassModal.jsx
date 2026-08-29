import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { getMovieStatus, registerPass } from '../../services/passApi'
import Ticket from '../Ticket/Ticket'
import './PassModal.css'

export default function PassModal({ event, onClose, onRegistered }) {
  const { movieId, movie: movieLabel, date, time, venue } = event

  const [status, setStatus] = useState(null)
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  const ticketRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getMovieStatus(movieId)
      .then((data) => { if (!cancelled) setStatus(data) })
      .catch(() => { if (!cancelled) setError('Could not reach the pass server. Try again in a moment.') })
      .finally(() => { if (!cancelled) setChecking(false) })
    return () => { cancelled = true }
  }, [movieId])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const data = await registerPass(movieId, form.name.trim(), form.email.trim())

      if (!data.success) {
        setError(data.error || 'Could not register a pass right now.')
        if (data.closed) {
          setStatus((prev) => (prev ? { ...prev, closed: true, remaining: 0 } : prev))
        }
        return
      }

      setResult(data)
      onRegistered?.()
    } catch {
      setError('Could not reach the pass server. Try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = async () => {
    if (!ticketRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(ticketRef.current, { backgroundColor: '#ffec8e', scale: 2 })
      const link = document.createElement('a')
      link.download = `rangam-pass-${result.passId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="pass-modal-backdrop" onClick={onClose}>
      <div
        className="pass-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Get a pass for ${movieLabel}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="pass-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <p className="pass-modal-kicker">Screening pass</p>
        <h3 className="pass-modal-title">{movieLabel}</h3>

        {checking && <p className="pass-modal-note">Checking availability…</p>}

        {!checking && status && !status.success && (
          <p className="pass-modal-note pass-modal-note--error">
            Passes aren't available for this screening right now.
          </p>
        )}

        {!checking && status?.success && status.closed && !result && (
          <p className="pass-modal-note pass-modal-note--error">
            This screening is fully booked — all {status.maxPasses} passes are claimed.
          </p>
        )}

        {!checking && status?.success && !status.closed && !result && (
          <form className="pass-modal-form" onSubmit={handleSubmit}>
            <p className="pass-modal-note">{status.remaining} of {status.maxPasses} passes left.</p>
            <label>
              Name
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            {error && <p className="pass-modal-note pass-modal-note--error">{error}</p>}
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? 'Reserving…' : 'Get my pass'}
            </button>
          </form>
        )}

        {result && (
          <div className="pass-modal-result">
            {result.duplicate && (
              <p className="pass-modal-note">You already had a pass for this screening — here it is again.</p>
            )}
            <div className="pass-qr">
              <QRCodeSVG value={result.qrData} size={168} bgColor="transparent" fgColor="#ffec8e" />
            </div>
            <p className="pass-modal-name">{result.name || form.name}</p>
            <p className="pass-modal-id">{result.passId}</p>
            <button className="button primary" onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Preparing…' : 'Download pass'}
            </button>
            <p className="pass-modal-note">This pass is your entry — keep the downloaded image or this tab handy at the gate.</p>
          </div>
        )}
      </div>

      {result && (
        <div className="ticket-offscreen" aria-hidden="true">
          <Ticket
            ref={ticketRef}
            movie={movieLabel}
            date={date}
            time={time}
            venue={venue}
            name={result.name || form.name}
            passId={result.passId}
            qrData={result.qrData}
          />
        </div>
      )}
    </div>
  )
}