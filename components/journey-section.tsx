export function JourneySection() {
  return (
    <section id="journey" className="flex min-h-screen items-center bg-transparent px-5 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[0.65fr_1fr] lg:items-end">
        <div>
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-teal">01 / Your journey</p>
          <h2 className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em] text-ink">A better<br />beginning<span className="text-gold">.</span></h2>
        </div>
        <p className="max-w-md border-t border-ink/15 pt-6 text-xl leading-snug tracking-[-0.03em] text-ink/65">
          Thoughtful care, advanced tools, and a calmer experience from your first visit to your brightest smile.
        </p>
      </div>
    </section>
  )
}
