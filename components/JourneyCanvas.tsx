'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const DESKTOP_FRAME_COUNT = 240
const MOBILE_FRAME_COUNT = 200

type NetworkInformation = {
  saveData?: boolean
  effectiveType?: string
}

type ToothAnnotation = {
  x: number
  y: number
  labelX: number
  labelY: number
  side: 'left' | 'right'
  part: {
    name: string
    description: string
  }
  visible: boolean
}

const TOOTH_BOUNDS = [
  { frame: 0, left: 0.39, right: 0.61, top: 0.29, bottom: 0.79 },
  { frame: 12, left: 0.38, right: 0.62, top: 0.27, bottom: 0.82 },
  { frame: 24, left: 0.33, right: 0.67, top: 0.18, bottom: 0.98 },
  { frame: 36, left: 0.27, right: 0.73, top: 0.14, bottom: 1 },
  { frame: 48, left: 0.22, right: 0.78, top: 0.12, bottom: 1 },
  { frame: 60, left: 0.2, right: 0.8, top: 0.1, bottom: 1 },
]

function getToothBounds(frame: number) {
  if (frame > 60) return null

  let lower = TOOTH_BOUNDS[0]
  let upper = TOOTH_BOUNDS[TOOTH_BOUNDS.length - 1]
  for (let index = 1; index < TOOTH_BOUNDS.length; index += 1) {
    if (frame <= TOOTH_BOUNDS[index].frame) {
      lower = TOOTH_BOUNDS[index - 1]
      upper = TOOTH_BOUNDS[index]
      break
    }
  }

  const progress = (frame - lower.frame) / Math.max(1, upper.frame - lower.frame)
  const bounds = {
    left: lower.left + (upper.left - lower.left) * progress,
    right: lower.right + (upper.right - lower.right) * progress,
    top: lower.top + (upper.top - lower.top) * progress,
    bottom: lower.bottom + (upper.bottom - lower.bottom) * progress,
  }
  return bounds
}

function getToothPart(x: number, y: number, frame: number) {
  const bounds = getToothBounds(frame)
  if (!bounds) return null
  if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return null

  const localX = (x - bounds.left) / (bounds.right - bounds.left)
  const localY = (y - bounds.top) / (bounds.bottom - bounds.top)

  if (localY < 0.24 && localX > 0.2 && localX < 0.8) {
    return { name: 'Chewing surface', description: 'The top surface used to break down food.' }
  }
  if (localY < 0.68 && localX > 0.12 && localX < 0.88) {
    return { name: 'Crown', description: 'The visible portion of the tooth above the gumline.' }
  }
  if (localY > 0.68 && (localX < 0.44 || localX > 0.56)) {
    return { name: 'Root', description: 'The part that anchors the tooth below the gumline.' }
  }

  return null
}

export function JourneyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const transitionCanvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const transitionImageRef = useRef<HTMLImageElement | null>(null)
  const sourceFrameNumbersRef = useRef<number[]>([])
  const requestedFrameRef = useRef(0)
  const scheduleDrawRef = useRef<((frameIndex: number) => void) | null>(null)
  const transitionInProgressRef = useRef(false)
  const transitionTimeoutRef = useRef(0)
  const [loadedFrames, setLoadedFrames] = useState(0)
  const [frameCount, setFrameCount] = useState(DESKTOP_FRAME_COUNT)
  const [ready, setReady] = useState(false)
  const [frameTransition, setFrameTransition] = useState(false)
  const [frameTransitionFading, setFrameTransitionFading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reducedTransfer, setReducedTransfer] = useState(false)
  const [annotation, setAnnotation] = useState<ToothAnnotation | null>(null)

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 768px)')
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
    let disposed = false
    let generation = 0
    let activeMobile = breakpoint.matches

    function preserveCurrentFrame() {
      if (motionPreference.matches) return

      const currentImages = imagesRef.current
      const currentIndex = Math.max(0, Math.min(currentImages.length - 1, Math.round(requestedFrameRef.current)))
      let image = currentImages[currentIndex]
      if (!image?.complete || !image.naturalWidth) {
        image = null
        for (let offset = 1; offset < currentImages.length; offset += 1) {
          const before = currentImages[currentIndex - offset]
          const after = currentImages[currentIndex + offset]
          if (before?.complete && before.naturalWidth) {
            image = before
            break
          }
          if (after?.complete && after.naturalWidth) {
            image = after
            break
          }
        }
      }
      const transitionCanvas = transitionCanvasRef.current
      const context = transitionCanvas?.getContext('2d')
      const currentCanvas = canvasRef.current
      if (!currentCanvas || !transitionCanvas || !context) return

      const width = currentCanvas.clientWidth
      const height = currentCanvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      transitionCanvas.width = Math.round(width * dpr)
      transitionCanvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.fillStyle = '#F5F1EA'
      context.fillRect(0, 0, width, height)
      if (image?.naturalWidth) {
        const scale = width / image.naturalWidth
        const drawWidth = image.naturalWidth * scale
        const drawHeight = image.naturalHeight * scale
        context.drawImage(image, 0, (height - drawHeight) / 2, drawWidth, drawHeight)
        transitionImageRef.current = image
      } else {
        const scale = Math.min(width / currentCanvas.clientWidth, height / currentCanvas.clientHeight)
        const drawWidth = currentCanvas.clientWidth * scale
        const drawHeight = currentCanvas.clientHeight * scale
        context.drawImage(currentCanvas, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
        transitionImageRef.current = null
      }

      currentCanvas.width = transitionCanvas.width
      currentCanvas.height = transitionCanvas.height
      const currentContext = currentCanvas.getContext('2d')
      if (currentContext) {
        currentContext.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (image?.naturalWidth) {
          const scale = width / image.naturalWidth
          const drawWidth = image.naturalWidth * scale
          const drawHeight = image.naturalHeight * scale
          currentContext.fillStyle = '#F5F1EA'
          currentContext.fillRect(0, 0, width, height)
          currentContext.drawImage(image, 0, (height - drawHeight) / 2, drawWidth, drawHeight)
        } else {
          currentContext.drawImage(transitionCanvas, 0, 0, width, height)
        }
      }

      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current)
      transitionInProgressRef.current = true
      setFrameTransitionFading(false)
      setFrameTransition(true)
    }

    function preloadFrames(isMobile: boolean) {
      const currentGeneration = ++generation
      const sourceCount = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT
      const lowBandwidth = Boolean(
        connection?.saveData ||
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g' ||
        connection?.effectiveType === '3g',
      )
      const stride = lowBandwidth ? (isMobile ? 3 : 4) : 1
      const sourceFrames = motionPreference.matches
        ? [1]
        : Array.from({ length: sourceCount }, (_, index) => index + 1)
          .filter((frame, index) => index % stride === 0 || frame === sourceCount)
      const directory = isMobile ? 'mobile' : 'desktop'
      const images: (HTMLImageElement | null)[] = Array.from({ length: sourceFrames.length }, () => null)

      sourceFrameNumbersRef.current = sourceFrames
      imagesRef.current.forEach((image) => {
        if (!image) return
        image.onload = null
        image.onerror = null
        if (image !== transitionImageRef.current) image.src = ''
      })
      imagesRef.current = images
      setLoadedFrames(0)
      setFrameCount(sourceFrames.length)
      setReady(false)
      setLoadError(null)
      setReducedTransfer(lowBandwidth || motionPreference.matches)

      let nextIndex = 0
      let finishedCount = 0
      let firstFrameLoaded = false
      const concurrency = lowBandwidth ? 2 : 4

      function loadNext() {
        if (disposed || generation !== currentGeneration) return
        const index = nextIndex++
        if (index >= sourceFrames.length) return

        const sourceFrame = sourceFrames[index]
        const image = new Image()
        image.decoding = 'async'
        images[index] = image
        image.onload = () => {
          if (disposed || generation !== currentGeneration) return
          finishedCount += 1
          setLoadedFrames(finishedCount)
          if (index === 0) {
            firstFrameLoaded = true
            setReady(true)
          }
          if (firstFrameLoaded) scheduleDrawRef.current?.(requestedFrameRef.current)
          loadNext()
        }
        image.onerror = () => {
          if (disposed || generation !== currentGeneration) return
          finishedCount += 1
          setLoadedFrames(finishedCount)
          if (index === 0) {
            const message = `Unable to load first background frame /video/frames/${directory}/f_${String(sourceFrame).padStart(4, '0')}.webp`
            console.error(message)
            setLoadError(message)
            transitionInProgressRef.current = false
            if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current)
            setFrameTransitionFading(false)
            setFrameTransition(false)
          }
          loadNext()
        }
        image.src = `/video/frames/${directory}/f_${String(sourceFrame).padStart(4, '0')}.webp`
      }

      for (let worker = 0; worker < Math.min(concurrency, sourceFrames.length); worker += 1) {
        loadNext()
      }
    }

    function switchFrameSet(isMobile: boolean) {
      if (activeMobile === isMobile) return
      activeMobile = isMobile
      preserveCurrentFrame()
      preloadFrames(isMobile)
    }

    function handleBreakpointChange(event: MediaQueryListEvent) {
      switchFrameSet(event.matches)
    }

    function handleWindowResize() {
      switchFrameSet(breakpoint.matches)
    }

    function handleMotionPreferenceChange() {
      preloadFrames(activeMobile)
    }

    preloadFrames(activeMobile)
    breakpoint.addEventListener('change', handleBreakpointChange)
    motionPreference.addEventListener('change', handleMotionPreferenceChange)
    window.addEventListener('resize', handleWindowResize, { passive: true })

    return () => {
      disposed = true
      generation += 1
      breakpoint.removeEventListener('change', handleBreakpointChange)
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
      window.removeEventListener('resize', handleWindowResize)
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current)
      imagesRef.current.forEach((image) => {
        if (!image) return
        image.onload = null
        image.onerror = null
        image.src = ''
      })
      imagesRef.current = []
      sourceFrameNumbersRef.current = []
      scheduleDrawRef.current = null
    }
  }, [])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!ready || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) {
      const message = 'Unable to create the journey canvas.'
      console.error(message)
      setLoadError(message)
      return
    }

    const canvasElement = canvas
    const drawingContext = context
    let requestId = 0

    function drawFrame(frameIndex: number) {
      const images = imagesRef.current
      if (!images.length) return
      const target = Math.max(0, Math.min(images.length - 1, Math.round(frameIndex)))
      let image = images[target]
      if (!image?.complete || !image.naturalWidth) {
        for (let offset = 1; offset < images.length; offset += 1) {
          const before = images[target - offset]
          const after = images[target + offset]
          if (before?.complete && before.naturalWidth) {
            image = before
            break
          }
          if (after?.complete && after.naturalWidth) {
            image = after
            break
          }
        }
      }
      if (!image?.complete || !image.naturalWidth) return

      const width = canvasElement.clientWidth
      const height = canvasElement.clientHeight
      if (!width || !height) return

      const scale = width / image.naturalWidth
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      drawingContext.clearRect(0, 0, width, height)
      drawingContext.fillStyle = '#F5F1EA'
      drawingContext.fillRect(0, 0, width, height)
      drawingContext.drawImage(image, 0, (height - drawHeight) / 2, drawWidth, drawHeight)
    }

    function scheduleDraw(frameIndex: number) {
      requestedFrameRef.current = frameIndex
      if (requestId) return
      requestId = window.requestAnimationFrame(() => {
        requestId = 0
        drawFrame(requestedFrameRef.current)
      })
    }

    scheduleDrawRef.current = scheduleDraw

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = canvasElement.clientWidth
      const height = canvasElement.clientHeight
      canvasElement.width = Math.round(width * dpr)
      canvasElement.height = Math.round(height * dpr)
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame(requestedFrameRef.current)

    }

    gsap.registerPlugin(ScrollTrigger)
    resizeCanvas()
    if (transitionInProgressRef.current) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        setFrameTransitionFading(true)
        transitionTimeoutRef.current = window.setTimeout(() => {
          transitionInProgressRef.current = false
          transitionTimeoutRef.current = 0
          transitionImageRef.current = null
          setFrameTransitionFading(false)
          setFrameTransition(false)
        }, 900)
      }, 100)
    }
    const resizeObserver = new ResizeObserver(() => resizeCanvas())
    resizeObserver.observe(canvasElement)

    const desktopMotion = window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)').matches
    let annotationTimer = 0

    function hideAnnotation() {
      if (annotationTimer) window.clearTimeout(annotationTimer)
      setAnnotation((current) => current ? { ...current, visible: false } : null)
      annotationTimer = window.setTimeout(() => setAnnotation(null), 220)
    }

    function handleScroll() {
      hideAnnotation()
    }

    function handlePointerMove(event: PointerEvent) {
      if (!desktopMotion) return
      const image = imagesRef.current[0]
      const sourceFrame = sourceFrameNumbersRef.current[requestedFrameRef.current] ?? requestedFrameRef.current + 1
      const sourceFrameIndex = sourceFrame - 1
      const bounds = getToothBounds(sourceFrameIndex)
      if (!image?.naturalWidth || !bounds) {
        hideAnnotation()
        return
      }

      const rect = canvasElement.getBoundingClientRect()
      const scale = rect.width / image.naturalWidth
      const imageHeight = image.naturalHeight * scale
      const imageTop = rect.top + (rect.height - imageHeight) / 2
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - imageTop) / imageHeight
      const part = getToothPart(x, y, sourceFrameIndex)
      if (!part) {
        hideAnnotation()
        return
      }

      if (annotationTimer) window.clearTimeout(annotationTimer)
      const nextAnnotation: ToothAnnotation = {
        x: event.clientX,
        y: event.clientY,
        side: event.clientX < window.innerWidth * 0.58 ? 'right' : 'left',
        labelX: event.clientX < window.innerWidth * 0.58
          ? Math.min(event.clientX + 44, window.innerWidth - 288)
          : Math.max(event.clientX - 44, 288),
        labelY: Math.max(72, event.clientY - 54),
        part,
        visible: true,
      }
      setAnnotation((current) => {
        if (
          current?.visible &&
          current.part.name === nextAnnotation.part.name &&
          Math.abs(current.x - nextAnnotation.x) < 2 &&
          Math.abs(current.y - nextAnnotation.y) < 2
        ) return current
        return nextAnnotation
      })
    }

    function handlePointerOut(event: PointerEvent) {
      if (event.relatedTarget) return
      hideAnnotation()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleScroll, { passive: true })
    if (desktopMotion) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('pointerout', handlePointerOut)
    }
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

      // This label anchors the sequence to the full-page scroll progress.
      timeline.addLabel('story-start').to(
        frame,
        { frame: frameCount - 1, duration: 1, ease: 'none' },
        'story-start',
      )
    })
    ScrollTrigger.refresh()

    return () => {
      if (requestId) window.cancelAnimationFrame(requestId)
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current)
      if (annotationTimer) window.clearTimeout(annotationTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('touchstart', handleScroll)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
      resizeObserver.disconnect()
      ctx.revert()
      scheduleDrawRef.current = null
    }
  }, [frameCount, ready, reducedTransfer])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full overflow-hidden bg-ivory" aria-hidden="true">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
        <canvas
          ref={transitionCanvasRef}
          className={`absolute inset-0 size-full ${frameTransitionFading ? 'transition-opacity duration-[900ms] ease-out opacity-0' : frameTransition ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      {annotation && (
        <div
          aria-hidden={!annotation.visible}
          className={`pointer-events-none fixed inset-0 z-[30] transition-opacity duration-200 ${annotation.visible ? 'opacity-100' : 'opacity-0'}`}
        >
          <svg className="absolute inset-0 size-full" aria-hidden="true">
            <line
              x1={annotation.x}
              y1={annotation.y}
              x2={annotation.labelX}
              y2={annotation.labelY + 22}
              stroke="#C9A227"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={annotation.x} cy={annotation.y} r="5" fill="#C9A227" />
          </svg>
          <div
            className={`absolute max-w-[17rem] rounded-xl bg-ivory/90 px-4 py-2 text-ink backdrop-blur-sm ${annotation.side === 'left' ? '-translate-x-full text-right' : ''}`}
            style={{ left: annotation.labelX, top: annotation.labelY }}
          >
            <p className="text-2xl font-bold leading-tight tracking-[-0.05em] md:text-4xl">{annotation.part.name}</p>
            <p className="mt-1 text-xs leading-snug text-ink/70 md:text-sm">{annotation.part.description}</p>
          </div>
        </div>
      )}
      {!ready && !loadError && !frameTransition && (
        <div className="pointer-events-none fixed bottom-6 left-6 z-50 w-56 rounded-xl bg-ink/85 p-3 text-ivory shadow-lg backdrop-blur" role="status" aria-live="polite">
          <div className="mb-2 flex justify-between text-xs text-ivory/75">
            <span>{reducedTransfer ? 'Loading lightweight background' : 'Loading background'}</span>
            <span>{loadedFrames}/{frameCount}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-ivory/20">
            <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${(loadedFrames / frameCount) * 100}%` }} />
          </div>
        </div>
      )}
      {loadError && (
        <div className="pointer-events-none fixed bottom-6 left-6 z-50 max-w-xs rounded-xl border border-ink/10 bg-ivory/95 p-3 text-sm text-ink shadow-lg" role="status">
          The background sequence could not load; the page remains available.
        </div>
      )}
    </>
  )
}
