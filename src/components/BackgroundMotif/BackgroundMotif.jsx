import './BackgroundMotif.css'

const MOTIFS = {
  reel: (
    <svg viewBox="0 0 400 400" fill="none">
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="34" stroke="currentColor" strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const cx = 200 + Math.cos(rad) * 82
        const cy = 200 + Math.sin(rad) * 82
        return <circle key={angle} cx={cx} cy={cy} r="26" stroke="currentColor" strokeWidth="1.5" />
      })}
    </svg>
  ),
  sprockets: (
    <svg viewBox="0 0 60 600" fill="none">
      <line x1="30" y1="0" x2="30" y2="600" stroke="currentColor" strokeWidth="1" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect
          key={i}
          x="14"
          y={i * 32 + 8}
          width="32"
          height="18"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  ),
  witness: (
    <svg viewBox="0 0 400 240" fill="none">
      <path
        d="M10 120C70 30 180 10 200 10C220 10 330 30 390 120C330 210 220 230 200 230C180 230 70 210 10 120Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="200" cy="120" r="58" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="120" r="16" fill="currentColor" />
    </svg>
  ),
  frame: (
    <svg viewBox="0 0 400 400" fill="none">
      <path d="M20 90V20H90" stroke="currentColor" strokeWidth="2" />
      <path d="M310 20H380V90" stroke="currentColor" strokeWidth="2" />
      <path d="M380 310V380H310" stroke="currentColor" strokeWidth="2" />
      <path d="M90 380H20V310" stroke="currentColor" strokeWidth="2" />
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
}

export default function BackgroundMotif({ variant = 'reel', className = '' }) {
  return (
    <div className={`motif motif--${variant} ${className}`} aria-hidden="true">
      {MOTIFS[variant]}
    </div>
  )
}