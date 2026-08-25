import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { checkinPass } from '../services/passApi'
import './CheckIn.css'

const SCANNER_ID = 'rangam-checkin-scanner'

export default function CheckIn() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const lockRef = useRef(false)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(SCANNER_ID, { fps: 10, qrbox: 260 }, false)
    scanner.render(handleScan, () => {})
    return () => { scanner.clear().catch(() => {}) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScan = async (decodedText) => {
    if (lockRef.current) return
    lockRef.current = true
    setBusy(true)
    setError('')

    try {
      // Expected payload: RANGAM|PASS|<passId>
      const parts = decodedText.split('|')
      const passId = parts.length >= 3 ? parts[2] : decodedText

      const data = await checkinPass(passId)

      if (!data.success) {
        setError(data.error || 'Could not check in this pass.')
        setResult(null)
      } else {
        setResult(data)
      }
    } catch {
      setError('Could not reach the pass server.')
      setResult(null)
    } finally {
      setBusy(false)
      setTimeout(() => { lockRef.current = false }, 2000)
    }
  }

  return (
    <div className="checkin-page">
      <div className="checkin-inner">
        <p className="checkin-kicker">Rangam · Door check-in</p>
        <h1 className="checkin-title">Scan pass</h1>

        <div id={SCANNER_ID} className="checkin-scanner" />

        {busy && <p className="checkin-note">Checking…</p>}
        {error && <p className="checkin-note checkin-note--error">{error}</p>}

        {result && (
          <div className={`checkin-result ${result.alreadyCheckedIn ? 'is-warning' : 'is-ok'}`}>
            <p className="checkin-result-status">
              {result.alreadyCheckedIn ? 'Already checked in' : 'Checked in'}
            </p>
            <p className="checkin-result-name">{result.name}</p>
            <p className="checkin-result-movie">{result.movie} · {result.passId}</p>
          </div>
        )}
      </div>
    </div>
  )
}