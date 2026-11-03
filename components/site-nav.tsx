'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLenis } from '@/components/SmoothScroll'
import { BrandLogo } from '@/components/brand-logo'

const links = [
  ['The clinic', '#problem'],
  ['Our approach', '#journey'],
  ['Treatments', '#treatments'],
  ['Book a visit', '#book'],
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  function navigateTo(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false)
    if (href.startsWith('#') && lenis) {
      event.preventDefault()
      lenis.scrollTo(href)
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-ink/10 bg-ivory/80 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <a href="#hero" onClick={(event) => navigateTo(event, '#hero')} className="flex items-center gap-2 text-sm font-semibold tracking-[-0.02em] text-ink transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]">
          <BrandLogo size={32} />
          Lumière
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => <a key={href} href={href} onClick={(event) => navigateTo(event, href)} className="text-xs font-medium text-ink/65 transition-colors hover:text-ink">{label}</a>)}
        </div>
        <a href="#book" onClick={(event) => navigateTo(event, '#book')} className="hidden rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-ivory transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] md:inline-flex">Book a visit</a>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid size-9 place-items-center rounded-full bg-ink text-ivory transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className="mx-auto mt-2 flex max-w-[1440px] flex-col overflow-y-auto overscroll-contain md:hidden"
        style={{ display: open ? undefined : 'none', maxHeight: '60vh' }}
      >
        <div className="flex w-full flex-col gap-4 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-lg">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={(event) => navigateTo(event, href)} className="text-lg font-medium text-ink transition-transform duration-150 active:scale-[0.97]">
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
