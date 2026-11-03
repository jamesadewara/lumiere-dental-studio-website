import Image from 'next/image'

export function HeroSection() {
  return <section id="hero" className="relative flex min-h-screen items-end overflow-hidden bg-ivory px-5 pb-10 pt-32 sm:px-10 lg:px-16 lg:pb-16">
    <Image src="/placeholder.jpg" alt="Bright, calm Lumière Dental Studio treatment room" fill priority sizes="100vw" className="object-cover opacity-25" />
    <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/80 to-transparent" />
    <div className="relative z-10 w-full max-w-[1440px]">
      <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-teal">Premium dentistry · Lekki, Lagos</p>
      <h1 className="max-w-5xl text-[clamp(3.5rem,12vw,10rem)] font-semibold leading-[0.82] tracking-[-0.08em] text-ink">Smile<span className="text-gold">.</span></h1>
      <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-sm text-lg leading-snug tracking-[-0.03em] text-ink/65 sm:text-xl">Thoughtful care for the way you live, laugh, and show up in the world.</p>
        <a href="#book" className="inline-flex w-fit items-center rounded-full bg-teal px-7 py-4 text-sm font-semibold text-ivory transition-transform hover:-translate-y-1">Book your visit <span aria-hidden="true" className="ml-4 text-lg">↗</span></a>
      </div>
    </div>
  </section>
}
