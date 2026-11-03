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
          const titleWord = section.querySelector<HTMLElement>('[data-hero-word]')
          const subline = section.querySelector<HTMLElement>('[data-hero-subline]')
          const cta = section.querySelector<HTMLElement>('[data-hero-cta]')
          if (!title || !titleWord || !subline || !cta) return

          const isDesktop = Boolean(conditions?.desktop)
          gsap.fromTo(titleWord, { clipPath: 'inset(0 100% 0 0)' }, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.8,
            delay: 0.12,
            ease: 'power2.out',
          })
          gsap.fromTo(subline, { autoAlpha: 0, x: -18 }, {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            delay: 0.24,
            ease: 'power2.out',
          })
          gsap.fromTo(cta, { autoAlpha: 0, y: 12 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            delay: 0.32,
            ease: 'power2.out',
          })
          gsap.to(titleWord, {
            scale: 1.012,
            y: -2,
            transformOrigin: 'left bottom',
            duration: 2.8,
            delay: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

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

          timeline
            .addLabel('headline-exit')
            .to(title, {
              scale: isDesktop ? 0.4 : 0.7,
              autoAlpha: 0,
              transformOrigin: 'left top',
              ease: 'none',
            }, 'headline-exit')
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return <section ref={sectionRef} id="hero" className="relative flex min-h-[100svh] items-end overflow-hidden bg-ivory/5 px-5 pb-10 pt-32 sm:px-10 lg:px-16 lg:pb-16">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_34%,rgba(14,124,123,0.04),transparent_42%),linear-gradient(to_top,rgba(245,241,234,0.05),rgba(245,241,234,0.03),transparent)]" />
    <div className="relative z-10 w-full max-w-[1440px]">
      <h1 data-hero-title className="max-w-5xl text-[clamp(3.5rem,12vw,10rem)] font-semibold leading-[0.82] tracking-[-0.08em] text-ink"><span data-hero-word className="inline-block origin-left">Smile</span><span className="text-gold">.</span></h1>
      <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <p data-hero-subline className="max-w-sm text-lg leading-snug tracking-[-0.03em] text-ink/65 sm:text-xl">Dental care in Lekki, with clear advice, gentle treatment, and time for your questions.</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <a href="#journey" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink">See our approach <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-y-1">↓</span></a>
          <a data-hero-cta href="#book" className="inline-flex w-fit items-center rounded-full bg-teal px-7 py-4 text-sm font-semibold text-ivory transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]">Book your visit <span aria-hidden="true" className="ml-4 text-lg">↗</span></a>
        </div>
      </div>
    </div>
  </section>
}
