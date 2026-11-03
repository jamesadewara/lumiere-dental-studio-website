'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
          const counters = gsap.utils.toArray<HTMLElement>('[data-counter]', section)
          if (!counters.length) return

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              once: true,
            },
          })

          // The shared count-up label starts each stat together; mobile uses a shorter count.
          timeline.addLabel('count-up')
          counters.forEach((element, index) => {
            const value = { current: 0 }
            const target = Number(element.dataset.target)
            const decimals = Number(element.dataset.decimals)
            const suffix = element.dataset.suffix ?? ''
            timeline.to(value, {
              current: target,
              duration: conditions?.desktop ? 0.25 : 0.2,
              ease: 'power1.out',
              onUpdate: () => {
                element.textContent = `${value.current.toFixed(decimals)}${suffix}`
              },
            }, `count-up+=${index * 0.12}`)
          })
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="proof" className="min-h-screen bg-teal/90 px-5 py-24 text-ivory sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.22em] text-gold">04 / The proof</p>
        <div className="grid gap-6 border-y border-ivory/25 py-10 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={stat.value}>
              <p className="min-w-[4ch] text-5xl font-semibold tabular-nums tracking-[-0.07em] sm:text-7xl">
                <span data-counter data-target={stat.target} data-decimals={stat.decimals} data-suffix={stat.suffix}>{stat.value}</span>
              </p>
              <p className="mt-2 text-sm text-ivory/60">{['average rating', 'smiles cared for', 'would recommend'][index]}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name]) => (
            <figure key={name} className="rounded-[32px] bg-ink p-6">
              <blockquote className="min-h-32 text-xl font-medium leading-tight tracking-[-0.04em]">{quote}</blockquote>
              <figcaption className="mt-10 text-sm text-ivory/55">{name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
