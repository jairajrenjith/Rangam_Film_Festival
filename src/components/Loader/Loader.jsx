import { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader({ onDone }) {
  const [count, setCount] = useState(3)
  const [wiping, setWiping] = useState(false)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced || count <= 1) return
    const t = setTimeout(() => setCount((c) => c - 1), 520)
    return () => clearTimeout(t)
  }, [count, reduced])

  useEffect(() => {
    const holdTime = reduced ? 250 : 1850
    const t = setTimeout(() => setWiping(true), holdTime)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (!wiping) return
    const t = setTimeout(onDone, reduced ? 200 : 780)
    return () => clearTimeout(t)
  }, [wiping, onDone, reduced])

  return (
    <div
      className={`loader ${wiping ? 'is-wiping' : ''} ${reduced ? 'is-reduced' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="loader-panel loader-panel--left" />
      <div className="loader-panel loader-panel--right" />
      <div className="loader-content">
        <div className="loader-sprockets" />
        <div className="loader-count">
          <svg className="loader-ring" viewBox="0 0 64 64">
            <circle className="ring-bg" cx="32" cy="32" r="28" />
            <circle className="ring-fg" cx="32" cy="32" r="28" />
          </svg>
          <span className="loader-count-num">{count}</span>
        </div>
        <p className="loader-label">CET FILM SOCIETY<br />Opening the archive</p>
      </div>
    </div>
  )
}