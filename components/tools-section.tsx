'use client'

import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollHighlight } from './scroll-highlight'

const tools = [
  {
    name: 'Digital diagnostics',
    description: 'We use clear imaging to assess your teeth and explain what we find.',
  },
  {
    name: 'Gentle technology',
    description: 'Modern tools support careful, comfortable treatment at each visit.',
  },
  {
    name: 'Clear treatment plans',
    description: 'We explain your options and next steps before treatment begins.',
  },
]

export function ToolsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealedCountRef = useRef(0)
  const [scrollFlippedTools, setScrollFlippedTools] = useState<Set<string>>(() => new Set())
  const [manualFlipStates, setManualFlipStates] = useState<Record<string, boolean>>({})

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      const heading = section.querySelector<HTMLElement>('[data-tools-title]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-tool-card]', section)
      if (!heading || cards.length !== tools.length) return

      const media = gsap.matchMedia()
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        function revealCardsThrough(progress: number) {
          const revealCount = Math.min(tools.length, Math.floor(progress * (tools.length + 1)))
          if (revealCount <= revealedCountRef.current) return

          revealedCountRef.current = revealCount
          setScrollFlippedTools(new Set(tools.slice(0, revealCount).map((tool) => tool.name)))
        }

        function resetScrollFlips() {
          setScrollFlippedTools(new Set())
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
            pin: section,
            pinSpacing: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => revealCardsThrough(self.progress),
            onLeave: resetScrollFlips,
            onLeaveBack: resetScrollFlips,
          },
        })

        timeline
          .addLabel('tools-arrive')
          .fromTo(heading, { autoAlpha: 0.65, y: 32, scale: 0.95 }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: 'none',
          }, 'tools-arrive')
          .fromTo(cards, { autoAlpha: 0.7, y: 24, scale: 0.96 }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.035,
            ease: 'none',
          }, 'tools-arrive+=0.08')
      })

      media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              end: 'top 30%',
              scrub: 0.35,
              invalidateOnRefresh: true,
            },
          })

        timeline
          .addLabel('tools-arrive')
          .fromTo(heading, { autoAlpha: 0.65, y: 32, scale: 0.95 }, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: 'none',
            }, 'tools-arrive')
          .fromTo(cards, { autoAlpha: 0.7, y: 24, scale: 0.96 }, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: 0.035,
              ease: 'none',
            }, 'tools-arrive+=0.08')
      })

      return () => media.revert()
    }, section)

    ScrollTrigger.refresh()
    return () => context.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="tools"
      className="min-h-screen px-5 py-24 sm:px-10 lg:px-16"
    
    >
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-[1440px] flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <ScrollHighlight
              dataTitle="tools-title"
              className="max-w-3xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-ink"
              text="Precision with a lighter touch."
              highlight="lighter touch"
            />
          </div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {tools.map((tool) => {
            const isFlipped = manualFlipStates[tool.name] ?? scrollFlippedTools.has(tool.name)
            return (
              <button
                key={tool.name}
                type="button"
                data-tool-card
                aria-label={`${tool.name}: ${tool.description}`}
                aria-pressed={isFlipped}
                onClick={() => setManualFlipStates((current) => ({ ...current, [tool.name]: !isFlipped }))}
                className="group min-h-56 w-full rounded-[32px] text-left outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
                style={{ perspective: '1000px' }}
              >
                <span
                  className="relative block min-h-56 w-full rounded-[32px] transform-[rotateY(var(--card-flip))] transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:transform-[rotateY(var(--card-hover-flip))] group-focus-visible:transform-[rotateY(var(--card-hover-flip))]"
                  style={{
                    transformStyle: 'preserve-3d',
                    '--card-flip': isFlipped ? '180deg' : '0deg',
                    '--card-hover-flip': isFlipped ? '0deg' : '180deg',
                  } as CSSProperties}
                >
                  <span className="absolute inset-0 flex flex-col justify-between rounded-[32px] bg-ivory/90 p-6 [backface-visibility:hidden]">
                    <span className="max-w-[10ch] text-2xl font-semibold tracking-[-0.05em] text-ink">{tool.name}</span>
                    <span className="text-sm font-medium text-ink/55">tap to explore <span aria-hidden="true">↗</span></span>
                  </span>
                  <span
                    className="absolute inset-0 flex flex-col justify-between rounded-[32px] bg-teal p-6 text-ivory [backface-visibility:hidden]"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <span className="text-sm font-medium uppercase tracking-[0.12em] text-ivory/70">{tool.name}</span>
                    <span className="text-lg font-medium leading-snug tracking-[-0.03em]">{tool.description}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
