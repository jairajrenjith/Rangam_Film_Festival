import { forwardRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import cetLogo from '../../assets/logos/logo_cet.png'
import rangamLogo from '../../assets/logos/logo_rangam.png'
import cetfsLogo from '../../assets/logos/logo_cetfs.png'
import './Ticket.css'

const Ticket = forwardRef(function Ticket(
  { movie, date, time, venue, name, passId, qrData },
  ref
) {
  return (
    <div className="ticket" ref={ref}>
      <div className="ticket-main">
        <div className="ticket-brands">
          <img src={cetLogo} alt="" className="ticket-brand" />
          <img src={rangamLogo} alt="" className="ticket-brand ticket-brand--rangam" />
          <img src={cetfsLogo} alt="" className="ticket-brand" />
        </div>

        <p className="ticket-kicker">Admit one · Screening pass</p>
        <h3 className="ticket-movie">{movie}</h3>

        <div className="ticket-meta">
          <div><span>Date</span>{date}</div>
          <div><span>Time</span>{time}</div>
          <div><span>Venue</span>{venue}</div>
        </div>

        <div className="ticket-holder">
          <span>Passholder</span>
          {name}
        </div>

        <p className="ticket-footer">College of Engineering Trivandrum · CET Film Society</p>
      </div>

      <div className="ticket-stub">
        <div className="ticket-stub-qr">
          <QRCodeCanvas value={qrData} size={104} bgColor="#ffec8e" fgColor="#631d3f" includeMargin />
        </div>
        <p className="ticket-stub-id">{passId}</p>
        <p className="ticket-stub-label">RANGAM · 2026</p>
      </div>
    </div>
  )
})

export default Ticket