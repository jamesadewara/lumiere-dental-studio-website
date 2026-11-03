'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollHighlight } from './scroll-highlight'

const treatments = [
  { name: 'Whitening', price: 'From ₦150,000', details: 'A personalized plan to brighten your smile while protecting your enamel.' },
  { name: 'Braces / Aligners', price: 'From ₦850,000', details: 'A clear, considered path to a straighter smile, guided by regular check-ins.' },
  { name: 'Implants', price: 'From ₦1,200,000', details: 'A durable, natural-looking replacement planned around your long-term oral health.' },
  { name: 'Scaling & Polishing', price: 'From ₦70,000', details: 'A gentle professional clean to lift buildup and leave your smile feeling fresh.' },
  { name: 'Root Canal', price: 'From ₦180,000', details: 'Precise treatment focused on relieving discomfort and preserving your tooth.' },
  { name: 'Kids Dentistry', price: 'From ₦50,000', details: 'Patient, reassuring care that helps children build healthy habits with confidence.' },
]

function TreatmentCard({ name, price, details }: (typeof treatments)[number]) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <article data-treatment-card className="bg-transparent shadow-none group min-h-64 rounded-[32px] motion-safe:md:absolute motion-safe:md:inset-0 motion-safe:md:min-h-0 motion-safe:md:origin-top">
      <button
        type="button"
        aria-expanded={detailsOpen}
        aria-label={`${detailsOpen ? 'Hide' : 'Show'} details for ${name}`}
        className="relative block h-full min-h-64 w-full overflow-hidden rounded-[32px] text-left transition-transform duration-250 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal active:scale-[0.99] motion-safe:md:min-h-0"
        onClick={() => setDetailsOpen((value) => !value)}
      >
        <span className="absolute inset-0 flex flex-col justify-between rounded-[32px] border border-ink/10 bg-ivory/95 p-6">
          <span className="flex items-start justify-between">
            <span className="text-xl text-gold">↗</span>
          </span>
          <span className="block text-2xl font-semibold tracking-[-0.05em] text-ink">{name}</span>
          <span className="mt-auto block pt-2 text-sm text-ink/55">{price}</span>
          <span
            className={`absolute inset-x-0 bottom-0 rounded-b-[32px] bg-teal p-6 text-ivory transition-transform duration-250 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none ${detailsOpen ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-ivory/60">Personalized care</span>
            <span className="block text-sm leading-relaxed text-ivory/85">{details}</span>
          </span>
        </span>
      </button>
    </article>
  )
}

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
    <section ref={sectionRef} id="treatments" className="min-h-screen px-5 py-24 sm:px-10 lg:px-16" >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <ScrollHighlight
              className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-ink"
              text={'Care that\ngoes further.'}
              highlight="goes further"
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/55">From first visit to lasting confidence, we make every step feel considered.</p>
        </div>
        <div data-treatment-stack className="grid gap-3 shadow-none sm:grid-cols-2 motion-safe:md:relative motion-safe:md:h-[clamp(300px,50vh,400px)] motion-safe:md:overflow-hidden motion-safe:md:block">
          {treatments.map((treatment) => <TreatmentCard key={treatment.name} {...treatment} />)}
        </div>
      </div>
    </section>
  )
}
