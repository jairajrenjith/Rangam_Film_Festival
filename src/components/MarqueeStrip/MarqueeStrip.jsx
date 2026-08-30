import './MarqueeStrip.css'

const DEFAULT_TEXT = 'Rangam · cinema as historical memory against oppression · cet film society · witness / record / remember · '

export default function MarqueeStrip({ text = DEFAULT_TEXT, notch = 'dark' }) {
  return (
    <div className={`strip${notch === 'light' ? ' strip--notch-light' : ''}`} data-cursor-theme="plum" aria-hidden="true">
      <div className="strip-track">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  )
}