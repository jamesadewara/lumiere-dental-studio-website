'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

export function PageTransition({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const pageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline()
      timeline.addLabel('page-enter').fromTo(page, { autoAlpha: 0 }, {
        autoAlpha: 1,
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.2,
        ease: 'power1.out',
      }, 'page-enter')
    }, page)

    return () => ctx.revert()
  }, [pathname])

  return <div ref={pageRef} className="relative z-10">{children}</div>
}
