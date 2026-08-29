import './Hero.css'
import heroArt from '../../assets/motifs/motif-1.png'
import rangamMark from '../../assets/logos/logo_rangam.png'

export default function Hero({ ready }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <img className="hero-art" src={heroArt} alt="" aria-hidden="true" />
      <div className={`hero-inner ${ready ? 'is-ready' : ''}`}>
        <p className="hero-presents hero-line">CET Film Society in association with Dhwani&apos;26 presents</p>
        <h1 id="hero-title" className="hero-mark-wrap hero-line">
          <img className="hero-mark" src={rangamMark} alt="Rangam" />
        </h1>
        <p className="mal-title hero-line">സാക്ഷിപകർപ്പുകൾ</p>
        <p className="subtitle hero-line">Whispers of Witness</p>
        <p className="hero-note hero-line">
          Cinema holds what power tries to erase. An assembly of films, testimonies, and the traces they leave behind.
        </p>
        <div className="actions hero-line">
          <a className="button primary" href="#schedule">View the programme</a>
          <a className="button" href="#edition">Read this year's note</a>
        </div>
      </div>
      <div className="film-number" aria-hidden="true">26</div>
    </section>
  )
}