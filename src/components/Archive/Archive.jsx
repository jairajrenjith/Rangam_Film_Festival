import { useScrollReveal } from '../../hooks/useScrollReveal'
import { PREVIOUS_EDITIONS } from '../../data/content'
import Redact from '../Redact/Redact'
import './Archive.css'

export default function Archive() {
  const ref = useScrollReveal()

  return (
    <section className="previous" id="archive">
      <div ref={ref} className="section-inner reveal">
        <p className="kicker">04 / Previous editions</p>
        <h2 className="display">More than a festival, a shared <Redact>memory</Redact>.</h2>
        <div className="previous-grid">
          <div className="archive-frame">
            <strong>Footage from past Rangams<br />is being restored.</strong>
          </div>
          <div className="highlight-list">
            {PREVIOUS_EDITIONS.highlights.map((h, i) => (
              <div className="highlight" key={h}>
                <span>0{i + 1}</span>{h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}