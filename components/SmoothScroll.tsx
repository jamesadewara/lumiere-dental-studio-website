'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

type LenisTicker = {
  callback: (time: number) => void
  unsubscribe: () => void
}

export function useLenis() {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }: Readonly<{ children: React.ReactNode }>) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const tickers = useRef(new WeakMap<Lenis, LenisTicker>())

  useGSAP(
    () => {
      if (!lenis) return

      gsap.registerPlugin(ScrollTrigger)
      const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
      const callback = (time: number) => lenis.raf(time * 1000)
      tickers.current.set(lenis, { callback, unsubscribe })
      gsap.ticker.add(callback)
      gsap.ticker.lagSmoothing(0)
      lenis.scrollTo(window.scrollY, { immediate: true, force: true })
      ScrollTrigger.refresh()
    },
    { dependencies: [lenis], revertOnUpdate: true },
  )

  useEffect(() => {
    let cancelled = false
    gsap.registerPlugin(ScrollTrigger)
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let activeLenis: Lenis | null = null

    function stop(updateState = true) {
      if (!activeLenis) return
      const ticker = tickers.current.get(activeLenis)
      if (ticker) {
        gsap.ticker.remove(ticker.callback)
        ticker.unsubscribe()
        tickers.current.delete(activeLenis)
      }
      activeLenis.destroy()
      activeLenis = null
      if (updateState) setLenis(null)
    }

    function start() {
      if (preference.matches || activeLenis) return
      activeLenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      setLenis(activeLenis)
    }

    function syncPreference(event: MediaQueryListEvent) {
      if (event.matches) stop()
      else start()
    }

    if (!preference.matches) start()
    preference.addEventListener('change', syncPreference)

    return () => {
      preference.removeEventListener('change', syncPreference)
      stop(false)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
