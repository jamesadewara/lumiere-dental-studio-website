'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

type ScrollHighlightProps = {
  as?: 'h1' | 'h2'
  dataTitle?: string
  className: string
  text: string
  highlight: string
}

function renderHighlightedText(text: string, highlight: string) {
  const start = text.indexOf(highlight)
  if (start < 0) return text

  return (
    <>
      {text.slice(0, start)}
      <span className="bg-gold text-ink">{highlight}</span>
      {text.slice(start + highlight.length)}
    </>
  )
}


export function ScrollHighlight({ as: Tag = 'h2', dataTitle, className, text, highlight }: ScrollHighlightProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const overlayRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const heading = headingRef.current
    const overlay = overlayRef.current
    if (!heading || !overlay) return
    const targetHeading = heading

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const setClipPath = gsap.quickSetter(overlay, 'clipPath')
    let frame = 0

    function updateHighlight() {
      frame = 0
      if (reducedMotion.matches) {
        setClipPath('inset(0 0% 0 0)')
        return
      }

      const top = targetHeading.getBoundingClientRect().top
      const start = window.innerHeight * 0.78
      const end = window.innerHeight * 0.35
      const progress = gsap.utils.clamp(0, 1, (start - top) / (start - end))
      setClipPath(`inset(0 ${100 - progress * 100}% 0 0)`)
    }

    function scheduleUpdate() {
      if (frame) return
      frame = window.requestAnimationFrame(updateHighlight)
    }

    updateHighlight()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <Tag
      ref={headingRef}
      data-scroll-highlight
      {...(dataTitle ? { [`data-${dataTitle}`]: '' } : {})}
      className={`relative block whitespace-pre-line ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <span ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 text-transparent">
        {renderHighlightedText(text, highlight)}
      </span>
    </Tag>
  )
}
