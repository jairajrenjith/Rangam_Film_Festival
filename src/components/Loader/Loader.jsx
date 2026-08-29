import { useEffect, useState } from 'react'
import cetfsMark from '../../assets/logos/logo_cetfs.png'
import rangamMark from '../../assets/logos/logo_rangam.png'
import dhwaniMark from '../../assets/logos/logo_dhwani.png'
import './Loader.css'

const BRANDS = [
  { key: 'cetfs', logo: cetfsMark, name: 'CET Film Society' },
  { key: 'rangam', logo: rangamMark, name: 'Rangam' },
  { key: 'dhwani', logo: dhwaniMark, name: "Dhwani '26" },
]

const STEP = 0.4 // seconds between each brand appearing

export default function Loader({ onDone }) {
  const [wiping, setWiping] = useState(false)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const holdTime = reduced ? 250 : 2200
    const t = setTimeout(() => setWiping(true), holdTime)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (!wiping) return
    const t = setTimeout(onDone, reduced ? 200 : 850)
    return () => clearTimeout(t)
  }, [wiping, onDone, reduced])

  return (
    <div
      className={`loader ${wiping ? 'is-wiping' : ''} ${reduced ? 'is-reduced' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      {/* A single curtain covering the screen, lifting straight up and
          off the top — the site is revealed underneath, from the
          bottom of the screen upward, as it rises. */}
      <div className="loader-curtain" />

      <div className="loader-content">
        <div className="loader-brandline">
          {BRANDS.map((brand, i) => (
            <div
              className="loader-brand"
              key={brand.key}
              style={{ animationDelay: `${0.15 + i * STEP}s` }}
            >
              {i > 0 && <span className="loader-pipe" aria-hidden="true">|</span>}
              <div className="loader-brand-item">
                <img className="loader-logo" src={brand.logo} alt="" />
                <span className="loader-brand-name">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}