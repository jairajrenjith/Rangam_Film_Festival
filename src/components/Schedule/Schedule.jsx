import { useEffect, useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { EVENTS, PASSES } from '../../data/content'
import { getMovieStatus } from '../../services/passApi'
import Redact from '../Redact/Redact'
import PassModal from '../PassModal/PassModal'
import scheduleArt from '../../assets/motifs/motif-3.png'
import './Schedule.css'

export default function Schedule() {
  const headerRef = useScrollReveal()
  const listRef = useScrollReveal()
  const passRef = useScrollReveal()

  const [statuses, setStatuses] = useState({})
  const [activeMovieId, setActiveMovieId] = useState(null)

  useEffect(() => {
    let cancelled = false
    EVENTS.forEach((e) => {
      getMovieStatus(e.movieId)
        .then((data) => { if (!cancelled) setStatuses((prev) => ({ ...prev, [e.movieId]: data })) })
        .catch(() => { if (!cancelled) setStatuses((prev) => ({ ...prev, [e.movieId]: { success: false } })) })
    })
    return () => { cancelled = true }
  }, [])

  const refreshStatus = (movieId) => {
    getMovieStatus(movieId).then((data) => {
      setStatuses((prev) => ({ ...prev, [movieId]: data }))
    })
  }

  const activeEvent = EVENTS.find((e) => e.movieId === activeMovieId)

  return (
    <section className="schedule" id="schedule">
      <img className="schedule-art" src={scheduleArt} alt="" aria-hidden="true" />
      <div className="section-inner">
        <div ref={headerRef} className="schedule-header reveal">
          <div>
            <p className="kicker">03 / Events schedule</p>
            <h2 className="display">The <Redact>programme</Redact>.</h2>
          </div>
        </div>

        <div ref={listRef} className="schedule-list reveal">
          {EVENTS.map((e) => {
            const status = statuses[e.movieId]
            const closed = status?.success && status.closed

            return (
              <article className="event" key={e.id}>
                <span className="event-id">{e.id}</span>
                <strong className="event-film">{e.movie}</strong>
                <span className="event-meta event-date">{e.date}<br />{e.time}</span>
                <span className="event-venue">{e.venue}</span>
                <span className="event-pass">
                  {status === undefined && <span className="pass-status pass-status--loading">Checking…</span>}
                  {status && !status.success && <span className="pass-status pass-status--unknown">Passes unavailable</span>}
                  {closed && <span className="pass-status pass-status--closed">Sold out</span>}
                  {status?.success && !closed && (
                    <button className="button pass-btn" onClick={() => setActiveMovieId(e.movieId)}>
                      Book pass · {status.remaining} left
                    </button>
                  )}
                </span>
              </article>
            )
          })}
        </div>

        <div ref={passRef} className="pass-grid reveal">
          {PASSES.map((p) => (
            <article className="pass" key={p.tier}>
              <h3>{p.tier}</h3>
              <div className="price">{p.price}</div>
              <ul>
                {p.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <a className="button" href={p.url}>Pass details →</a>
            </article>
          ))}
        </div>
      </div>

      {activeEvent && (
        <PassModal
          event={activeEvent}
          onClose={() => setActiveMovieId(null)}
          onRegistered={() => refreshStatus(activeEvent.movieId)}
        />
      )}
    </section>
  )
}