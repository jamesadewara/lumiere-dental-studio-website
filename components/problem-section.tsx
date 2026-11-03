'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const headlineWords = ['Dental', 'care', 'should', 'feel', 'less', 'like', 'a', 'chore']

export function ProblemSection() {
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
          const title = section.querySelector<HTMLElement>('[data-problem-title]')
          const copy = section.querySelector<HTMLElement>('[data-problem-copy]')
          const words = section.querySelectorAll<HTMLElement>('[data-problem-word]')
          if (!title || !copy || !words.length) return

          const isDesktop = Boolean(conditions?.desktop)
          gsap.set(words, { autoAlpha: 0, y: 12 })
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: '+=100%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })

          // The shared color-shift label keeps the section palette and word reveal in sync.
          timeline
            .addLabel('color-shift')
            .to(section, { backgroundColor: 'rgba(11, 18, 32, 1)', duration: 0.5, ease: 'power3.in' }, 'color-shift')
            .fromTo(title, { color: '#0B1220' }, { color: '#F5F1EA', duration: 0.05, ease: 'none' }, 'color-shift+=0.4')
            .fromTo(copy, { color: 'rgba(11, 18, 32, 0.6)' }, { color: 'rgba(245, 241, 234, 0.6)', duration: 0.05, ease: 'none' }, 'color-shift+=0.4')
            .addLabel('word-reveal', 'color-shift+=0.1')
            .to(words, {
              autoAlpha: 1,
              y: 0,
              stagger: isDesktop ? 0.05 : 0.04,
              ease: 'none',
            }, 'word-reveal')
        },
      )

      return () => media.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return <section ref={sectionRef} id="problem" className="flex min-h-screen items-center bg-[#0B1220]/15 px-5 py-24 text-ink sm:px-10 lg:px-16">
    <div className="grid w-full max-w-[1440px] gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
      <div><h2 data-problem-title className="max-w-4xl text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.88] tracking-[-0.075em]"><span className="sr-only">Dental care should feel less like a chore</span><span aria-hidden="true">{headlineWords.map((word, index) => <span key={word} data-problem-word className="inline-block">{word}{index < headlineWords.length - 1 ? '\u00a0' : ''}</span>)}</span><span className="text-teal">.</span></h2></div>
      <div className="border-t border-ink/20 pt-6 lg:mb-2"><p data-problem-copy className="max-w-md text-xl leading-snug tracking-[-0.03em] text-ink/60">No fluorescent lights. No rushed appointments. No one-size-fits-all plans. Just calm, clear care built around you.</p></div>
    </div>
  </section>
}
