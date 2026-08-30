import { useScrollReveal } from '../../hooks/useScrollReveal'
import Redact from '../Redact/Redact'
import aboutArt from '../../assets/motifs/motif-1.png'
import './About.css'

export default function About() {
  const ref = useScrollReveal()

  return (
    <section className="about" id="rangam">
      <img className="about-art" src={aboutArt} alt="" aria-hidden="true" />
      <div ref={ref} className="section-inner about-grid reveal">
        <div>
          <p className="kicker">01 / This is Rangam</p>
          <h2 className="display">
            A gathering around the <Redact>evidence</Redact> cinema leaves behind.
          </h2>
          <p className="copy">
            Rangam is CET Film Society's annual celebration of cinema: a place to encounter films
            beyond the ordinary, sit with difficult histories, and talk long after the credits fade.
          </p>
        </div>
        <aside className="about-aside">
          Not just a film fest.
          <br />
          Each edition is a temporary archive: made by students, held in common, and carried forward
          by everyone who enters the dark with us.
        </aside>
      </div>
    </section>
  )
}