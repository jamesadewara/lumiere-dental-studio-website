import { BrandLogo } from '@/components/brand-logo'

export function SiteFooter() {
  return (
    <footer className="relative z-10 bg-ink px-5 py-8 text-ivory sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <a href="#hero" aria-label="Lumière Dental Studio home" className="flex w-fit items-center gap-3">
          <BrandLogo size={36} />
          <span className="text-sm font-semibold tracking-[-0.02em]">Lumière Dental Studio</span>
        </a>
        <p className="text-xs text-ivory/60">Thoughtful dental care in Lekki, Lagos.</p>
      </div>
    </footer>
  )
}
