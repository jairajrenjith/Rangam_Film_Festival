import { useEffect, useRef } from 'react'
import './CursorFX.css'

// Elements that should flip the cursor/ring into its "interactive" state.
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], .ticket-brand, .menu'

// How the cursor decides which colour to wear: it looks at the nearest
// ancestor carrying data-cursor-theme="butter" | "plum" (see the section
// components) and always shows the *opposite* colour, so it stays legible
// and lively against whichever half of the palette it's sitting on.
function themeAt(x, y) {
  const el = document.elementFromPoint(x, y)
  const themed = el && el.closest('[data-cursor-theme]')
  return themed ? themed.getAttribute('data-cursor-theme') : 'plum'
}

function isInteractiveAt(x, y) {
  const el = document.elementFromPoint(x, y)
  return !!(el && el.closest(INTERACTIVE_SELECTOR))
}

const SPARK_POOL_SIZE = 18
const SPARK_MIN_DISTANCE = 14 // px the pointer must travel before a new spark drops

export default function CursorFX() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const sparkLayerRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return undefined // touch/coarse pointers get the CSS-only touch glow instead

    const root = document.documentElement
    root.classList.add('cfx-active')

    const dot = dotRef.current
    const ring = ringRef.current
    const sparkLayer = sparkLayerRef.current

    // Pre-build a pool of spark nodes so the trail never allocates DOM
    // nodes while the pointer is moving.
    const sparks = Array.from({ length: SPARK_POOL_SIZE }, () => {
      const span = document.createElement('span')
      span.className = 'cfx-spark'
      sparkLayer.appendChild(span)
      return span
    })
    let sparkIndex = 0
    let lastSparkX = null
    let lastSparkY = null

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { x: pointer.x, y: pointer.y }
    let currentTheme = 'plum'
    let rafId = null

    const dropSpark = (x, y, theme) => {
      const spark = sparks[sparkIndex]
      sparkIndex = (sparkIndex + 1) % sparks.length
      spark.className = `cfx-spark cfx-theme-${theme}`
      spark.style.left = `${x}px`
      spark.style.top = `${y}px`
      // Force reflow so the animation restarts even if this node was mid-fade.
      void spark.offsetWidth
      spark.classList.add('is-active')
    }

    const handleMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`

      if (!reduceMotion) {
        if (lastSparkX === null) {
          lastSparkX = pointer.x
          lastSparkY = pointer.y
        }
        const dx = pointer.x - lastSparkX
        const dy = pointer.y - lastSparkY
        if (Math.hypot(dx, dy) >= SPARK_MIN_DISTANCE) {
          dropSpark(pointer.x, pointer.y, currentTheme)
          lastSparkX = pointer.x
          lastSparkY = pointer.y
        }
      }
    }

    const handleDown = () => ring.classList.add('is-pressed')
    const handleUp = () => ring.classList.remove('is-pressed')
    const handleLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const handleEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    const tick = () => {
      // Ring eases toward the real pointer position for a bit of trailing life.
      ringPos.x += (pointer.x - ringPos.x) * 0.18
      ringPos.y += (pointer.y - ringPos.y) * 0.18
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`

      const theme = themeAt(pointer.x, pointer.y)
      if (theme !== currentTheme) {
        currentTheme = theme
        dot.className = `cfx-dot cfx-theme-${theme}`
        ring.className = ring.classList.contains('is-pressed')
          ? `cfx-ring cfx-theme-${theme} is-pressed`
          : `cfx-ring cfx-theme-${theme}`
      }

      const hovering = isInteractiveAt(pointer.x, pointer.y)
      ring.classList.toggle('is-hovering', hovering)

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)
    rafId = requestAnimationFrame(tick)

    return () => {
      root.classList.remove('cfx-active')
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      if (rafId) cancelAnimationFrame(rafId)
      sparks.forEach((s) => s.remove())
    }
  }, [])

  // Touch devices: no pointer to render, but every touch still drops a
  // themed glow where it lands, echoing the desktop trail.
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (!coarse) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const layer = sparkLayerRef.current
    const sparks = Array.from({ length: 10 }, () => {
      const span = document.createElement('span')
      span.className = 'cfx-spark cfx-spark--touch'
      layer.appendChild(span)
      return span
    })
    let sparkIndex = 0
    let lastX = null
    let lastY = null

    const dropAt = (x, y) => {
      const theme = themeAt(x, y)
      const spark = sparks[sparkIndex]
      sparkIndex = (sparkIndex + 1) % sparks.length
      spark.className = `cfx-spark cfx-spark--touch cfx-theme-${theme}`
      spark.style.left = `${x}px`
      spark.style.top = `${y}px`
      void spark.offsetWidth
      spark.classList.add('is-active')
    }

    const handleTouchStart = (e) => {
      const t = e.touches[0]
      if (!t) return
      lastX = t.clientX
      lastY = t.clientY
      dropAt(t.clientX, t.clientY)
    }

    const handleTouchMove = (e) => {
      const t = e.touches[0]
      if (!t) return
      const dx = t.clientX - (lastX ?? t.clientX)
      const dy = t.clientY - (lastY ?? t.clientY)
      if (Math.hypot(dx, dy) >= SPARK_MIN_DISTANCE) {
        dropAt(t.clientX, t.clientY)
        lastX = t.clientX
        lastY = t.clientY
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      sparks.forEach((s) => s.remove())
    }
  }, [])

  return (
    <>
      <div className="cfx-dot cfx-theme-plum" ref={dotRef} aria-hidden="true" />
      <div className="cfx-ring cfx-theme-plum" ref={ringRef} aria-hidden="true" />
      <div className="cfx-spark-layer" ref={sparkLayerRef} aria-hidden="true" />
    </>
  )
}
