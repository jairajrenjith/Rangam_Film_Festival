import { useState } from 'react'
import { NAV_LINKS } from '../../data/content'
import { useNavScroll } from '../../hooks/useNavScroll'
import cetfsMark from '../../assets/logos/logo_cetfs.png'
import dhwaniMark from '../../assets/logos/logo_dhwani.png'
import './Nav.css'

export default function Nav() {
  const scrolled = useNavScroll()
  const [open, setOpen] = useState(false)

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`} data-cursor-theme="plum" aria-label="Primary navigation">
      <a className="nav-side nav-side--left" href="#top" onClick={() => setOpen(false)} aria-label="CET Film Society, home">
        <img src={cetfsMark} alt="CET Film Society" />
      </a>

      <div className="nav-center">
        <div className="nav-pill">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <a className="nav-side nav-side--right" href="https://dhwani.cet.ac.in" target="_blank" rel="noreferrer" aria-label="Dhwani">
        <img src={dhwaniMark} alt="Dhwani" />
      </a>

      <button
        className="menu"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`menu-icon ${open ? 'is-open' : ''}`} />
      </button>

      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}