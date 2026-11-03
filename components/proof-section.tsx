'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollHighlight } from './scroll-highlight'

const stats = [
  { value: '4.9', target: 4.9, decimals: 1, suffix: '' },
  { value: '12k+', target: 12, decimals: 0, suffix: 'k+' },
  { value: '98%', target: 98, decimals: 0, suffix: '%' },
]

const testimonials = [
  ['“The most thoughtful dental experience I have ever had.”', 'Adaeze, Lekki'],
  ['“I finally look forward to my appointments.”', 'Tolu, Ikoyi'],
  ['“Beautiful space, exceptional people, brilliant results.”', 'Mariam, Victoria Island'],
]

export function ProofSection() {
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
          const stage = section.querySelector<HTMLElement>('[data-proof-stage]')
          const testimonialsBackground = section.querySelector<HTMLElement>('[data-proof-fade]')
          const counters = gsap.utils.toArray<HTMLElement>('[data-counter]', section)
          if (!stage || !counters.length) return

          if (testimonialsBackground) {
            gsap.fromTo(
              testimonialsBackground,
              { autoAlpha: 1 },
              {
                autoAlpha: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: testimonialsBackground.parentElement ?? testimonialsBackground,
                  start: 'top 65%',
                  end: 'top 15%',
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top 12%',
              end: `+=${Math.round(window.innerHeight * (conditions?.desktop ? 1.15 : 0.8))}`,
              pin: stage,
              pinSpacing: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          // Scrubbing the pinned stage keeps the maximum values in view until the count-up completes.
          timeline.addLabel('count-up')
          counters.forEach((element, index) => {
            const value = { current: 0 }
            const target = Number(element.dataset.target)
            const decimals = Number(element.dataset.decimals)
            const suffix = element.dataset.suffix ?? ''
            timeline.to(value, {
              current: target,
              duration: 0.8,
              ease: 'none',
              onUpdate: () => {
                element.textContent = `${value.current.toFixed(decimals)}${suffix}`
              },
            }, `count-up+=${index * 0.1}`)
          })
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="proof" className="text-ivory">
      <div data-proof-stage className="flex min-h-[100svh] items-center px-5 py-20 sm:px-10 lg:px-16" style={{ background: 'linear-gradient(135deg, rgba(14,124,123,0.94) 0%, rgba(12,111,110,0.96) 55%, rgba(10,99,99,0.94) 100%)' }}>
        <div className="mx-auto w-full max-w-[1440px]">
          <ScrollHighlight
            className="mb-10 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-ivory"
            text="Care that earns trust."
            highlight="Care that earns"
          />
          <div className="grid gap-6 border-y border-ivory/25 py-10 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={stat.value}>
                <p className="min-w-[4ch] text-5xl font-semibold tabular-nums tracking-[-0.07em] sm:text-7xl">
                  <span data-counter data-target={stat.target} data-decimals={stat.decimals} data-suffix={stat.suffix}>{stat.value}</span>
                </p>
                <p className="mt-2 text-sm text-ivory/70">{['average rating', 'smiles cared for', 'would recommend'][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative isolate mx-auto grid max-w-[1440px] gap-4 px-5 py-20 sm:px-10 md:grid-cols-3 lg:px-16">
        <div
          data-proof-fade
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(10,99,99,0.94) 0%, rgba(10,99,99,0.72) 45%, rgba(10,99,99,0.32) 78%, transparent 100%)' }}
        />
        {testimonials.map(([quote, name]) => (
          <figure key={name} className="relative z-10 rounded-[32px] border-0 bg-ink/90 p-6 shadow-none transition-colors duration-200 hover:bg-ink">
            <blockquote className="min-h-32 text-xl font-medium leading-tight tracking-[-0.04em]">{quote}</blockquote>
            <figcaption className="mt-10 text-sm text-ivory/65">{name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
