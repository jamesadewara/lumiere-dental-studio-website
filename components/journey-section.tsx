'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollHighlight } from './scroll-highlight'

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      const heading = section.querySelector<HTMLElement>('[data-journey-title]')
      const copy = section.querySelector<HTMLElement>('[data-journey-copy]')
      if (!heading || !copy) return

      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        ({ conditions }) => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'top 35%',
              scrub: conditions?.desktop ? 0.6 : 0.35,
              invalidateOnRefresh: true,
            },
          })

          // Headline, copy, and accent come into focus together as the section rises.
          timeline
            .addLabel('title-arrives')
            .fromTo(heading, { autoAlpha: 0.65, y: 36, scale: 0.94 }, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: 'none',
            }, 'title-arrives')
            .addLabel('copy-arrives', 'title-arrives+=0.2')
            .fromTo(copy, { autoAlpha: 0.65, y: 24 }, {
              autoAlpha: 1,
              y: 0,
              ease: 'none',
            }, 'copy-arrives')
        },
      )

      return () => media.revert()
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section ref={sectionRef} id="journey" className="flex min-h-screen items-center bg-transparent px-5 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end">
        <div>
          <ScrollHighlight
            dataTitle="journey-title"
            className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-ink"
            text={'A better\nbeginning.'}
            highlight="better"
          />
        </div>
        <p data-journey-copy className="max-w-md border-t border-ink/15 pt-6 text-xl leading-snug tracking-[-0.03em] text-ink/65">
          Thoughtful care, advanced tools, and a calmer experience from your first visit to your brightest smile.
        </p>
      </div>
    </section>
  )
}
