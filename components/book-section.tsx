'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function BookSection() {
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
          const title = section.querySelector<HTMLElement>('[data-book-title]')
          const cta = section.querySelector<HTMLElement>('[data-book-cta]')
          if (!title || !cta) return

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            },
          })

          // The title entrance leads into a single CTA pulse at the next relative beat.
          timeline
            .addLabel('title-enter')
            .fromTo(title, { autoAlpha: 0, scale: conditions?.desktop ? 0.82 : 0.92 }, {
              autoAlpha: 1,
              scale: 1,
              duration: conditions?.desktop ? 0.25 : 0.2,
              ease: 'power2.out',
            }, 'title-enter')
            .addLabel('cta-pulse', 'title-enter+=0.2')
            .to(cta, {
              scale: 1.04,
              yoyo: true,
              repeat: 1,
              duration: 0.12,
              ease: 'power1.inOut',
            }, 'cta-pulse')
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="book" className="flex min-h-screen items-end bg-gold/70 px-5 pb-10 pt-24 sm:px-10 lg:px-16 lg:pb-16">
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.22em] text-ink/60">05 / Make it yours</p>
        <h2 data-book-title className="max-w-5xl text-[clamp(3.5rem,12vw,10rem)] font-semibold leading-[0.82] tracking-[-0.08em] text-ink">Your turn<span className="text-ivory">.</span></h2>
        <div className="mt-12 grid gap-10 border-t border-ink/20 pt-7 md:grid-cols-3">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-ink/55">Start a conversation</p>
            <a data-book-cta href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="inline-block text-xl font-semibold text-ink underline decoration-ink/30 underline-offset-4">WhatsApp us ↗</a>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-ink/55">Find us</p>
            <p className="text-lg leading-snug text-ink">12 Admiralty Way,<br />Lekki Phase 1, Lagos</p>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-ink/55">Hours</p>
            <p className="text-lg leading-snug text-ink">Mon–Fri, 8am–6pm<br />Sat, 9am–3pm</p>
          </div>
        </div>
      </div>
    </section>
  )
}
