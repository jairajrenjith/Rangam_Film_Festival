import { useEffect, useRef } from 'react'

export function useScrollReveal(options = { threshold: 0, rootMargin: '0px 0px -8% 0px' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => el.classList.add('in-view')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal()
          observer.unobserve(entry.target)
        }
      })
    }, options)

    observer.observe(el)

    // Safety net: content should never stay permanently invisible if the
    // observer doesn't fire for some reason (e.g. layout/timing edge
    // cases). If nothing has revealed it shortly after mount, show it.
    const fallback = setTimeout(reveal, 1200)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return ref
}