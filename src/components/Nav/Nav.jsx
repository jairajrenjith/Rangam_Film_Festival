import { useState } from 'react'
import { NAV_LINKS } from '../../data/content'
import { useNavScroll } from '../../hooks/useNavScroll'
import rangamMark from '../../assets/logos/logo_rangam.jpg'
import './Nav.css'

export default function Nav() {
  const scrolled = useNavScroll()
  const [open, setOpen] = useState(false)

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`} aria-label="Primary navigation">
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        <span className="brand-mark">
          <img src={rangamMark} alt="Rangam" />
        </span>
        <span>
          RANGAM
          <br />
          <span className="micro">CET Film Society</span>
        </span>
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