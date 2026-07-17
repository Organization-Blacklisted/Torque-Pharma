# Torque Pharma — Performance & Architecture Audit

**Stack:** Next.js 16.2.7 (App Router, Turbopack) · React 19.2.4 · TypeScript 5 (strict) · Tailwind CSS v4
**Method:** Full-codebase read — 473 source files, 30 routable paths, 139 components (52 `"use client"`), 33 API/action modules, all config, styles, fonts, and measured `public/` asset sizes.
**Audit date:** 2026-07-16
**Scope note:** This is a *report only* — no code was changed.

---

## 1. Executive Summary

The foundation is **genuinely strong and modern**. The team already does the hard things right: a server-first component tree (only 37% of components are client islands), ISR with granular cache tags + a secret-gated on-demand revalidation route (using the *current* Next 16 `revalidateTag(tag, { expire: 0 })` API), centralized server-side HTML sanitization, `Promise.all` on every multi-fetch page (zero request waterfalls), AVIF/WebP image config, a solid security-header set, and `next/font` with `display:swap` + `adjustFontFallback`. Four of five form sections already code-split their heavy phone/validation deps with `dynamic(ssr:false)`. This is above-median engineering.

The problems are **concentrated and fixable** — mostly asset discipline, SEO surface, and a handful of correctness/a11y gaps — not architectural rot. Two issues are critical because they directly hurt the highest-traffic path:

1. **A 2.24 MB `dots.svg` is force-preloaded (`priority`) on the homepage** while sitting below the fold, competing with the hero for LCP bandwidth. A 110 KB optimized raster twin sits unused in the same folder.
2. **`sanitize-html` (~50–65 KB gzip) leaks into the client bundle** on `/blogs/[slug]`, `/life-at-torque`, and `/category/*` because three `"use client"` components import `SafeHtml`.

Beyond those: no `sitemap.ts`/`robots.ts`/Open Graph/JSON-LD (large SEO miss for a marketing site), ~58 MB of orphaned media in `public/` (including a 48.78 MB video) shipped on every deploy, all ~10 forms are placeholder-only (no `<label>`/`aria-*` — a WCAG failure), and a few concrete correctness bugs (résumé upload exceeds the Server Action body limit, a `setTimeout` leak, a date hydration mismatch, news pagination silently truncated).

**Three documentation facts to correct up front** (`CLAUDE.md` is stale and misled one of the analysis passes):
- `error.tsx`, `loading.tsx`, `not-found.tsx` **exist** and wrap the whole tree. The "known issue" saying they don't is outdated. (The real gap is narrower — see H3.)
- Sanitization uses **`sanitize-html`, not DOMPurify**. There is zero DOMPurify in the repo.
- `about.ts` and `manufacturing.ts` **exist** and are wired.

### Scores

| Axis | Score | One-line rationale |
|---|---|---|
| **Performance** | **62 / 100** | Excellent server-first + code-split foundation, dragged down by 2 critical preload/bundle mistakes, a site-wide 177 KB logo preload, eager GSAP, and no streaming. |
| **Scalability** | **70 / 100** | Best-in-class ISR/tag/revalidate design; held back by 58 MB deploy bloat, cache-tag doc drift, unbounded/ truncated list fetches, and a build that hard-fails on any API blip. |
| **Maintainability** | **67 / 100** | Strong conventions and clean raw→typed boundaries; significant cross-file duplication (forms ×6, sliders, crossfade ×4, legal ×3), dead code, a phantom dependency, and stale docs. |

---

## Progress Tracker — updated 2026-07-16 (end of session)

Legend: ✅ done & pushed · 🅿️ parked (blocked on external input) · ⬜ open

**✅ Done & pushed**
- ✅ **C1** — `dots.svg` `priority` removed + lazy/sizes (kept SVG per client) · commit `a4cf428`
- ✅ **C2** — `sanitize-html` removed from ALL client bundles (incl. via `SectionHeader`) + `server-only` guard · `a4cf428`
- ✅ **H3** — blog/event unknown slugs return real 404 not 500 · `f5109c7`
- ✅ **H4** — `<JsonLd>` component wired on product/blog/legal/country; dormant until backend fills `seo.schema` · `47e98ea` *(see correction)*
- ✅ **H5** — ~67 MB orphaned `public/` media + dead `homepage.mock.ts` deleted · `0778092`
- ✅ **H8** — every form field given a screen-reader name, zero visual change · `5eec4ae`
- ✅ **M14** — `apiFetch` timeout + retry w/ exponential backoff · `a4cf428`
- ✅ Docs/other — CLAUDE.md stale facts fixed · `391b8e1`; country detail form wired to POST `/form/country-enquiry` (verified HTTP 201) · `051a0bb`
- ✅ **H7** — added the 8 missing cache tags to the CLAUDE.md table (`blog-{slug}`, `country-{slug}`, `country-categories`, `product-{slug}`, `dealer`, `white-label`, `history`, `life-at-torque`)

**🅿️ Parked — blocked on external input**
- 🅿️ **H1** (`sitemap.ts`/`robots.ts`) + **H2** (Open Graph / `metadataBase`) — need the **production URL** + a 1200×630 share image.
- 🅿️ **H9** (177 KB logos) — they're **raster PNGs (3000×866) wrapped in SVG, not vector**; SVGO won't help. Need a real vector export from design, or a raster downscale.

**⬜ Open — no blocker (good next-session candidates)**
- ⬜ **H6** résumé upload exceeds the 1 MB Server Action limit
- ⬜ **H10** `EnquirySupportSection` eagerly bundles 3 phone forms · ⬜ **H11** `ImageCycler` `setTimeout` leak · ⬜ **H12** GSAP eager on `/our-history` · ⬜ **H13** `BuiltOnSection` unsanitized XSS sink
- ⬜ Most Medium/Low items (M1–M21 except M14; L1–L18)

**Corrections to findings below (verified this session):**
- **H4** — `seo.schema` is currently **null across the entire API**; it isn't being "discarded", it's empty. Frontend now renders it automatically once the backend populates it.
- **H9** — the logos are **raster PNGs embedded in an SVG**, not verbose vector; the "SVGO → <10 KB" recommendation doesn't apply.

---

## 2. Severity Tally

| Severity | Count | Theme |
|---|---|---|
| 🔴 Critical | 2 | Homepage LCP asset + client-bundle sanitizer leak |
| 🟠 High | 13 | SEO surface, deploy bloat, form a11y, correctness bugs, avoidable client JS |
| 🟡 Medium | 21 | Image optimization, streaming, duplication, validation, doc drift |
| ⚪ Low | 18 | Token hygiene, dead files, minor timers, phantom deps |

Editorial note: Critical + High findings below get the full treatment (why / impact / current / recommended / expected). Medium findings get why + impact + recommendation. Low findings are tabulated. Every claim cites a file that was read directly.

---

## 3. Critical Findings

### 🔴 C1 — 2.24 MB `dots.svg` preloaded (`priority`) on the homepage, competing with hero LCP

- **File:** [WorldMap.tsx:145](torque-pharma/src/components/ui/WorldMap/WorldMap.tsx#L145) → `/public/images/map/dots.svg` (**2,243,855 B**), rendered on the homepage via [page.tsx:48](torque-pharma/src/app/page.tsx#L48) → `HomeGlobalPresenceSection`.
- **Why:** `<Image src="/images/map/dots.svg" fill priority />`. `priority` emits `<link rel="preload" as="image">` in `<head>`, and Next passes SVGs through **unoptimized**. So a 2.24 MB file is force-preloaded on first paint even though the map is far below the fold — racing the hero poster (the true LCP element) for bandwidth.
- **Impact:** Performance (LCP) — **High**; SEO (Core Web Vitals) — High. On mid-tier 4G this alone can delay hero LCP by **1–3 s**.
- **Current:**
  ```tsx
  <Image src="/images/map/dots.svg" fill priority className="..." />
  ```
- **Recommended:** Drop `priority` (let it lazy-load below the fold); wire the already-present optimized raster `public/images/map/map-image-optimized.png` (**110 KB**, currently 0 references) via `<Image>` with real `sizes`, or SVGO the vector. Serve the small raster to mobile.
- **Expected:** Removes 2.24 MB from the critical preload path → hero LCP **−1 to −3 s** on mobile; asset ~2 MB → ~110 KB if rasterized.

### 🔴 C2 — `sanitize-html` (+ htmlparser2 + entities) ships in the client bundle on 3 content routes

- **Files:** [sanitize.ts:1](torque-pharma/src/lib/sanitize.ts#L1) (no `server-only` guard) → [SafeHtml.tsx](torque-pharma/src/components/ui/SafeHtml/SafeHtml.tsx) (directive-less "shared" module) → imported by client components [BlogPostBody.tsx:5](torque-pharma/src/components/sections/blog/BlogPostBody/BlogPostBody.tsx#L5), [LatWorkplaceSection.tsx:9](torque-pharma/src/components/sections/life-at-torque/LatWorkplaceSection/LatWorkplaceSection.tsx#L9), [ProductDetailSection.tsx:8](torque-pharma/src/components/sections/products/ProductDetailSection/ProductDetailSection.tsx#L8).
- **Why:** In the App Router, a directive-less module imported by a Client Component is compiled **into the client bundle**. `SafeHtml.sanitize()` then runs in the browser on these routes, shipping `sanitize-html` 69 KB + `htmlparser2` 299 KB + `entities` 383 KB + `parse-srcset` 122 KB on disk (≈ **50–65 KB min+gzip**).
- **Impact:** Performance (TBT/INP + transfer) on `/blogs/[slug]`, `/life-at-torque`, `/category/*` — **High**; Security — Medium (sanitization on the client is weaker than at the server trust boundary); Scalability — every future client component using `<SafeHtml>` inherits the leak.
- **Critical nuance:** The blog fix is **not** a one-liner. [blog-post.ts:56](torque-pharma/src/lib/api/blog-post.ts#L56) runs only `normalizeDescription()` on the body — **not** `sanitize()` — so the client-side sanitize is currently *load-bearing*, not redundant. Deleting it without moving sanitize upstream would ship unsanitized CMS HTML.
- **Recommended:** Move sanitization into the API transform layer (extend `normalizeDescription` to call `sanitize`, matching the 7 fetchers that already sanitize server-side), then render pre-cleaned HTML via a plain `dangerouslySetInnerHTML` in the client component. Add `import "server-only"` to `sanitize.ts` so any future client import fails the build.
- **Expected:** ~50–65 KB gzip removed from those routes' client bundles; faster hydration/INP; sanitization restored to the server.
- **Memory correction:** the note "sanitize-html client bundle already fixed" is only **partially** true — these three routes remain.

---

## 4. High Findings

### 🟠 H1 — No `sitemap.ts` and no `robots.ts`

- **File:** absent (should be `src/app/sitemap.ts`, `src/app/robots.ts`).
- **Why:** A 25+ page marketing site with 5 dynamic collections (blogs, products, categories, events, countries) ships no sitemap and no crawl policy. On-demand-generated detail pages may never be discovered. The data to build a sitemap already exists (`getBlogs`, `getEvents`, `getCountryCategories`, `getSiblingCategories`).
- **Impact:** SEO — **High**; Scalability — Medium (worsens as content grows).
- **Recommended:** Add `src/app/sitemap.ts` reusing existing fetchers to enumerate URLs; add `src/app/robots.ts` referencing the sitemap and disallowing `/api/`.
- **Expected:** Full, timely indexation of dynamic routes.

### 🟠 H2 — No Open Graph / Twitter / `metadataBase` / canonical anywhere

- **File:** [layout.tsx:7](torque-pharma/src/app/layout.tsx#L7) (root metadata has no `metadataBase`, no default `openGraph`); every page metadata block lacks OG + canonical.
- **Why:** Without `metadataBase`, Next can't resolve absolute OG/canonical URLs (also a build warning). No page emits social cards, so every shared link renders bare — a core channel for pharma marketing. No `alternates.canonical` → duplicate-content risk, especially `category/[parent]/[slug]` reachable under two parents.
- **Impact:** SEO — **High**.
- **Current:** `title:{default,template}`, `description:"Torque Pharma"` (also a weak placeholder).
- **Recommended:** Add `metadataBase: new URL(process.env.SITE_URL!)` + default `openGraph`/`twitter` in the root layout; per-page `alternates.canonical` + page-specific `openGraph`.
- **Expected:** Rich social cards, correct canonicalization, no build warning.

### 🟠 H3 — `blogs/[slug]` and `events/[slug]` turn 404s into 500s

- **Files:** [blogs/[slug]/page.tsx:24](torque-pharma/src/app/blogs/[slug]/page.tsx#L24) & the page body; [events/[slug]/page.tsx:29](torque-pharma/src/app/events/[slug]/page.tsx#L29) & body.
- **Why:** `apiFetch` throws on any non-2xx ([fetcher.ts:37](torque-pharma/src/lib/api/fetcher.ts#L37)). These two routes call `getBlogPost`/`getEventDetail` **without `.catch`**, so a missing slug (allowed by `dynamicParams`) throws *before* the `notFound()` guard runs — and `generateMetadata` throws even earlier. The throw bubbles to the root `error.tsx`, so users/crawlers get a 500-class "Something went wrong" instead of a real 404. **This is the accurate version of the "unhandled crash" concern** — `error.tsx` exists (contrary to the stale CLAUDE.md), so most routes degrade gracefully; only these two mishandle the 404 case.
- **Impact:** SEO — **High** (soft-404s indexed, wrong status, crawl budget wasted); UX — Medium.
- **Current:** `const post = await getBlogPost(slug); if (!post ...) notFound();`
- **Recommended:** Mirror the reference pattern already used in `product/[slug]` and `country/[slug]`:
  ```ts
  const post = await getBlogPost(slug).catch(() => null);
  if (!post || post.status !== "published") notFound();
  // + wrap generateMetadata body in try/catch returning a fallback title
  ```
- **Expected:** Correct 404 status + `not-found.tsx` UI; no 500s from valid-looking URLs.

### 🟠 H4 — API supplies JSON-LD (`seo.schema`) but the frontend discards it

- **Files:** [pages.ts:18](torque-pharma/src/lib/api/pages.ts#L18) (`schema` in `Seo`); [product.ts:16](torque-pharma/src/lib/api/product.ts#L16) raw has `schema` but the transformed `ProductDetailData.seo` omits it.
- **Why:** The Laravel `seo` object includes structured-data JSON, but no page renders it as `<script type="application/ld+json">`, and `product.ts` strips it. Structured data the CMS produces is thrown away — no Organization/Article/Product/FAQ/Breadcrumb markup reaches the page.
- **Impact:** SEO — **High** (no rich-result eligibility).
- **Recommended:** Render `page.seo.schema` / `product.seo.schema` in a JSON-LD script (keep `schema` in the product transform); add a global Organization JSON-LD in the root layout.
- **Expected:** Rich-snippet eligibility on blog, product, category, legal pages.

### 🟠 H5 — ~58 MB of orphaned heavy media in `public/`

- **Assets (measured, unreferenced in `src`):** `videos/about/overview.mp4` **48.78 MB**, `videos/manufacturing/together-better.mp4` **9.35 MB**, `images/map/map.svg` **3.06 MB**, `images/map/map locations.png` **1.18 MB**, `about-banner-image.png` **1.86 MB** (a 73 KB `.webp` twin already exists), plus others. Only `/videos/Higher-Standards.mp4` is actually referenced ([home.ts:269](torque-pharma/src/lib/api/home.ts#L269)).
- **Why:** Production media comes from the CDN (absolute API URLs); these locals are dev leftovers. Everything in `public/` is uploaded on every Vercel deploy and edge-served. A stray link to `overview.mp4` = a 48 MB payload.
- **Impact:** Scalability (deploy size/time) — **High**; risk (accidental 48 MB link); repo hygiene.
- **Recommended:** Delete orphaned media; host on CDN only. Keep genuinely-referenced locals (`Higher-Standards.mp4`, used map SVGs, logos, icons).
- **Expected:** ~58 MB off the deploy artifact.

### 🟠 H6 — Résumé upload (base64 JSON) will exceed the 1 MB Server Action limit

- **File:** [career-application.ts:14](torque-pharma/src/lib/actions/career-application.ts#L14) (`resume_base64`), posted as JSON. `next.config.ts` sets **no** `experimental.serverActions.bodySizeLimit`.
- **Why:** Next 16's Server Action body limit defaults to **1 MB**. Base64 inflates a file ~33%, so any résumé over ~750 KB raw fails at the platform layer *before* the action runs. No server-side size/MIME guard either (client caps at 15 MB — which can't even be delivered).
- **Impact:** Correctness — **High** (real 1–3 MB PDFs silently fail with a generic error); Scalability.
- **Recommended:** Switch to `multipart/form-data` (`FormData`) so the file streams, **or** raise `bodySizeLimit` deliberately (e.g. `'8mb'`) *and* validate size/type server-side.
- **Expected:** Uploads succeed for realistic files; ~33% less memory.

### 🟠 H7 — Cache-tag table in CLAUDE.md is stale — 8 live tags undocumented

- **Tags emitted in code but missing from the CLAUDE.md table:** `blog-${slug}` ([blog-post.ts:53](torque-pharma/src/lib/api/blog-post.ts#L53)), `dealer`, `white-label`, `product-${slug}`, `country-${slug}`, `country-categories`, `history`, `life-at-torque`.
- **Why:** That table is the contract Laravel reads to know which tags to POST to `/api/revalidate`. A tag not listed → Laravel never busts it → those pages stay stale for the full 1-hour window after an editor publishes. This silently defeats on-demand revalidation for dealer, white-label, history, life-at-torque, and **every country, product, and individual blog-post page**.
- **Impact:** Content-ops correctness / Maintainability — **High**.
- **Recommended:** Add the 8 rows; document that editing a blog post must bust **both** `blog-${slug}` and `blogs`.
- **Expected:** On-demand busting works for all routes.

### 🟠 H8 — All ~10 forms are placeholder-only (no `<label>`, no `aria-*`)

- **Files:** primitives [FormInput.tsx:7](torque-pharma/src/components/ui/Form/FormInput.tsx#L7), [FormTextarea.tsx:7](torque-pharma/src/components/ui/Form/FormTextarea.tsx#L7), [FormField.tsx:9](torque-pharma/src/components/ui/Form/FormField.tsx#L9); consumed by ConnectForm, CareerFormSection, CountryForm, the 3 EnquirySupport forms, DealerForm, GpGlobalForm.
- **Why:** `FormInput` renders a bare `<input>` with only `placeholder`; `FormField` emits no `<label>`. Placeholders vanish on input and are not a label substitute — **WCAG 2.1 SC 1.3.1 / 3.3.2 / 4.1.2** (technique failure F82). Validation errors have no `id`, and inputs have no `aria-describedby`/`aria-invalid`, so screen readers get no field↔error association (only a red ring). Rooted in shared primitives → systemic.
- **Impact:** Accessibility / legal compliance — **High**; SEO — Medium.
- **Recommended:** Add a real `<label htmlFor>` (visually-hidden if design requires) or `aria-label` in the primitives; auto-wire ids in `FormField`; add `aria-describedby` + `aria-invalid` + `role="alert"` on the error. One primitive fix repairs every form.
- **Expected:** WCAG-conformant forms site-wide from a single change.

### 🟠 H9 — 177 KB logo SVG preloaded (`priority`) on every route

- **File:** [Header.tsx:66](torque-pharma/src/components/layouts/Header/Header.tsx#L66) — `<Image src="/torque-black.svg" priority />`; `torque-black.svg` = **177 KB** (and `torque-white.svg` 177 KB in the Footer). Header is in the root layout → preloads on **every page**.
- **Why:** A logo SVG should be < 10 KB; 177 KB implies un-minified paths or embedded raster. `priority` puts it in the LCP contention window site-wide.
- **Impact:** Performance (LCP contention on every route) — **High**; transfer.
- **Recommended:** SVGO the logo (expect < 10 KB); drop `priority` unless the logo is genuinely the LCP.
- **Expected:** ~167 KB per route off the preload path.

### 🟠 H10 — `EnquirySupportSection` statically bundles 3 phone-input forms on `/contact-us`

- **File:** [EnquirySupportSection.tsx:6](torque-pharma/src/components/sections/contact/EnquirySupportSection/EnquirySupportSection.tsx#L6).
- **Why:** `ManufacturingForm` + `WhiteLabelForm` + `ExportForm` each pull `react-phone-number-input/min` + `libphonenumber-js/min` + `react-hook-form` + `zod`. All three load on `/contact-us` though only one tab shows. The fix is already proven in 4 sibling sections.
- **Impact:** Performance (initial JS/TBT on `/contact-us`) — **High**.
- **Current:** `import ManufacturingForm from "./ManufacturingForm"` (+ 2 more).
- **Recommended:** `const ManufacturingForm = dynamic(() => import("./ManufacturingForm"), { ssr:false })` for all three.
- **Expected:** ~2/3 of contact-page form JS deferred; only the active tab's chunk loads. (Same pattern also needed for `CareerFormSection`, which imports `PhoneInput` eagerly — [CareerFormSection.tsx:8](torque-pharma/src/components/sections/career/CareerFormSection/CareerFormSection.tsx#L8).)

### 🟠 H11 — `ImageCycler` leaks a nested `setTimeout` (setState after unmount)

- **File:** [ImageCycler.tsx:36](torque-pharma/src/components/ui/ImageCycler/ImageCycler.tsx#L36).
- **Why:** The outer `timeoutId`/`intervalId` are cleared on cleanup, but the nested `setTimeout(..., SLIDE_MS)` created each interval tick is untracked. Unmounting mid-transition fires it after unmount → `setState` on a dead component (React warning + wasted work).
- **Impact:** Correctness / memory — **High** (only clean-lifecycle finding at this severity).
- **Recommended:** Track the inner timeout in a variable and `clearTimeout` it in the effect cleanup (WorldMap already does this correctly).
- **Expected:** No post-unmount state updates.

### 🟠 H12 — GSAP stack eagerly bundled on `/our-history`

- **File:** [HistJourneySection.tsx:4](torque-pharma/src/components/sections/history/HistJourneySection/HistJourneySection.tsx#L4) — `gsap` + `ScrollTrigger` + `ScrollToPlugin` + `Observer` + `registerPlugin` at module scope in a `"use client"` component wired at [our-history/page.tsx:24](torque-pharma/src/app/our-history/page.tsx#L24).
- **Why:** ~50–70 KB gzip loads eagerly for a below-the-fold, scroll-driven section. (Plugin subpath imports are the *correct* tree-shakeable style — the issue is eagerness.)
- **Impact:** Performance (initial JS/TBT on `/our-history`) — **High**.
- **Recommended:** `dynamic(() => import("./HistJourneySection"), { ssr:false })` at the page — the exact pattern already used for 4 forms.
- **Expected:** ~50–70 KB gzip deferred off initial load. *(Memory note "HistJourneySection: DO NOT BUILD YET" is stale — it is built and wired.)*

### 🟠 H13 — Unsanitized `dangerouslySetInnerHTML` fed raw API HTML

- **File:** [BuiltOnSection.tsx:15](torque-pharma/src/components/sections/about/BuiltOnSection/BuiltOnSection.tsx#L15) (sink) ← [about.ts:155](torque-pharma/src/lib/api/about.ts#L155) (source, no `sanitize()`).
- **Why:** `about.ts` sets `subTitle` from raw CMS HTML with no sanitization; the component injects it raw. Every other heading with inline markup goes through `SafeHtml`. Stored-XSS exposure if a CMS editor/compromise injects markup.
- **Impact:** Security (stored XSS) — **High**; Maintainability (deviates from the codebase norm).
- **Recommended:** Sanitize at source — `subTitle: sanitize(data.content.built_on_section.sub_title)` — or render via `<SafeHtml>`.
- **Expected:** Closes the one genuinely-raw sink.

---

## 5. Medium Findings

| # | Finding | File(s) | Why it matters | Recommendation |
|---|---|---|---|---|
| M1 | Multi-MB region SVGs on `/global-presence` | [GpPresenceSection.tsx:12](torque-pharma/src/components/sections/global-presence/GpPresenceSection/GpPresenceSection.tsx#L12) — `south-america-map.svg` 2.36 MB, `asia-map.svg` 1.52 MB | Heavy parse/paint on tab switch (INP), mobile memory | SVGO (40–70% cut) or rasterize per breakpoint |
| M2 | `FeaturedBlogSlider` date format → hydration mismatch | [FeaturedBlogSlider.tsx:10](torque-pharma/src/components/ui/FeaturedBlogSlider/FeaturedBlogSlider.tsx#L10) | `toLocaleDateString` in a client component uses runtime TZ; UTC server vs local client renders a different day → hydration warning + patch | Pass `timeZone:"UTC"`, or format server-side and pass a string. (`BlogPostHero` uses the same call but is a *server* component — safe.) |
| M3 | Server actions have zero server-side validation | all of [lib/actions/](torque-pharma/src/lib/actions/) | `"use server"` actions are public POST endpoints; zod lives only in client components, so a direct POST bypasses all validation | Re-run a shared zod schema (`safeParse`) at the top of each action; return `fieldErrors` |
| M4 | No Content-Security-Policy | [next.config.ts:24](torque-pharma/next.config.ts#L24) | Good headers otherwise, but no CSP despite 3 `dangerouslySetInnerHTML` sinks | Add CSP (`default-src 'self'`, explicit `img-src` CDN, `frame-ancestors 'none'`) |
| M5 | No `global-error.tsx` | `src/app/` | Root `error.tsx` doesn't catch errors thrown in the root **layout** (fonts, Header/Footer render) → Next's unstyled default | Add a minimal `global-error.tsx` (renders its own `<html><body>`) |
| M6 | `getNews()` silently drops pagination | [news.ts:15](torque-pharma/src/lib/api/news.ts#L15) | Returns page 1 and discards `meta.last_page/total`; `/news` list is permanently truncated if total > per_page | Loop `meta.last_page` or expose `meta` and paginate |
| M7 | `unoptimized` on raster CDN images (10 files) | CertCard, NewsCard, CertLightbox, AccreditationCard, NewsHeroSection, EventTestimonialsSection, CertificationsSection, HistJourneySection ×2 | Ships full-size PNGs with no AVIF/WebP conversion or resize | Remove `unoptimized` for raster sources (keep only for SVG) → 50–80% byte cut |
| M8 | `WorldMap` timers never pause off-screen/hidden tab | [WorldMap.tsx:93](torque-pharma/src/components/ui/WorldMap/WorldMap.tsx#L93) | `setInterval` runs continuously below the fold, unlike `StatRotator` which pauses via IO + `visibilitychange` | Reuse the StatRotator visibility-pause pattern |
| M9 | No Suspense / PPR streaming | every `page.tsx` | Each page blocks on one aggregated `await` before any HTML streams; only a spinner shows | Wrap below-fold sections in `<Suspense>` / enable Next 16 PPR to stream the hero shell immediately |
| M10 | Three legal routes are copy-paste triplicates | terms-and-conditions / privacy-policy / disclaimer `page.tsx` + `loading.tsx` + `error.tsx` | 9 files differ only by a slug string; any fix drifts | Collapse into one `(legal)/[slug]/page.tsx` route group with shared boundaries |
| M11 | `product/[slug]` has no `generateStaticParams` | [product/[slug]/page.tsx](torque-pharma/src/app/product/[slug]/page.tsx) | Highest-value commercial pages get the slowest cold TTFB and least crawl-friendliness; sibling `category/*` does prerender | Add `generateStaticParams` (a `getProducts()` list fetcher) |
| M12 | Stub pages are indexable thin content | company / products / capabilities `page.tsx` | `<h1>`-only but ship indexable metadata; `/products` also collides with `/product/*` and `/category/*` IA | Add `robots:{index:false}` until built; resolve the `/products` overlap |
| M13 | `BlogPostBody` is a needless client component | [BlogPostBody.tsx:1](torque-pharma/src/components/sections/blog/BlogPostBody/BlogPostBody.tsx#L1) | Only a trivial `useMemo`; forces the whole article body + `SafeHtml` into the client bundle (compounds C2) | Drop `"use client"`; compute `tocItems` inline on the server |
| M14 | Build hard-fails if API is unreachable at build time | [fetcher.ts:18](torque-pharma/src/lib/api/fetcher.ts#L18) + uncaught page fetches | No timeout/AbortController; an API 5xx/timeout during `next build` fails the whole build (and can hang) | Add a fetch timeout; let non-critical `generateStaticParams` degrade to `[]` (on-demand ISR) |
| M15 | `target:"ES2017"` + no `browserslist` | [tsconfig.json:3](torque-pharma/tsconfig.json#L3) | *Accuracy note:* Next's client output is governed by **SWC + browserslist**, not tsconfig `target` — and no `browserslist` is defined. Bumping `target` alone won't shrink the client bundle | Add an explicit `browserslist` (e.g. `"defaults and supports es6-module"`); bump `target` to ES2022 for server/types consistency |
| M16 | `noUncheckedIndexedAccess` absent | [tsconfig.json:7](torque-pharma/tsconfig.json#L7) | `strict:true` is on, but risky index access exists (`.split(",")[1]`, regex `.match()` destructuring, `POSITIONS[...]`) | Enable it and fix fallout |
| M17 | Form primitives duplicated ×6 | ExportForm / ManufacturingForm / WhiteLabelForm / GpGlobalForm / CountryForm / CareerFormSection | Identical `FormSelect`, `SuccessState`, `<Controller>+PhoneInput`, and zod validators repeated ~6× | Extract `ui/Form/FormSelect`, `FormSuccess`, `PhoneField`, shared zod module |
| M18 | Count-up animation duplicated | [StatCard.tsx:29](torque-pharma/src/components/ui/StatCard/StatCard.tsx#L29) & [CapabilityCard.tsx:39](torque-pharma/src/components/ui/CapabilityCard/CapabilityCard.tsx#L39) | Near-identical IO + rAF easing | Extract `useCountUp(target)` |
| M19 | Crossfade-tab logic reimplemented 4× + uncleared timers | GpPresenceSection:74, HomeImpactSection:25, LatWorkplaceSection:31, AwardsSection:25 | Same `active/displayed/fading` + 150 ms `swapTimer`; none clear on unmount (minor setState-after-unmount) | `useCrossfadeTabs()` — fixes duplication + leaks in one place |
| M20 | Accordion sink unsanitized by default | [Accordion.tsx:87](torque-pharma/src/components/ui/Accordion/Accordion.tsx#L87) | Safe only because all 7 current FAQ producers call `sanitize()`; one forgetful new caller = XSS. CLAUDE.md wrongly says "DOMPurify" | Sanitize inside `AccordionItem` (or accept a branded pre-sanitized type) |
| M21 | `libphonenumber-js` is a phantom dependency | imported in 7 forms, e.g. [ConnectForm.tsx:8](torque-pharma/src/components/sections/shared/ConnectSection/ConnectForm.tsx#L8) | Not in `package.json`; resolves only as a transitive of `react-phone-number-input` — breaks if that bumps/moves it | Add `libphonenumber-js` to `dependencies` explicitly |

---

## 6. Low Findings

| # | Finding | File | Fix |
|---|---|---|---|
| L1 | `@types/sanitize-html` in `dependencies` | [package.json:13](torque-pharma/package.json#L13) | Move to `devDependencies` |
| L2 | 2 dead font files (Black/Bold woff2, ~67 KB) not declared | `src/fonts/bw-darius/` | Delete |
| L3 | Hardcoded Tailwind arbitrary values vs tokens | BlogPostBody:34,59; GpPresenceSection:119; FounderSection:52 | Use design tokens |
| L4 | `TypewriterWord` timer never pauses | [TypewriterWord.tsx](torque-pharma/src/components/ui/TypewriterWord/TypewriterWord.tsx) | Add visibility pause |
| L5 | Heavy award-icon SVGs (258 KB / 186 KB / 174 KB) | `NewsAwardsSection` assets | SVGO |
| L6 | `globals.css` raw hex/rgba instead of tokens; `.cta-gradient` raw `color-mix` | [globals.css](torque-pharma/src/app/globals.css) | Reference CSS tokens |
| L7 | Timing-unsafe secret comparison (`!==`) | [revalidate/route.ts:9](torque-pharma/src/app/api/revalidate/route.ts#L9) | `crypto.timingSafeEqual` |
| L8 | `apiFetch` returns `res.json() as Promise<T>` — unvalidated cast | [fetcher.ts:41](torque-pharma/src/lib/api/fetcher.ts#L41) | Dev-only shape assert |
| L9 | Browser User-Agent spoofed on GETs but not on form POSTs | [fetcher.ts:28](torque-pharma/src/lib/api/fetcher.ts#L28) | Consolidate into one shared client |
| L10 | `getExportCategories` is dead code (0 call sites) | [global-presence.ts:86](torque-pharma/src/lib/api/global-presence.ts#L86) | Delete (superseded this session) |
| L11 | Homepage `href` hardcodes `/category/domestic/${slug}` — export categories link to wrong parent | [home.ts:241](torque-pharma/src/lib/api/home.ts#L241) | Derive parent from data |
| L12 | `FormSubmitButton` dead code (not exported, 0 refs) | [FormSubmitButton.tsx](torque-pharma/src/components/ui/Form/FormSubmitButton.tsx) | Delete (SplitButton is the convention) |
| L13 | `CountryForm` submit is a no-op stub on a live SSG page | [CountryForm.tsx:48](torque-pharma/src/components/sections/country/CountryFormSection/CountryForm.tsx#L48) | *Known/intentional* (no POST backend yet) — wire to an action when backend lands, or gate visibility |
| L14 | `any` casts in shared form rows | [ConnectForm.tsx:106,171](torque-pharma/src/components/sections/shared/ConnectSection/ConnectForm.tsx#L106) | Make rows generic over `TFieldValues` |
| L15 | Redundant `as Control<FormValues>` casts (5×) + `API_URL!` assertions (3×) | Career/WhiteLabel/Export/Manufacturing/GpGlobal forms; blogs/awards/events api | Delete casts; import a validated `API_BASE` |
| L16 | Inconsistent `enquiry_type` casing + suspicious `/form/about` endpoint for contact | [contact.ts:18](torque-pharma/src/lib/actions/contact.ts#L18) + 4 enquiry actions | Normalize to snake_case; confirm contact endpoint |
| L17 | Inconsistent `react cache()` wrapping | `getCountryPage`, `getEventDetail` not wrapped (siblings are) | Wrap for uniform dedup (network already deduped by fetch memoization) |
| L18 | `next/image` allow-list may miss the storage host | [next.config.ts:14](torque-pharma/next.config.ts#L14) vs `STORAGE_BASE` in blogs/events/awards | Add storage host to `remotePatterns`; anchor the `/api$` regex |

---

## 7. Prioritized Action Plan

### ⚡ Quick wins (< 1 hour each, highest ROI first)
1. **Drop `priority` from `dots.svg`** and stop preloading it (C1) — biggest single LCP win, ~5 min.
2. **Delete ~58 MB orphaned `public/` media** (H5) — ~10 min, huge deploy-size win.
3. **Add `.catch(() => null)` to `blogs/[slug]` + `events/[slug]`** (H3) — fixes 404→500, ~10 min.
4. **SVGO the 177 KB logo** + heavy award SVGs (H9, L5) — ~20 min.
5. **`dynamic(ssr:false)` for the 3 EnquirySupport forms + CareerForm + HistJourneySection** (H10, H12) — ~20 min, proven pattern.
6. **Add `metadataBase` + default `openGraph`** to the root layout (H2) — ~15 min.
7. **Sanitize `BuiltOnSection.subTitle` at source** (H13) — ~5 min.
8. **Fix the `ImageCycler` timeout leak** (H11) — ~10 min.
9. **Add `robots.ts` + `sitemap.ts`** reusing existing fetchers (H1) — ~40 min.
10. **Housekeeping:** move `@types/sanitize-html` to dev, add `libphonenumber-js` to deps, delete `getExportCategories`/`FormSubmitButton`/dead fonts, add `global-error.tsx`, update the 3 stale CLAUDE.md facts + 8 cache tags (H7, M5, M21, L1/L10/L12).

### 🔨 Medium improvements (1–2 days)
- **Kill the client-side sanitizer leak (C2):** move blog sanitization into `normalizeDescription`, make `SafeHtml` server-only, render pre-cleaned HTML in client components.
- **Form accessibility overhaul (H8):** labels + `aria-invalid`/`aria-describedby`/`role="alert"` in the `FormInput`/`FormField`/`FormSelect` primitives — one change fixes all ~10 forms.
- **Server-action validation (M3):** shared zod `safeParse` in every action; fix the résumé upload transport (H6).
- **Image optimization pass (M7, M1, H9):** remove `unoptimized` from raster CDN images, add `sizes`, SVGO/rasterize region maps.
- **Render `seo.schema` JSON-LD** (H4); add a CSP header (M4).
- **Visibility-pause `WorldMap`/`TypewriterWord`** (M8, L4); fix crossfade-tab timer leaks (M19).
- **`product/[slug]` `generateStaticParams`** (M11); `noindex` the 3 stubs (M12); `getNews` pagination (M6).

### 🏗️ Major refactors (multi-day, do when touching these areas)
- **Consolidate the form stack** — `FormSelect`/`FormSuccess`/`PhoneField`/shared zod + generic `<FeaturedSlider>` + `useCountUp` + `useCrossfadeTabs` (M17–M19). Removes the largest duplication cluster and fixes several leaks at once.
- **Collapse the 3 legal routes** into a `(legal)/[slug]` route group with shared boundaries (M10).
- **Adopt PPR / `<Suspense>` streaming** for below-fold sections across pages (M9).
- **Shared FAQ types + `toFaq()` helper** to enforce sanitization in one place (ties to M20).
- **Env/config hardening:** centralize a validated `API_BASE`/`STORAGE_BASE`, add `browserslist`, enable `noUncheckedIndexedAccess`, add a build-time fetch timeout with graceful degradation (M14–M16).

---

## 8. What's Already Done Well (do not "fix")

- **Server-first architecture** — only 37% of components are client islands; section wrappers are RSC composing small interactive leaves.
- **ISR + tags + on-demand revalidation** — uniform `revalidate:3600` + granular tags; secret-gated `POST /api/revalidate` using the current Next 16 `revalidateTag(tag, { expire:0 })` API (ahead of most codebases still on the deprecated 1-arg form).
- **Zero request waterfalls** — `Promise.all` on every multi-fetch page and in `generateStaticParams`; `generateMetadata` + body calls dedupe via fetch memoization + `React.cache()`.
- **Code-splitting** — 4/5 form sections `dynamic(ssr:false)`, keeping `react-hook-form`/`zod`/`react-phone-number-input` out of the initial bundle (the single biggest perf win in the repo).
- **Clean raw→typed API boundary** — every fetcher declares a `Raw*` type and maps to a component-ready shape; no snake_case leaks; server-side sanitization centralized for 7 fetchers.
- **Effect hygiene in the majority** — WorldMap (3 timers via refs), StatRotator (IO + `visibilitychange`), Marquee (ResizeObserver), all embla sliders, Header, CertLightbox, and the HistJourneySection GSAP teardown all clean up correctly.
- **Fonts** — local woff2, `display:swap` + `adjustFontFallback:"Arial"` (kills FOIT + most swap CLS).
- **Security posture** — scoped image `remotePatterns` (no wildcard), `poweredByHeader:false`, HSTS/nosniff/X-Frame-Options/Referrer-Policy/Permissions-Policy, immutable font caching, correct `rel="noopener noreferrer"` on all external links, no `NEXT_PUBLIC_*` secret leakage, fail-fast on missing `API_URL`.
- **Header a11y** — `aria-current`, labeled logo/hamburger, `aria-expanded`/`aria-controls`, focus return on close.
- **`next.config.ts`** — AVIF/WebP formats, sensible cache headers, skip link + semantic `<main>` in the root layout.

---

*Report generated from a 5-agent parallel deep read (app-router/SEO, data/API/caching, components/React-perf, assets/bundle/CWV, TS/security/a11y) plus first-hand review of load-bearing files. Cross-agent conflicts were reconciled against direct file reads — notably confirming that `error.tsx`/`loading.tsx`/`not-found.tsx` exist despite the stale CLAUDE.md note.*
