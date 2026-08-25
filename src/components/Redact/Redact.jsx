import './Redact.css'

export default function Redact({ children }) {
  return (
    <span className="redact-wrap">
      <span className="redact-text">{children}</span>
      <span className="redact-cover" aria-hidden="true" />
    </span>
  )
}