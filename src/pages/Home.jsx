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
        <MarqueeStrip
          text="Rangam · a temporary archive, made together · held in common, carried forward · "
          notch="light"
        />
        <Edition />
        <MarqueeStrip text="Rangam · reserve your seat · limited passes per screening · witness / record / remember · " />
        <Schedule />
        <MarqueeStrip text="Rangam · films return to us · so does the memory of them · cet film society · " />
        <Archive />
      </main>
      <Footer />
      <TelegramBot />
    </>
  )
}