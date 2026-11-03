'use client'

import { type CSSProperties, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type Motif = {
  id: number
  color: 'text-gold' | 'text-cream'
  style: CSSProperties
}

function createMotifs(): Motif[] {
  const count = Math.random() < 0.18 ? 0 : 2 + Math.floor(Math.random() * 6)
  return Array.from({ length: count }, (_, id) => ({
    id,
    color: Math.random() < 0.5 ? 'text-gold' : 'text-cream',
    style: {
      left: `${4 + Math.random() * 92}%`,
      fontSize: `${10 + Math.random() * 18}px`,
      animationDuration: `${16 + Math.random() * 18}s`,
      animationDelay: `${Math.random() * 7}s`,
      '--feather-opacity': `${0.18 + Math.random() * 0.22}`,
      '--drift-start': `${-28 + Math.random() * 56}px`,
      '--drift-first': `${-100 + Math.random() * 200}px`,
      '--drift-second': `${-140 + Math.random() * 280}px`,
      '--drift-end': `${-180 + Math.random() * 360}px`,
      '--spin-start': `${-45 + Math.random() * 90}deg`,
      '--spin-end': `${-180 + Math.random() * 360}deg`,
    } as CSSProperties,
  }))
}

export function FloatingMotifs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [motifs, setMotifs] = useState<Motif[]>([])

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotifs(createMotifs())
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!container || media.matches || !pointer.matches) return

    const feathers = Array.from(container.querySelectorAll<HTMLElement>('[data-feather]'))
    const motion = feathers.map((feather) => ({
      x: gsap.quickTo(feather, 'x', { duration: 0.9, ease: 'power2.out' }),
      y: gsap.quickTo(feather, 'y', { duration: 0.9, ease: 'power2.out' }),
      rotation: gsap.quickTo(feather, 'rotation', { duration: 0.9, ease: 'power2.out' }),
      scaleX: gsap.quickTo(feather, 'scaleX', { duration: 0.9, ease: 'power2.out' }),
      scaleY: gsap.quickTo(feather, 'scaleY', { duration: 0.9, ease: 'power2.out' }),
      opacity: gsap.quickTo(feather, 'opacity', { duration: 0.9, ease: 'power2.out' }),
    }))
    let previousPointer: { x: number; y: number } | null = null
    let wind = { x: 0, y: -1 }

    function resetFeathers() {
      motion.forEach((animate) => {
        animate.x(0)
        animate.y(0)
        animate.rotation(0)
        animate.scaleX(1)
        animate.scaleY(1)
        animate.opacity(1)
      })
      previousPointer = null
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return

      if (previousPointer) {
        const dx = event.clientX - previousPointer.x
        const dy = event.clientY - previousPointer.y
        const distance = Math.hypot(dx, dy)
        if (distance > 1.5) wind = { x: dx / distance, y: dy / distance }
      }
      previousPointer = { x: event.clientX, y: event.clientY }
      if (media.matches) {
        resetFeathers()
        return
      }

      feathers.forEach((feather, index) => {
        const bounds = feather.getBoundingClientRect()
        const centerX = bounds.left + bounds.width / 2
        const centerY = bounds.top + bounds.height / 2
        const awayX = centerX - event.clientX
        const awayY = centerY - event.clientY
        const distance = Math.hypot(awayX, awayY)
        const influence = Math.max(0, 1 - distance / 190)
        const animate = motion[index]
        if (!animate) return

        if (influence === 0) {
          animate.x(0)
          animate.y(0)
          animate.rotation(0)
          animate.scaleX(1)
          animate.scaleY(1)
          animate.opacity(1)
          return
        }

        const away = distance > 0 ? { x: awayX / distance, y: awayY / distance } : wind
        const direction = {
          x: wind.x * 0.8 + away.x * 0.35,
          y: wind.y * 0.8 + away.y * 0.35,
        }
        const strength = influence * (90 + (index % 2) * 18)
        animate.x(direction.x * strength)
        animate.y(direction.y * strength - influence * 12)
        animate.rotation((wind.x * 24 + wind.y * 12) * influence)
        animate.scaleX(1 - influence * 0.14)
        animate.scaleY(1 + influence * 0.08)
        animate.opacity(1 - influence * 0.3)
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', resetFeathers)
    media.addEventListener('change', resetFeathers)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', resetFeathers)
      media.removeEventListener('change', resetFeathers)
      gsap.killTweensOf(feathers)
    }
  }, [motifs])

  return (
    <div ref={containerRef} className="floating-motifs" aria-hidden="true">
      {motifs.map((motif) => (
        <span key={motif.id} className={`floating-motif ${motif.color}`} style={motif.style}>
          <span data-feather>✳</span>
        </span>
      ))}
    </div>
  )
}
