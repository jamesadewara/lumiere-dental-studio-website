'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const treatments = [
  ['Whitening', 'From ₦150,000'],
  ['Braces / Aligners', 'From ₦850,000'],
  ['Implants', 'From ₦1,200,000'],
  ['Scaling & Polishing', 'From ₦70,000'],
  ['Root Canal', 'From ₦180,000'],
  ['Kids Dentistry', 'From ₦50,000'],
]

export function TreatmentsSection() {
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
          const stack = section.querySelector<HTMLElement>('[data-treatment-stack]')
          const cards = gsap.utils.toArray<HTMLElement>('[data-treatment-card]', section)
          if (!stack || !cards.length) return

          if (conditions?.desktop) {
            gsap.set(cards.slice(1), { yPercent: 110 })
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: stack,
                start: 'top 48%',
                end: `+=${cards.length * 28}%`,
                pin: stack,
                pinSpacing: true,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })

            // Each labeled handoff raises the next card while the previous card recedes underneath.
            timeline.addLabel('stack-start')
            cards.slice(1).forEach((card, index) => {
              const label = `card-${index + 2}`
              timeline.addLabel(label, index === 0 ? 'stack-start' : '+=0.2')
              timeline.to(cards[index], { scale: 0.96, yPercent: -3, ease: 'none' }, label)
              timeline.to(card, { yPercent: 0, ease: 'none' }, '<')
            })
          } else if (conditions?.mobile) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: stack,
                start: 'top 85%',
                end: 'bottom 70%',
                scrub: 0.4,
                invalidateOnRefresh: true,
              },
            })

            // Mobile keeps the same ordered reveal but skips the pinned card stack.
            timeline.addLabel('cards-enter').from(cards, {
              autoAlpha: 0,
              y: 16,
              stagger: 0.06,
              ease: 'power1.out',
            }, 'cards-enter')
          }
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="treatments" className="min-h-screen bg-ivory/50 px-5 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-teal">03 / Treatments</p>
            <h2 className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-ink">Care that<br />goes further<span className="text-gold">.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/55">From first visit to lasting confidence, we make every step feel considered.</p>
        </div>
        <div data-treatment-stack className="grid gap-3 bg-transparent sm:grid-cols-2 md:relative md:h-[clamp(300px,50vh,400px)] md:overflow-hidden md:block">
          {treatments.map(([name, price], index) => (
            <article
              key={name}
              data-treatment-card
              className="group flex min-h-64 flex-col justify-between rounded-[32px] border border-ink/10 bg-ivory/95 p-6 transition-colors hover:bg-teal hover:text-ivory md:absolute md:inset-0 md:min-h-0 md:origin-top"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-ink/40 group-hover:text-ivory/50">0{index + 1}</span>
                <span className="text-xl text-gold">↗</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.05em]">{name}</h3>
                <p className="mt-2 text-sm text-ink/50 group-hover:text-ivory/65">{price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
