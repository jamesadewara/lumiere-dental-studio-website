export function ProblemSection() {
  return <section id="problem" className="flex min-h-screen items-center bg-ink px-5 py-24 text-ivory sm:px-10 lg:px-16">
    <div className="grid w-full max-w-[1440px] gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
      <div><p className="mb-10 text-xs font-semibold uppercase tracking-[0.22em] text-gold">The old way is over</p><h2 className="max-w-4xl text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.88] tracking-[-0.075em]">Dental care should feel less like a chore<span className="text-teal">.</span></h2></div>
      <div className="border-t border-ivory/20 pt-6 lg:mb-2"><p className="max-w-md text-xl leading-snug tracking-[-0.03em] text-ivory/60">No fluorescent lights. No rushed appointments. No one-size-fits-all plans. Just calm, clear care built around you.</p></div>
    </div>
  </section>
}
