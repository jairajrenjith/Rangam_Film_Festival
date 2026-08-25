import './MarqueeStrip.css'

const TEXT = 'Rangam · cinema as historical memory against oppression · cet film society · witness / record / remember · '

export default function MarqueeStrip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-track">
        <span>{TEXT}</span>
        <span>{TEXT}</span>
      </div>
    </div>
  )
}