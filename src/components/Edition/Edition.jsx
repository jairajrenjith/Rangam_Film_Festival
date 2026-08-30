import { useScrollReveal } from '../../hooks/useScrollReveal'
import Redact from '../Redact/Redact'
import editionArt from '../../assets/motifs/motif-2.png'
import './Edition.css'

export default function Edition() {
  const ref = useScrollReveal()

  return (
    <section className="edition" id="edition" data-cursor-theme="plum">
      <img className="edition-art" src={editionArt} alt="" aria-hidden="true" />
      <div ref={ref} className="section-inner theme-grid reveal">
        <div>
          <p className="kicker">02 / This edition</p>
          <h2 className="display">
            Cinema as a historical memory against <Redact>oppression</Redact>.
          </h2>
          <p className="copy">
            This year, Rangam listens for the quiet documents: the image that survived, the story
            that was passed hand to hand, the witness who refuses disappearance.
          </p>
        </div>
        <div className="witness">
          <p>
            "A film is not only what is shown. It is also the record of what was made visible —
            against every attempt to silence it."
          </p>
          <span className="stamp">Witness statement / 2026</span>
        </div>
      </div>
    </section>
  )
}