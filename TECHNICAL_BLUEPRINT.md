# Lumière Dental Studio — Technical Blueprint

Source reviewed: project files, `package.json`/lockfile, and all files under `public/`. This describes the current checkout; missing implementations are explicitly called out.

## 1. Stack & versions

- **Framework/runtime:** Next.js App Router `16.4.3`; React and React DOM `^19` (lockfile resolves both to `19.2.4`).
- **Language:** TypeScript `5.7.3`, strict mode.
- **Styling/build:** Tailwind CSS `^4.3.3`, PostCSS `^8.5`; `next build` uses Turbopack.
- **Package manager:** pnpm `12.3.4`; lockfile format 9. `dev`, `build`, and `start` are the only package scripts. Test/lint scripts are **not present**.
- **Animation/scroll:** GSAP `^3.15.0` (locked `3.15.0`), `@gsap/react ^2.1.2` (locked `2.1.2`), Lenis `^1.3.27` (locked `1.3.27`).
- **Other dependencies:** `@base-ui/react ^1.5.0`, `class-variance-authority ^0.7.1`, `clsx ^2.1.1`, `lucide-react ^1.16.0` (locked `1.17.0`), `shadcn ^4.11.0` (locked `4.19.0`), `tailwind-merge ^3.3.1` (locked `3.4.0`), `tw-animate-css ^1.4.0`.
- **Dev dependencies:** `@tailwindcss/postcss ^4.3.3`, `@types/node ^24`, `@types/react ^19`, `@types/react-dom ^19`, `postcss ^8.5`, `tailwindcss ^4.3.3`, `typescript 5.7.3`.

```text
project/
├── app/                 # App Router layout, page, global CSS
├── components/          # Site sections, animation/scroll infrastructure, UI
│   └── ui/
├── lib/                 # className utility
├── public/
│   ├── video/frames/
│   │   ├── desktop/
│   │   └── mobile/
│   └── logo, favicon, manifest assets
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── components.json
```

`AGENTS.md` contains generated Next.js guidance; `CLAUDE.md` asks for non-ambiguous copy/visuals. A `hooks/` alias exists in `components.json`, but the directory is **not present**. No README or test directory is present.

## 2. Design system

- **Core colors** are in `app/globals.css`: ivory `#F5F1EA`, ink `#0B1220`, teal `#0E7C7B`, gold `#C9A227`. WhatsApp green `#25D366` is inline in its component. Gradients use additional inline `rgba(...)` values.
- **Font:** Inter via `next/font/google` in `app/layout.tsx` (Latin subset, `display: 'swap'`). The body inherits the font class; no local fonts or other font families are present.
- **Responsive display sizes:** Hero and Book headings `clamp(3.5rem, 12vw, 10rem)`; Problem `clamp(3rem, 9vw, 8rem)`; Journey, Tools, Treatments `clamp(3rem, 8vw, 7rem)`; Proof `clamp(2.5rem, 6vw, 5rem)`. Treatment stack height is `clamp(300px, 50vh, 400px)`.
- **Spacing:** Mostly Tailwind defaults; section padding commonly `px-5 sm:px-10 lg:px-16`, `py-24`; cards use `p-6`; grid gaps are usually 3–4. Proof-to-Book spacing is `mt-24 sm:mt-32 lg:mt-40`.
- **Corners/effects:** Large cards use `rounded-[32px]`, navbar `rounded-full`, smaller callouts `rounded-xl`. Navbar uses `bg-ivory/80`, `backdrop-blur-xl`, `shadow-sm`; mobile menu `shadow-lg`; floating WhatsApp CTA `shadow-xl`; testimonial cards specify `shadow-none`.
- **Backgrounds:** A fixed ivory canvas is the page-wide base. Problem changes to ink on scroll. Tools uses an ivory/stone gradient; Proof a teal gradient plus fade overlay; Book a gold gradient; Footer ink. No dark-mode system or theme toggle is present; global `color-scheme` is light.
- **Tailwind config:** No `tailwind.config.*` is present. Custom color tokens are declared with `@theme inline` in global CSS.

## 3. Sections and page story

Page order in `app/page.tsx`: **Hero → Problem → Journey → Tools → Treatments → Proof → Book → Footer**. Fixed SiteNav and WhatsApp CTA are shared UI; JourneyCanvas and the optional randomized FloatingMotifs layer are mounted globally from the root layout.

| Component / ID | Purpose and content | Animation |
|---|---|---|
| `components/hero-section.tsx`, `#hero` | “Smile.”, local-care sentence, approach link, booking CTA over the global tooth sequence. | Title reveals left-to-right; copy/CTA enter; “Smile” gently breathes. Desktop pins Hero and scrubs headline scale/fade; mobile does not pin. |
| `components/problem-section.tsx`, `#problem` | Large “Dental care should feel less like a chore” headline and supporting copy. | Scrubbed transition to dark background/light text; staggered word reveal. |
| `components/journey-section.tsx`, `#journey` | Highlighted “A better beginning.” and approach copy. | Scrubbed heading/copy entrance; no pin. |
| `components/tools-section.tsx`, `#tools` | “Precision with a lighter touch.” and three cards for diagnostics, technology, and plans. | Desktop pins the section for a longer scroll beat and flips cards in order once; scroll-up does not reverse those flips. Cards return to their resting side after leaving the pin, where hover/focus/click interactions work normally. Mobile/reduced-motion do not pin. |
| `components/treatments-section.tsx`, `#treatments` | Six treatments with prices and detail panels. | Desktop pins a stacked-card stage; mobile uses a non-pinned staggered entrance. Details reveal in a panel; cards do not flip. |
| `components/proof-section.tsx`, `#proof` | Three statistics and three testimonials. | Pins/counts stats to configured maxima; a teal overlay fades across testimonial area. |
| `components/book-section.tsx`, `#book` | WhatsApp contact, address, hours, “Your turn.” CTA. | Intended one-time title entrance/CTA pulse; **currently does not run** because the effect queries `[data-book-title]`, but the heading has no such attribute. |
| `components/site-nav.tsx` | Logo, section links, booking button, mobile menu. | Starts compact with logo + booking; reveals links/menu after `scrollY > 24`; active/tap scaling. |
| `components/site-footer.tsx`, `components/whatsapp-float.tsx` | Brand footer and fixed WhatsApp link. | Small hover/tap movement on CTA; no scroll timeline. |

`components/floating-motifs.tsx` adds a client-generated set of 0–7 decorative ✳ motifs per page load (18% chance of none), with randomized gold/cream color, size, horizontal start, fall duration/delay, sideways drift, and rotation. CSS animates them from above the viewport down and fades them as they pass; on fine-pointer devices, GSAP nudges nearby motifs along pointer movement and away from the cursor, then eases them back. The global layer is `aria-hidden` and click-through; reduced-motion users get no motifs.

`<br />` remains for intentional address and hours line breaks. The former long run of spacer breaks between Proof and Book was replaced with margin.

## 4. Smooth scroll (Lenis)

`components/SmoothScroll.tsx` provides Lenis through React context and `useLenis()`. It initializes `{ lerp: 0.1, smoothWheel: true }` only when reduced motion is not requested. `@gsap/react` `useGSAP` subscribes `ScrollTrigger.update` to Lenis scroll events, advances Lenis from the GSAP ticker in milliseconds, disables ticker lag smoothing, and refreshes ScrollTrigger. A `document.fonts.ready` callback refreshes triggers after fonts load.

```tsx
const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
const tick = (time: number) => lenis.raf(time * 1000)
gsap.ticker.add(tick)
gsap.ticker.lagSmoothing(0)
// Cleanup: gsap.ticker.remove(tick); unsubscribe(); lenis.destroy()
```

Navbar anchors call `lenis.scrollTo(href)` and prevent default only when Lenis exists; native anchors remain the fallback. Reduced-motion preference changes destroy or restart the instance.

## 5. GSAP / ScrollTrigger

Client sections generally register `ScrollTrigger`, scope setup in `gsap.context()`, use `gsap.matchMedia()` for `(min-width: 768px)` / `(max-width: 767px)` with `prefers-reduced-motion: no-preference`, and revert the media/context on cleanup. `JourneyCanvas` refreshes ScrollTrigger after setup. `SmoothScroll` refreshes after Lenis initializes and when `document.fonts.ready` resolves.

| Timeline/component | Trigger; pin; scrub/start/end | Labels and animated properties |
|---|---|---|
| Hero | `#hero`; desktop pin only; scrub `1`; `top top` to `+=100%` desktop / `+=45%` mobile. | `headline-exit`: scale/autoAlpha; separate load entrance and breathing tweens. |
| Problem | Section; no pin; scrub `true`; `top bottom` to `+=100%`. | `color-shift`, `word-reveal`: section/text color and staggered word opacity/y. |
| Journey | Section; no pin; scrub `.6` desktop / `.35` mobile; `top 90%` to `top 35%`. | `title-arrives`, `copy-arrives`: opacity, y, title scale. |
| Tools | Desktop pins section, scrub `.9`, `top top` to `+=2.4 × viewport height`; mobile does not pin, scrub `.35`, `top 88%` to `top 30%`. | `tools-arrive`: opacity/y/scale entrance. Desktop ScrollTrigger progress crosses one-way card-flip thresholds; each flip uses a 700ms eased transform, state is not reversed when scrolling upward, and resets after leaving the pin. |
| Treatments | Desktop pins stack, scrub `1`, `top 48%` to `+=cards.length * 28%`; mobile no pin, scrub `.4`, `top 85%` to `bottom 70%`. | `stack-start`, `card-2`…: current card scale/y and next card yPercent; mobile `cards-enter` stagger. |
| Proof stats | Pins `[data-proof-stage]`, `pinSpacing`, scrub `.5`, `top 12%` to viewport height × `1.15` desktop / `.8` mobile. | `count-up`: each counter 0 → target. Separate fade: `top 65%` to `top 15%`, scrub `.5`. |
| Book | No pin; `once: true`, start `top 70%`. | `title-enter`, `cta-pulse`: title opacity/scale and CTA scale. Inactive until missing title data attribute is supplied. |
| Global frame sequence | Root document; no pin; scrub `.5`; `top top` to `ScrollTrigger.maxScroll(window)`. | `story-start`: frame index 0 → configured final index. |
| PageTransition | No ScrollTrigger; route pathname effect. | `page-enter`: fade to visible over 0.2s, or 0 for reduced motion. |

`ScrollHighlight` does not use a GSAP ScrollTrigger; it updates a clip-path with a passive scroll listener and `requestAnimationFrame`, so its highlight reverses when scrolling upward.

```tsx
gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 35%', scrub: 0.6 },
}).addLabel('title-arrives').fromTo(title, { y: 36, autoAlpha: 0.65 }, {
  y: 0, autoAlpha: 1, ease: 'none',
}, 'title-arrives')
```

There is no `ScrollTrigger.config({ ignoreMobileResize: true })`; font refresh is centralized in SmoothScroll rather than repeated per section.

## 6. Canvas frame scrubbing

`components/JourneyCanvas.tsx` is a fixed full-viewport 2D canvas behind the page. It references `/video/frames/desktop/f_0001.webp...` and `/video/frames/mobile/f_0001.webp...`. The actual folders contain **240 desktop frames** (`f_0001`–`f_0240`) and **200 mobile frames** (`f_0001`–`f_0200`).

- Preload uses `Image` objects with `decoding = 'async'`, a worker queue (4 concurrent normally, 2 on constrained connections), and a progress indicator until the first frame is ready. Remaining frames load in the background. First-frame failure logs an error and shows a non-blocking fallback.
- Save-Data, `slow-2g`, `2g`, or `3g` samples at strides of 4 (desktop) or 3 (mobile), retaining the last configured frame. Current constants result in 51 desktop / 41 mobile selected images. Reduced motion loads only the first frame.
- Drawing is a one-shot `requestAnimationFrame`, not a continuous loop. It rounds the requested index, falls back to a nearby loaded image if needed, scales the image width to the canvas width, centers it vertically, and paints ivory behind it.
- Canvas pixel dimensions use CSS size × `min(devicePixelRatio, 1.5)`. `ResizeObserver` updates dimensions and redraws.
- Crossing the 768px desktop/mobile breakpoint preserves the currently visible source frame on an overlay canvas, resizes the live canvas, then fades the old frame away over 900ms after the new sequence's first frame is ready. This keeps the image continuous in both resize directions; reduced-motion users skip the crossfade.
- No video decoding, model captions, or media beyond WebP sequences exist. Desktop pointer callouts use hand-authored approximate bounds only for selected early frames (through source frame 60); they are not pixel-segmented or verified anatomical maps. Scroll hides callouts.
- Frame counts are aligned with the verified sequence folders: `DESKTOP_FRAME_COUNT = 240` and `MOBILE_FRAME_COUNT = 200`; every numbered frame is included in the normal scroll timeline.
- Frame folder size on disk: desktop **3,321,872 bytes (3.17 MiB)**, mobile **2,382,444 bytes (2.27 MiB)**; average 13.5 KB and 11.6 KB per frame. The idle-only frame animation has been removed; frame selection now follows scroll only.

```ts
const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
canvas.width = Math.round(canvas.clientWidth * dpr)
canvas.height = Math.round(canvas.clientHeight * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
requestAnimationFrame(() => drawFrame(requestedFrame))
```

## 7. Three.js / R3F

React Three Fiber, Drei, Three.js components, GLB models, primitive stand-ins, `useGLTF`, `OrbitControls`, `Environment`, IntersectionObserver canvas gating, and model disposal are **not present** in application source. Those libraries are not direct dependencies in `package.json`; no model assets are present under `public/`. Do not assume a working 3D feature from older prompts or versions.

## 8. Motion (Framer Motion)

Framer Motion / `motion`, `AnimatePresence`, and related imports are **not present** in dependencies or source. Motion is implemented with GSAP, CSS transitions, and Tailwind utility classes.

## 9. Responsiveness & performance

- Uses Tailwind `sm`, `md`, `lg`; GSAP sections use 768px conditions, while canvas selection treats `max-width: 768px` as mobile (desktop begins at 769px).
- Mobile: Hero is not pinned; Treatments does not pin its card stack; grid layouts adapt through Tailwind classes; canvas selects mobile frames. Lenis is disabled for `prefers-reduced-motion`.
- Data Saver/slow-network sampling and lower preload concurrency reduce transfer. Selected images are still preloaded after mount; IntersectionObserver-based or section-level lazy frame loading is **not present**.
- Reduced motion triggers global CSS animation/transition duration reduction, loads a single canvas frame, and omits the decorative motif layer. No separate static fallback image exists.
- Logo uses `next/image`, but `next.config.mjs` sets `images.unoptimized: true`, disabling Next image optimization.
- SEO in `app/layout.tsx`: title, description, Open Graph, Twitter card, icon links, manifest, viewport theme color, and `lang="en"`. `metadataBase`, canonical URL, robots/sitemap files, structured data, and share-preview image are **not present**.
- Accessibility includes landmark elements, nav labels, mobile-menu `aria-expanded`/`aria-controls`/`inert`, focusable card buttons, `aria-hidden` background canvas and motif layer, and status text for frame loading/errors. Canvas hit regions are approximate.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`; production builds may pass despite type errors. Run `pnpm exec tsc --noEmit` independently.

## 10. Assets

`public/` has **448 files**, totaling **5,810,537 bytes (5.54 MiB)**:

| Asset | Size |
|---|---:|
| `android-chrome-192x192.png` | 11,890 B |
| `android-chrome-512x512.png` | 56,294 B |
| `apple-touch-icon.png` | 10,569 B |
| `favicon-16x16.png` | 437 B |
| `favicon-32x32.png` | 908 B |
| `favicon.ico` | 15,406 B |
| `logo.png` | 10,119 B |
| `site.webmanifest` | 598 B |
| `video/frames/desktop/f_0001.webp` … `f_0240.webp` | 240 files; 3,321,872 B total |
| `video/frames/mobile/f_0001.webp` … `f_0200.webp` | 200 files; 2,382,444 B total |

`BrandLogo` uses `/logo.png` in navbar and footer. Next metadata configures ICO, 16/32px PNG favicons, and 180px Apple touch icon; the manifest references Android 192/512px icons. No `logo.svg`, GLB, poster WebP, or video file is present.

## 11. Problems, fixes, and known issues

- Repeated `<br />` spacers between Proof and Book were replaced with responsive margin; intentional address/hours line breaks remain.
- Idle frame drift was removed so scroll is again the only source of frame selection.
- Missing implant GLB, Three.js declaration/deprecation issues, and low-fidelity model concerns from earlier iterations are moot in this checkout because 3D source/dependencies are **not present**.
- More frames improve the scroll sequence's spatial/temporal granularity, not display FPS by themselves. Actual render cadence depends on browser refresh, image decode, scroll updates, and drawing cost; keep low-bandwidth sampling enabled.
- `next.config.mjs` suppresses build-time type failures; keep standalone type-checking in CI and consider removing that override.
- WhatsApp URL is hard-coded as `wa.me/2348000000000` in two components; verify it is the real clinic number before deployment. Address, hours, prices, testimonial attribution, and Proof statistics are static and should be fact-checked.
- The global motif layer is intentionally randomized and decorative; verify the 0–7 count, no-motif case, fine-pointer response, and reduced-motion behavior if that interaction is changed.
- Book title/CTA entrance timeline currently exits early because `[data-book-title]` is missing from the heading.
- Canvas callout bounds are approximations, not accurate segmentation. No automated test suite is configured.
- Full-page frame sequences, many client-side GSAP sections, and disabled Next image optimization are the biggest performance decisions to reassess for low-bandwidth production.

## 12. Reusable vs. brand-specific

**Generic patterns:** `SmoothScroll` context and reduced-motion-aware Lenis lifecycle; `useLenis` anchors; `PageTransition`; section-level GSAP context/matchMedia/ScrollTrigger cleanup; reversible `ScrollHighlight`; network-aware canvas preloader, DPR-capped drawing, progress/error states; `BrandLogo` pattern; `cn()` Tailwind merge helper; metadata/manifest setup.

**Lumière-specific:** clinic copy, treatments/prices, Lekki address/hours, reviews/statistics, WhatsApp destination; ivory/ink/teal/gold palette; dental frame sequence and annotations; logo/favicon set and dental section names.

## 13. Rebuild order for a new site

1. Establish real content, brand constraints, accessibility requirements, and verified business/contact data.
2. Set up Next.js, TypeScript, pnpm lockfile, CSS tokens, font loading, and metadata. Keep type-checking enabled in production builds.
3. Build semantic, responsive static sections and navigation; validate keyboard and mobile behavior before animation.
4. Add reusable motion infrastructure (reduced-motion policy, GSAP context cleanup, matchMedia, Lenis only if it improves the experience).
5. Add section-level ScrollTrigger timelines; define pin/start/end behavior and test both scroll directions and mobile layouts.
6. Add canvas last: measure total bytes, align frame constants/naming with actual assets, test slow networks/errors, cap DPR, and avoid unnecessary eager loads.
7. Add 3D only when model assets, realistic fallback, mobile/low-bandwidth behavior, disposal, and device testing are ready; otherwise omit it.
8. Run type-check, production build, accessibility checks, and browser validation at desktop/mobile sizes, reduced motion, and constrained network.
9. Verify SEO output, contact links, social previews, sitemap/robots needs, and factual claims before release.
