import './TelegramBot.css'

export default function TelegramBot() {
  return (
    <a
      className="bot"
      href="https://t.me/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Rangam bot on Telegram"
    >
      <span className="bot-pulse" aria-hidden="true" />
      <span aria-hidden="true">✦</span>
    </a>
  )
}