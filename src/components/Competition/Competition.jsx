import { useScrollReveal } from '../../hooks/useScrollReveal'
import Redact from '../Redact/Redact'
import {
  COMPETITION_STATS,
  COMPETITION_RULES,
  COMPETITION_CATEGORIES,
  COMPETITION_CONTACTS,
  REGISTRATION_URL,
} from '../../data/content'
import guidelinesPdf from '../../assets/rangam shortfilm competition details.pdf'
import competitionArt from '../../assets/motifs/motif-4.png'
import './Competition.css'

export default function Competition() {
  const headerRef = useScrollReveal()
  const bodyRef = useScrollReveal()

  return (
    <section className="competition" id="competition" data-cursor-theme="plum">
      <img className="competition-art" src={competitionArt} alt="" aria-hidden="true" />
      <div className="section-inner">
        <div ref={headerRef} className="competition-header reveal">
          <p className="kicker">04 / Short film competition</p>
          <h2 className="display">
            Submit your <Redact>evidence</Redact>.
          </h2>
          <p className="copy">
            Rangam's open call for original short films — under 30 minutes, in any language, from
            anyone willing to make a case for what cinema can hold. Ten entries are shortlisted by
            the jury for the final screening at the festival.
          </p>
        </div>

        <div className="competition-stats">
          {COMPETITION_STATS.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div ref={bodyRef} className="competition-grid reveal">
          <div className="rules-panel">
            <h3 className="panel-title">Rules &amp; regulations</h3>
            <ul className="rules-list">
              {COMPETITION_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="competition-aside">
            <div className="categories-box">
              <h3 className="panel-title">Jury categories</h3>
              <ul className="categories-list">
                {COMPETITION_CATEGORIES.map((cat) => (
                  <li key={cat}>{cat}</li>
                ))}
              </ul>
            </div>

            <div className="cta-box">
              <p className="cta-note">
                Full guidelines, disqualification terms, and submission format are in the official PDF.
              </p>
              <div className="cta-buttons">
                <a className="button primary" href={REGISTRATION_URL} target="_blank" rel="noreferrer">
                  Register · ₹699
                </a>
                <a className="button" href={guidelinesPdf} target="_blank" rel="noreferrer">
                  View guidelines (PDF)
                </a>
              </div>
              <div className="contact-list">
                {COMPETITION_CONTACTS.map((c) => (
                  <span key={c.name}>
                    {c.name} — <a href={`tel:+91${c.phone}`}>{c.phone}</a>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
