import { useEffect, useState } from 'react'
import Loader from '../components/Loader/Loader'
import Grain from '../components/Grain/Grain'
import Nav from '../components/Nav/Nav'
import Hero from '../components/Hero/Hero'
import MarqueeStrip from '../components/MarqueeStrip/MarqueeStrip'
import About from '../components/About/About'
import Edition from '../components/Edition/Edition'
import Schedule from '../components/Schedule/Schedule'
import Archive from '../components/Archive/Archive'
import Footer from '../components/Footer/Footer'
import TelegramBot from '../components/TelegramBot/TelegramBot'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [loading])

  return (
    <>
      <Grain />
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Nav />
      <main>
        <Hero ready={!loading} />
        <MarqueeStrip />
        <About />
        <Edition />
        <Schedule />
        <Archive />
      </main>
      <Footer />
      <TelegramBot />
    </>
  )
}