'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  ['The clinic', '#problem'],
  ['Our approach', '#journey'],
  ['Treatments', '#treatments'],
  ['Book a visit', '#book'],
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-ink/10 bg-ivory/80 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <a href="#hero" className="flex items-center gap-2 text-sm font-semibold tracking-[-0.02em] text-ink" onClick={() => setOpen(false)}>
          <span className="grid size-7 place-items-center rounded-full bg-teal text-xs text-ivory">L</span>
          Lumière
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => <a key={href} href={href} className="text-xs font-medium text-ink/65 transition-colors hover:text-ink">{label}</a>)}
        </div>
        <a href="#book" className="hidden rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-ivory transition-transform hover:-translate-y-0.5 sm:inline-flex">Book a visit</a>
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className="grid size-9 place-items-center rounded-full bg-ink text-ivory sm:hidden" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>
      {open && <div className="mx-auto mt-2 flex max-w-[1440px] flex-col gap-4 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-lg md:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="text-lg font-medium text-ink">{label}</a>)}</div>}
    </header>
  )
}
