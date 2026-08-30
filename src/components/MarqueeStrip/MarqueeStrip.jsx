import './MarqueeStrip.css'

const DEFAULT_TEXT = 'Rangam · cinema as historical memory against oppression · cet film society · witness / record / remember · '

export default function MarqueeStrip({ text = DEFAULT_TEXT, notch = 'dark', inverted = false }) {
  return (
    <div
      className={`strip${inverted ? ' strip--inverted' : ''}${notch === 'light' ? ' strip--notch-light' : ''}`}
      data-cursor-theme={inverted ? 'butter' : 'plum'}
      aria-hidden="true"
    >
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