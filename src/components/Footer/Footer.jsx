import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" data-cursor-theme="plum">
      <div className="footer-inner">
        <div>
          <div className="micro">A project by</div>
          <div className="footer-title">CET<br />FILM SOCIETY</div>
        </div>
        <p className="footer-note">
          Rangam is made for the films we return to, and the conversations that do not end when the lights come up.
        </p>
      </div>
      <div className="footer-bottom">
        <span>RANGAM © 2026</span>
        <span>COLLEGE OF ENGINEERING TRIVANDRUM</span>
      </div>
    </footer>
  )
}