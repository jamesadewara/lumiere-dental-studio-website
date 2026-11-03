'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger)
      const media = gsap.matchMedia()

      media.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        ({ conditions }) => {
          const title = section.querySelector<HTMLElement>('[data-hero-title]')
          const subline = section.querySelector<HTMLElement>('[data-hero-subline]')
          if (!title || !subline) return

          const isDesktop = Boolean(conditions?.desktop)
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: isDesktop ? '+=100%' : '+=45%',
              pin: isDesktop,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })

          // The labels align the headline exit and subline entrance across the scrub.
          timeline
            .addLabel('headline-exit')
            .to(title, {
              scale: isDesktop ? 0.4 : 0.7,
              autoAlpha: 0,
              transformOrigin: 'left top',
              ease: 'none',
            }, 'headline-exit')
            .addLabel('subline-enter', 'headline-exit+=0.2')
            .fromTo(subline, { autoAlpha: 0, y: 16 }, {
              autoAlpha: 1,
              y: 0,
              ease: 'none',
            }, 'subline-enter')
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return <section ref={sectionRef} id="hero" className="relative flex min-h-[100svh] items-end overflow-hidden bg-ivory/5 px-5 pb-10 pt-32 sm:px-10 lg:px-16 lg:pb-16">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_34%,rgba(14,124,123,0.04),transparent_42%),linear-gradient(to_top,rgba(245,241,234,0.05),rgba(245,241,234,0.03),transparent)]" />
    <div className="relative z-10 w-full max-w-[1440px]">
      <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-teal">Premium dentistry · Lekki, Lagos</p>
      <h1 data-hero-title className="max-w-5xl text-[clamp(3.5rem,12vw,10rem)] font-semibold leading-[0.82] tracking-[-0.08em] text-ink">Smile<span className="text-gold">.</span></h1>
      <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <p data-hero-subline className="max-w-sm text-lg leading-snug tracking-[-0.03em] text-ink/65 sm:text-xl">Thoughtful care for the way you live, laugh, and show up in the world.</p>
        <a href="#book" className="inline-flex w-fit items-center rounded-full bg-teal px-7 py-4 text-sm font-semibold text-ivory transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]">Book your visit <span aria-hidden="true" className="ml-4 text-lg">↗</span></a>
      </div>
    </div>
  </section>
}
