'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const DESKTOP_FRAME_COUNT = 200
const MOBILE_FRAME_COUNT = 120

export function JourneyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [loadedFrames, setLoadedFrames] = useState(0)
  const [frameCount, setFrameCount] = useState(DESKTOP_FRAME_COUNT)
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 768px)')
    let disposed = false
    let generation = 0

    function preloadFrames(isMobile: boolean) {
      const currentGeneration = ++generation
      const count = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT
      const images = Array.from({ length: count }, () => new Image())
      const directory = isMobile ? 'mobile' : 'desktop'

      imagesRef.current.forEach((image) => {
        image.onload = null
        image.onerror = null
        image.src = ''
      })
      imagesRef.current = images
      setLoadedFrames(0)
      setFrameCount(count)
      setReady(false)
      setLoadError(null)

      const loads = images.map((image, index) => new Promise<void>((resolve, reject) => {
        image.decoding = 'async'
        image.onload = () => {
          if (disposed || generation !== currentGeneration) return resolve()
          setLoadedFrames((count) => count + 1)
          resolve()
        }
        image.onerror = () => reject(new Error(`Unable to load /video/frames/${directory}/f_${String(index + 1).padStart(4, '0')}.webp`))
        image.src = `/video/frames/${directory}/f_${String(index + 1).padStart(4, '0')}.webp`
      }))

      void Promise.all(loads).then(
        () => {
          if (!disposed && generation === currentGeneration) setReady(true)
        },
        (error: unknown) => {
          if (disposed || generation !== currentGeneration) return
          const message = error instanceof Error ? error.message : 'Unable to load journey frames.'
          console.error(message, error)
          setLoadError(message)
        },
      )
    }

    function handleBreakpointChange(event: MediaQueryListEvent) {
      preloadFrames(event.matches)
    }

    preloadFrames(breakpoint.matches)
    breakpoint.addEventListener('change', handleBreakpointChange)

    return () => {
      disposed = true
      generation += 1
      breakpoint.removeEventListener('change', handleBreakpointChange)
      imagesRef.current.forEach((image) => {
        image.onload = null
        image.onerror = null
        image.src = ''
      })
      imagesRef.current = []
    }
  }, [])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const images = imagesRef.current
    if (!ready || !canvas || images.length !== frameCount) return

    const canvasElement = canvas
    const context = canvasElement.getContext('2d')
    if (!context) {
      const message = 'Unable to create the journey canvas.'
      console.error(message)
      setLoadError(message)
      return
    }

    let requestedFrame = 0
    let requestId = 0

    function drawFrame(frameIndex: number) {
      const image = images[frameIndex]
      if (!image?.complete || !image.naturalWidth || !context) return

      const width = canvasElement.clientWidth
      const height = canvasElement.clientHeight
      if (!width || !height) return

      const scale = width / image.naturalWidth
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale

      context.clearRect(0, 0, width, height)
      context.fillStyle = '#F5F1EA'
      context.fillRect(0, 0, width, height)
      context.drawImage(image, 0, (height - drawHeight) / 2, drawWidth, drawHeight)
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvasElement.clientWidth
      const height = canvasElement.clientHeight
      canvasElement.width = Math.round(width * dpr)
      canvasElement.height = Math.round(height * dpr)
      context?.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame(requestedFrame)
    }

    function scheduleDraw(frameIndex: number) {
      requestedFrame = frameIndex
      if (requestId) return
      requestId = window.requestAnimationFrame(() => {
        requestId = 0
        drawFrame(requestedFrame)
      })
    }

    gsap.registerPlugin(ScrollTrigger)
    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvasElement)
    let trigger: ScrollTrigger | null = null

    const ctx = gsap.context(() => {
      const frame = { frame: 0 }
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: () => `+=${Math.max(1, ScrollTrigger.maxScroll(window))}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        onUpdate: () => scheduleDraw(Math.round(frame.frame)),
      })

      drawFrame(0)

      // Labels align frame-story beats with 0%, 40%, and 80% of the full-page scroll.
      timeline
        .addLabel('story-start', 0)
        .to(frame, { frame: frameCount - 1, duration: 1, ease: 'none' }, 'story-start')
      trigger = timeline.scrollTrigger ?? null
    })
    ScrollTrigger.refresh()

    return () => {
      if (requestId) window.cancelAnimationFrame(requestId)
      resizeObserver.disconnect()
      trigger?.kill()
      ctx.revert()
    }
  }, [frameCount, ready])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full overflow-hidden bg-ink" aria-hidden="true">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full"
        />
      </div>
      {!ready && !loadError && (
        <div className="pointer-events-none fixed bottom-6 left-6 z-50 w-56 rounded-xl bg-ink/85 p-3 text-ivory shadow-lg backdrop-blur" role="status" aria-live="polite">
          <div className="mb-2 flex justify-between text-xs text-ivory/75">
            <span>Loading background</span>
            <span>{loadedFrames}/{frameCount}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-ivory/20">
            <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${(loadedFrames / frameCount) * 100}%` }} />
          </div>
        </div>
      )}
      {loadError && (
        <div className="pointer-events-none fixed bottom-6 left-6 z-50 max-w-xs rounded-xl border border-ivory/20 bg-ink/85 p-3 text-sm text-ivory shadow-lg backdrop-blur" role="alert">
          The animated background is unavailable because its frames could not be loaded.
        </div>
      )}
    </>
  )
}
