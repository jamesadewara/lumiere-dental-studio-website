# MASTER PROMPT: 2026 Production Website Playbook

A reusable, evidence-driven playbook for planning, designing, building, and validating a modern commercial website. It is not a promise that a prompt alone produces a profitable or “premium” site: outcomes depend on truthful business inputs, art direction, implementation quality, real-device testing, and iteration with the client.

---

## 0. How to use this file

**Recommended workflow:**
1. Complete the business, audience, conversion, content, asset, and technical brief below. Mark unknown facts `TBD`; do not fill gaps with invented claims.
2. Research the customer journey and competitive context with the owner. If access to external research is unavailable, state that limitation; do not pretend research was done.
3. Agree on a differentiated visual direction and low-fidelity section/content outline before generating a full site. Use real reference images and real assets where available.
4. Build the smallest coherent, accessible, fast baseline first. Review it in a browser at real target sizes before adding scroll choreography, 3D, or decorative effects.
5. Apply one batch at a time. Inspect the actual repository, preserve existing user changes, and validate the specific acceptance criteria for that batch.
6. Measure production behavior and revise against real content, devices, and network conditions. Report measured results separately from goals.

**Rule for the AI reading this file:** Read relevant real files before editing. Never invent repository state, versions, business facts, licenses, test results, Lighthouse scores, or browser observations. Identify assumptions and ask only when a missing decision materially changes the work. Prefer a working, maintainable result over satisfying every aesthetic suggestion in this document.

---

## 1. Project Brief (fill in)

```
Business name:
Industry / type:
City, country:
Tagline:
Target audience:
Primary goal: (e.g. WhatsApp bookings, calls, form leads)
WhatsApp number (international format, no +):
Address:
Opening hours:
Services + "from" prices (currency):
Existing brand colors / brand system (or request for a proposed system):
Font/license/hosting constraints (or request for recommendations):
Hero concept (only if one-word/editorial treatment suits the brand):
Closing CTA (only if a large typographic CTA suits the brand):
Required pages/chapters and why each is needed:
Real testimonials / stats, source and approval status (or "none"):
Is 3D needed for a user/business purpose? (yes/no/unknown; default no):
Domain:
Primary customer action and success metric:
Secondary customer actions:
What does a first-time visitor need to know before acting:
Top customer objections / questions (verified):
Competitors and links (owner supplied or researched):
Differentiation (evidence-backed, not adjectives):
Brand voice: (3 traits, words to use/avoid)
Required languages / localization:
Accessibility or regulatory obligations:
Privacy policy / data controller / retention policy:
Forms, CRM, booking provider, or payment provider:
Analytics and consent requirements:
Hosting/deployment target and environment:
Source/usage rights for all copy, photos, video, logos, fonts, testimonials, and models:
Performance budget / minimum supported devices:
```

---

## 2. Standards (always apply)

**Stack:** Choose versions from the actual repository/runtime and current official docs. Next.js App Router + strict TypeScript + pnpm + Tailwind v4 are defaults only when the project calls for them. Do not install a library just because a batch mentions it. Use one animation system unless a measured need justifies another. Lenis/GSAP, Motion, and R3F are optional, not baseline requirements.

**Design:** Do not default every business to the same “Apple-style” editorial site, hero word, gradients, glass, huge rounded cards, or scroll story. Translate the brief into an original visual system: clear positioning, deliberate type, palette, composition, imagery, and interaction. Use references for direction, not for copying protected branding or layouts. Motion must clarify hierarchy or feedback; remove motion that competes with the task.

**Quality gates (acceptance criteria, not marketing promises):**
- Establish target viewport sizes, browsers, assistive technology, real-device/network test plan, and a performance budget before implementation.
- Mobile-first layout, but verify desktop and tablet rather than assuming mobile rules scale.
- Respect `prefers-reduced-motion` for every custom animation and interaction; the non-animated experience must remain complete.
- Treat global ambient decoration (floating shapes, particles, feathers, and similar effects) as optional polish, never required content. Keep it sparse and visually quiet; randomize its count, placement, size, color, path, and timing on the client per page load, with zero elements as a valid outcome. Avoid a fixed, identical animation on every visit. If pointer-responsive, react only to a nearby fine pointer and its movement direction; keep the effect click-through, `aria-hidden`, and separate from content transforms. Disable it for reduced motion and touch-only input. Cap element count, clean up listeners/tweens, and verify that it does not obscure text, controls, or focus indicators.
- Use semantic landmarks, useful heading hierarchy, accessible names, keyboard support, visible focus, contrast checked against WCAG 2.2 AA, and meaningful alt text (empty alt for decorative images).
- Aim for one clear page-level `<h1>` and a logical outline; validate actual rendered headings, including cards and hidden content.
- Reserve media/layout space and avoid transform/animation-induced layout shift. Measure CLS; do not claim “near zero” without a run.
- Every business fact, testimonial, statistic, image/model license, and claim must have an owner-provided source or be explicitly labeled as draft/placeholding and blocked from launch.
- Keep type-checking enabled in production. Run type-check, build, and the repository's configured tests/lint; report missing scripts as missing.
- Optimize for the business outcome without dark patterns: primary action visible, understandable, operable, and measurable; provide privacy-respecting analytics only when configured.
- For forms or transactions, validate on the server, handle duplicate submissions and provider failures, give accessible success/error feedback, and avoid collecting sensitive data that is not needed. Keep secrets out of client bundles and source control.
- Meet applicable privacy, consumer, accessibility, and sector-specific legal requirements; do not present generated legal text as legal advice.
- Never report a Lighthouse score, test, device check, or deployment result unless it was actually run and its conditions are stated.

**Commercial quality means:** a clear target customer and offer, credible proof, differentiated art direction, readable content, frictionless conversion, fast and reliable operation, accessible interaction, maintainable code, and a handoff the owner can operate. A fashionable visual style alone is not a product strategy.

### Definition of done for each batch

Before calling a batch complete, state: (1) files changed, (2) acceptance criteria checked, (3) commands/tests actually run and outcomes, (4) browser/device/network conditions actually inspected, (5) known gaps and owner decisions still needed. Do not silently skip a failed check or substitute build success for browser validation.

---

## 3. Lessons from the first build (do NOT repeat)

| Mistake | Rule |
|---|---|
| `typescript.ignoreBuildErrors: true` left in `next.config` | Never set it. Run `pnpm exec tsc --noEmit` and fix errors. |
| `images.unoptimized: true` bypassed Next's image optimizer | Determine whether the deployment supports the optimizer. Use it when beneficial; otherwise provide an explicit, measured image/CDN pipeline. Always size and serve assets deliberately. |
| GSAP selector `[data-book-title]` didn't exist, so the animation silently never ran | After writing any GSAP code, verify every selector/ref exists in the markup. Prefer refs over data-attribute queries. |
| Numbered card titles all rendered as `<h1>` | One `<h1>` per page. Cards use `<h3>`. Don't use huge numbers as headings. |
| WhatsApp number was a placeholder (`2348000000000`) in two files | Single source of truth in `lib/site-config.ts`. Replace before launch. |
| Prompt said 150 frames, real folders had 240/200 | Count real frames (`dir` / `ls`), then set constants from the real count. Keep names `f_0001.webp`. |
| Three.js promised in prompts but never installed | Don't write prompts for features you won't ship. Confirm in `package.json`. |
| Frame extraction at low quality looked soft/banded | See section 6 for tested settings. |
| No `metadataBase`, sitemap, robots, structured data, OG image | Do the full SEO batch (Batch 10). |
| Eager loading the full sequence can hurt slow connections | Prioritize the first frame and nearby scroll range, bound concurrency, sample on constrained networks, and cancel stale work when practical. Choose preload policy from measured connection/device results. |
| Repeated `<br />` used as spacers | Use margin/padding utilities. |
| More frames were mistaken for more FPS | Frame count increases scroll-sequence granularity and usually transfer/decode cost; display cadence is constrained by refresh rate, image decode, device, and draw work. Measure rather than promising smoothness. |
| A generic cinematic brief produced attractive but vague output | Define what the visual communicates, its subject, continuity, crop, contrast, safe area, and brand fit. Review actual generated frames at intended sizes; reject distorted or misleading results. |
| Build completion was treated as production readiness | Also verify user journeys, real copy and links, accessibility, errors/empty states, production network behavior, SEO output, and deployment configuration. |
| AI-generated testimonials, statistics, or medical/business claims looked real | Require a source and owner approval; otherwise omit or label clearly as sample content and block launch. |
| “90+ everywhere” obscured tradeoffs and measurement variance | Set budgets and targets with a baseline, production build, repeatable test environment, and traceable before/after runs. A score is not a guarantee or substitute for user testing. |

---

## 4. Batch prompts (paste one at a time)

### Batch 1: Base site (paste into v0 / Bolt / Lovable, no animation libs)

```
Build a responsive, production-minded website for "[BUSINESS NAME]", a [INDUSTRY] in [CITY, COUNTRY], for [TARGET AUDIENCE]. First inspect the repository and available assets. Use its existing stack unless the owner approves a change; do not invent versions or install dependencies in this base batch.

**Business goal:** [PRIMARY CUSTOMER ACTION]. Success metric: [MEASURABLE OUTCOME]. Secondary action: [SECONDARY ACTION]. Explain the offer and answer [TOP VERIFIED CUSTOMER QUESTIONS] before asking visitors to act. Use only approved facts/copy. Unknown facts stay visibly marked TBD in development and must not ship.

**Creative direction:** [BRAND VOICE + VISUAL REFERENCES + DIFFERENTIATION]. Create an original design system, not a generic template or imitation. Establish color tokens, typography, spacing, responsive behavior, content hierarchy, and image art direction before building sections. Use the brief's style only if it supports the audience and conversion goal.

Create a page outline appropriate to this business; do not force the sample dental-site chapter order. Include only sections needed to build understanding and trust. Each section needs a clear purpose, content source, heading, and intended user action. Do not use empty placeholders, fake social proof, decorative metrics, or unexplained badges.

Requirements: semantic HTML; one page-level h1 and logical heading order; keyboard-accessible controls; visible focus; WCAG 2.2 AA contrast; meaningful alt text; responsive navigation; reduced-motion-safe baseline; clear form validation/errors if forms exist. Put approved business facts in one typed source of truth (for example `lib/site-config.ts`) only if that is appropriate to the repository. Keep secrets server-side. Do not add a floating WhatsApp button unless it is a verified channel that serves the audience.

Before implementation, report the proposed page outline, content/fact gaps, and asset/license gaps. Then build the static baseline and verify it in the browser at agreed widths. Do not add scroll animation yet.
```

### Batch 2: Review and harden the base

```
Review the whole codebase. Report (do not change yet): framework versions, folder tree, heading outline per page, any placeholder facts, any config that disables safety (ignoreBuildErrors, images.unoptimized), unused deps. Then fix: remove unsafe config overrides, make sure there is exactly one h1, move all business facts to lib/site-config.ts, run tsc --noEmit and pnpm build until both pass.
```

**Safer interpretation:** audit config and dependencies, but do not delete, relocate, or rewrite business content without checking for references, existing user changes, secrets, and data provenance. Consolidate only facts with a real shared source. Fix the heading outline semantically; do not mechanically force all pages into one h1 if the framework renders multiple route-specific page content.

### Batch 3: Lenis + UI motion

```
Optional: add Lenis smooth scrolling only if native scrolling is insufficient for the approved experience. First check whether Lenis/GSAP already exist and whether smooth scrolling has been requested. Do not install dependencies without authorization. If needed, use `lenis` (not the deprecated @studio-freight package) and the existing GSAP/@gsap/react setup.

Create components/SmoothScroll.tsx ("use client"):
- Initialize Lenis in useGSAP/useEffect with { lerp: 0.1, smoothWheel: true }, only when prefers-reduced-motion is not set (react to preference changes).
- Sync with GSAP: lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0).
- Cleanup on unmount (ticker.remove, unsubscribe, lenis.destroy).
- Expose lenis via React context + useLenis() so nav links call lenis.scrollTo(href) and fall back to native anchors if Lenis is absent.
- Call ScrollTrigger.refresh() once after document.fonts.ready.
Wrap the app layout. Keep UI micro-interactions under 300ms. For a collapsing/expanding navigation, animate only the needed properties with a restrained, interruptible easing; avoid layout shift and verify the compact/expanded states at actual scroll thresholds. (Add `motion` only if there is a real need such as an animated mobile menu.)
```

**Optional ambient-motion add-on** (use only when it supports the approved art direction; do not add by default):

```
Add a sparse, decorative layer that belongs to the whole page, not one section. It may randomly choose no motifs or a small capped set on each client-side page load; vary size, color, starting position, drift/fall path, duration, and delay so visits do not all begin the same way. For falling elements, enter from above, drift on a gentle path, and fade away over time rather than looping conspicuously in place.

On fine-pointer devices only, let a nearby pointer create a subtle breeze: bias the displacement along pointer travel and gently away from the pointer, then ease back when it leaves. Keep the effect decorative (`aria-hidden`, non-interactive, pointer-events none); do not change layout or block content. Use a separate inner element for pointer transforms if the outer element already has a CSS fall animation. Skip the layer for `prefers-reduced-motion` and touch-only input, cap the number of animated elements, and clean up event listeners/tweens.

Generate randomness after mount to avoid server/client hydration mismatch. Verify several page loads for variation (including the no-motif case), reduced-motion behavior, touch/non-hover fallback, pointer response and settle, and that page controls and text remain unobstructed. If those checks or the performance budget fail, reduce or remove the effect.
```

### Batch 4: GSAP timelines

```
Only if animation is approved by the design and passes the performance budget, use the existing GSAP + ScrollTrigger setup. In each client section scope setup in `gsap.context()` (or useGSAP) and revert/kill on cleanup. Use `gsap.matchMedia()` for the verified breakpoints and a `prefers-reduced-motion: no-preference` condition. Confirm installed APIs against the project's version.

Use timelines organized by interaction, not an arbitrary one-timeline-per-section rule. Add labels when they improve readability and positioning. Treat these examples as optional patterns, not a required site recipe:
- Hero: desktop pinned; headline scales 1 > 0.4 and fades while subline fades in (scrub 1). Mobile: no pin, short distance.
- Problem: background tweens light > dark, text color flips, words reveal one by one (manual span split), scrub.
- Journey/Tools: heading + cards arrive with scrubbed opacity/y/scale.
- Services: desktop pinned stacked cards sliding over each other with slight scale-down on the one beneath; mobile = staggered entrance, no pin.
- Optional sequential pinned cards: reveal/flip one card per comfortable scroll interval. Decide explicitly whether scrolling backward reverses the sequence or leaves revealed cards in place; if state is one-way, define when it resets, and ensure normal hover/focus/tap behavior resumes after the pinned stage. Test fast scroll, reverse scroll, stage entry/exit, and resize.
- Proof: stats count up (pinned briefly on desktop only), testimonials fade in.
- Book: giant text scales in once, CTA pulses once.

Rules: animation is progressive enhancement; content and primary actions work without it. Avoid layout-affecting animation; verify actual CLS. After writing each timeline, verify every ref/selector exists and test it in a browser. Cleanup all timelines/triggers/listeners. Mobile gets a simpler non-pinned experience unless testing supports a pin. Do not animate solely to satisfy this list; omit anything that does not make the experience clearer.
```

### Batch 5: Canvas scrollytelling (after frames exist, see sections 5 and 6)

```
Implement frame-by-frame scroll scrubbing only if the visual sequence improves understanding/brand experience and can fit the agreed transfer/decode budget. A frame sequence is not video playback and a larger frame count does not guarantee higher FPS.

- components/JourneyCanvas.tsx ("use client"): a canvas behind or pinned in the story (decide: global fixed canvas driven by whole-page progress, or a pinned #journey section; choose what fits the chapters and explain why).
- Frames at /video/frames/desktop/f_0001.webp... and /video/frames/mobile/f_0001.webp... Set DESKTOP_FRAME_COUNT and MOBILE_FRAME_COUNT from the REAL file counts in those folders. Choose set via matchMedia('(max-width: 768px)').
- Preload with Image objects (decoding='async'), worker queue (4 concurrent, 2 on slow connections). Show first frame as soon as it loads; load the rest in the background. Slow/Save-Data connections: sample every 3rd to 4th frame (always keep the last). Reduced motion: first frame only.
- GSAP: animate { frame: 0 } to { frame: count-1 } with ease "none" and ScrollTrigger scrub 0.5 to 1. Draw with requestAnimationFrame (one-shot, not a continuous loop).
- Draw using a documented contain/cover policy (never distort), DPR capped to the tested device budget, and set image smoothing deliberately. Redraw on resize via ResizeObserver. Paint the background color behind the image.
- Optional captions that fade in/out at set progress points inside the same timeline.
- Cleanup: kill ScrollTrigger, cancel rAF, clear image refs.
```

### Batch 6: Three.js (OPTIONAL, skip unless needed)

```
Add 3 small interactive 3D models to #tools using @react-three/fiber, @react-three/drei, and three only if the approved brief requires them. Check bundle cost, licensing, model accuracy, hardware support, and fallbacks before installing; install with the repository's package manager and confirm dependencies/assets.

- Load approved, licensed optimized models via useGLTF; show a real static fallback asset or hide the optional model if it is missing. Do not present a primitive stand-in as a realistic model.
- Each card: own small <Canvas dpr={[1,1.5]}>, OrbitControls enableZoom={false}, subtle auto-rotate, <Environment preset="studio" />.
- IntersectionObserver or the library's visibility helper: render only while visible; test that visibility changes actually invalidate demand-rendered canvases.
- Hover (desktop): tilt toward cursor. Tap (mobile): small spin.
- Below 768px, no WebGL, or reduced motion: show a static WebP image instead.
- Avoid unexpected external environment/texture downloads; inspect the network waterfall and host assets deliberately.
- Suspense with a dimension-preserving loader. Dispose only resources owned by the component; do not dispose shared cached GLTF geometry/materials/textures still used elsewhere.
- Provide keyboard-operable controls and a non-WebGL equivalent; do not make a pointer-only canvas the sole way to understand or use the feature.
```

### Batch 7: Mobile polish

```
Audit every section at 360px, 390px, 768px, 1024px, and 1440px (or the agreed target matrix). Check horizontal overflow, text zoom/reflow, tap target size, sticky-nav overlap, floating actions obscuring content, touch/hover equivalence, pinned sections, and form operation. Use an actual device/emulator where available; distinguish viewport emulation from device testing. Report issues, evidence, and fixes.
```

### Batch 8: Accessibility

```
Audit against WCAG 2.2 AA with automated and manual checks: heading/landmark structure, accessible names, keyboard-only operation and focus order, visible focus, contrast, zoom/reflow, errors/instructions for forms, target size, screen-reader announcements, alt text, decorative canvas/ambient layers hidden from assistive technology, skip link, pointer-only interaction alternatives, and reduced-motion behavior. Fix issues and report any manual checks that could not be completed. Automated tools alone do not prove conformance.
```

### Batch 9: Performance (Lighthouse)

```
Build and run the production site using the actual package scripts and deployment-like configuration. Capture a baseline before changing code. Set budgets for route JS, image/video transfer, LCP, INP, CLS, and server response based on target users/devices and current field data where available. Prioritize:
- LCP: ensure real above-the-fold content renders before optional animation/canvas; preload only a verified critical asset. Do not preload a font/image without confirming it is used for LCP.
- Use framework image optimization where it benefits this deployment; validate formats, dimensions, `sizes`, caching, and CDN behavior rather than following an unconditional config rule.
- Defer/dynamically load expensive optional client features only when this improves measured loading and does not create visible layout shifts.
- Remove unused dependencies and code based on repository and bundle evidence; don't remove packages solely from an unverified import search.
- Reserve media space and measure CLS; profile long tasks, JS hydration, image decode, and memory on a target device.
- Measure total transfer, decode/draw cadence, and frame drops for canvas sequences; adjust resolution, compression, sampling, or use a video alternative if that is better for the tested experience.
- Test constrained network/device cases and the non-animated page; verify errors and offline/failed-asset behavior as applicable.
- Report baseline and final metrics, tool/version, route, throttling/device profile, repeat count, and limitations. Do not guarantee a Lighthouse score; scores vary between runs and do not replace field/user data.
```

### Batch 10: SEO

```
Implement full SEO:
- app/layout.tsx metadata: metadataBase, title template, description, canonical, Open Graph + Twitter card with a real 1200x630 share image, theme color, lang.
- app/sitemap.ts and app/robots.ts.
- JSON-LD only for applicable entities and verified facts; use the current schema.org type that fits the business. Omit unknown fields rather than guessing coordinates, ratings, hours, prices, or social accounts.
- One h1 containing the main keyword + city naturally; descriptive h2s per section.
- Descriptive alt text where imagery conveys information, empty alt for decoration, meaningful link text, and fast content rendering.
- Local SEO notes: consistent Name/Address/Phone matching Google Business Profile.
Then list what I must do outside the code (Google Search Console, Google Business Profile, submit sitemap).
Do not keyword-stuff headings or promise rankings. Check rendered metadata and canonical URLs on the real deployed domain; include a share image only when it exists and is approved for use.
```

### Batch 11: Security, reliability, and handoff

```
Review the actual application and deployment configuration for risks that apply to this site. Do not claim a formal security audit. Check:
- Secrets and environment variables are server-only where appropriate; no credentials or private keys in source, client bundles, logs, or generated artifacts.
- Forms/API routes validate and normalize inputs server-side, constrain payloads, handle duplicate/replayed requests and provider timeouts, and return safe errors without exposing internals.
- Abuse protection is proportionate to public forms/actions (for example provider-side protection, rate limits, or spam controls); do not add invasive tracking by default.
- External links, redirects, file uploads, and user-provided content are handled safely; review dependencies and lockfile using available tooling.
- Security headers and Content Security Policy are compatible with actual framework features and deployment; avoid copying a policy that breaks fonts, images, analytics, or hydration.
- 404/error/loading states, third-party outages, booking/contact fallback, backup/rollback path, monitoring owner, and incident contact are documented.
- Privacy notice, data minimization, retention/deletion, consent requirements, and applicable legal review are confirmed by the owner. Do not invent compliance.

Run only checks available in the repository/environment; name the tools and limitations. Fix confirmed issues surgically, add tests where practical, and return a launch checklist with unresolved owner/provider decisions. Do not claim a penetration test or certification unless one was actually conducted by a qualified party.
```

---

## 5. Asset prompts (templates)

### 5a. AI video (for canvas frames)

Generate a START frame image first and agree on the visual purpose, subject accuracy, palette, composition, and transition before making a sequence. Use only tools/accounts whose output terms allow the intended commercial use. Generative output must be inspected for artifacts, misleading details, brand mismatch, and frame-to-frame continuity. Do not promise that text prompts alone guarantee a usable film.

```
Cinematic macro film for [BUSINESS/PURPOSE], one continuous unbroken shot, [DURATION], [16:9 / 9:16]. Show [SUBJECT] accurately in [CONTEXT]. The image must communicate [SPECIFIC MESSAGE], fit [BRAND ART DIRECTION], preserve [COMPOSITION/SAFE AREA], and transition coherently from [START STATE] to [END STATE]. Do not borrow recognizable campaign layouts or protected brand trade dress.

Example pacing for an 8-second clip—adapt or remove these beats to match the approved concept and actual duration:
0-2s: [OPENING SHOT AND STARTING STATE].
2-4s: [CAMERA/SUBJECT CHANGE THAT SUPPORTS THE MESSAGE].
4-6s: [TRANSFORMATION OR DETAIL, ONLY IF APPROPRIATE].
6-8s: [RESOLUTION/ENDING STATE; DO NOT ADD DECORATION WITHOUT A PURPOSE].

Use [LIGHTING/DEPTH/CONTRAST] appropriate to the subject and the actual page background. Maintain consistent subject geometry and camera continuity across frames; make all important information legible at the actual mobile crop.

Exclude only what the brief requires: [EXCLUSIONS]. Avoid invented labels, distorted anatomy/products, flicker, unrequested text/logos, discontinuities, and visual noise. Review a contact sheet at desktop and mobile crops before accepting.
```

**Mobile version:** art-direct the crop separately; do not assume the desktop image can be cropped to 9:16 without losing the subject or text-safe area. Inspect at target device dimensions. Avoid upscaling low-resolution source and verify export/license terms. If continuity fails, simplify or omit the effect rather than hide defects with more processing.

### 5b. Logo

```
Create an original logo concept for "[BUSINESS NAME]", a [INDUSTRY], based on the verified positioning and audience. Explore [ICON/WORDMARK DIRECTION] without relying on generic luxury cues. Use the approved type and palette; keep the mark legible at real header and favicon sizes. Deliver distinct wordmark and icon variants only if the identity needs both. Do not imitate an existing company's recognizable mark or trade dress.
```

Icon-only version for favicon: same concept, no text, test at 16px and 32px on light and dark browser chrome. Make a separate reversed version only if required. Prefer creating/exporting a real vector source; bitmap tracing can create rough paths and is not equivalent to a clean, editable logo. Verify the chosen tool's current export formats and commercial terms.

### 5c. 3D models (only if used)

Use only a source whose license permits the intended commercial use and comply with attribution requirements. Check current tool/model terms; do not assume generated or downloadable means commercially reusable. Before optimization, identify material, texture, animation, attribution, and file-size constraints.

```
pnpm dlx @gltf-transform/cli --help
```

Check the current CLI docs before choosing optimization flags. Set a combined transfer and GPU budget from the target devices; 500 KB per model is only a starting hypothesis, not a guarantee of fast rendering. Use primitives only when visually honest and appropriate; otherwise use a static image or omit 3D.

---

## 6. Frame extraction (Windows ffmpeg, run from the folder with the videos)

Generate to a new, empty staging directory first. Compare counts, filenames, dimensions, visual quality, and total bytes before replacing any existing sequence. Do not run broad delete commands on the only copy of user assets. Keep a backup or use version control to recover the prior sequence.

Create the staging folders once, and confirm they contain no old frames before running the extraction:

```
mkdir frames\desktop-new
mkdir frames\mobile-new
```

**Desktop (sharp, 24 fps):**
```
ffmpeg -y -i video.mp4 -vf "fps=24,scale=1280:-1:flags=lanczos" -c:v libwebp -quality 85 -compression_level 6 -preset picture frames\desktop-new\f_%04d.webp
```

**Mobile (9:16):**
```
ffmpeg -y -i video_mobile.mp4 -vf "fps=20,scale=720:-1:flags=lanczos" -c:v libwebp -quality 82 -compression_level 6 -preset picture frames\mobile-new\f_%04d.webp
```

Notes:
- Compare WebP, JPEG, AVIF, or video in the actual browsers/devices; decode speed and compression tradeoffs vary by codec implementation, image content, and hardware. Do not rely on a universal format ranking.
- Inspect gradients, edges, and details at actual display size. Quality settings are encoder-specific; test for banding/artifacts before increasing bitrate or resolution.
- Set a transfer budget from the actual page budget and connection targets. Count real frames and their bytes after extraction; align constants, sample indices, and final-frame behavior. More frames improve scroll-position granularity only when they are actually loaded and decoded; they do not increase display refresh rate or guarantee smoothness. Measure decode/draw performance on target devices.
- Frame paths used in code must match the real folder (e.g. `/video/frames/desktop/...` if under `public/video/frames`).

---

## 7. Pre-launch checklist

- [ ] `pnpm exec tsc --noEmit` and `pnpm build` pass with no overrides
- [ ] Production performance baseline and final run documented with route, tool/version, environment, throttling/device profile, repeat count, and field/lab distinction. Targets are goals, not guaranteed outcomes.
- [ ] Tested on a real mid-range Android over slow data
- [ ] Reduced-motion tested; page fully usable without animation; keyboard and screen-reader smoke tests completed
- [ ] Every phone/address/hour/price/testimonial/stat/claim has a named owner/source and approval; placeholders are absent from production
- [ ] One h1; heading outline checked
- [ ] metadataBase, canonical, OG image, sitemap, robots, JSON-LD all present and validated
- [ ] Favicon set, manifest, apple-touch-icon working
- [ ] Image delivery/optimization strategy verified in the target deployment; unused deps reviewed; frame folders meet measured budgets
- [ ] Google Search Console verified, sitemap submitted if applicable; Google Business Profile matches approved name/address/phone
- [ ] Domain, HTTPS, redirects (www/non-www) configured
- [ ] 404/not-found, form success/failure, empty/loading states, and external links verified
- [ ] Privacy notice, data collection/retention, analytics consent, and applicable legal review completed
- [ ] Production environment variables/secrets, backups, deployment rollback, and monitoring owner documented
- [ ] Handoff includes editable content source, asset/license inventory, run/build commands, and known limitations
