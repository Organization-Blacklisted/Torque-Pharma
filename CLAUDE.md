@AGENTS.md

# Torque Pharma — Frontend

Next.js 16 marketing site for Torque Pharma. Frontend only. A Laravel REST API is being built in parallel and will supply all page/section data.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in API_URL
npm run dev                  # localhost:3000
```

**Required env var:**
```
API_URL=https://your-laravel-api.com/api
```
The app throws at startup if `API_URL` is missing. See `.env.example`.

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 — no config file, tokens live in `src/styles/*.css` |
| Fonts | BW Darius (heading), Graphik (body) — local via `next/font` |
| HTML sanitisation | `sanitize-html` (server-side, in `src/lib/sanitize.ts`; used by `SafeHtml`) |

## Folder structure

```
src/
  app/               # Next.js App Router pages + layout
  components/
    layouts/         # Header, Footer, Container, Section
    sections/        # Full-width page sections (HeroVideo, HomeStatsMediaSection…)
    ui/              # Reusable atomic components (SplitButton, StatCard…)
  data/              # Mock data — matches API types exactly, used until API is live
  fonts/             # next/font local font definitions
  lib/
    api/             # API fetcher + typed page helpers (fetcher.ts, home.ts, pages.ts)
  styles/            # Design tokens: colors.css, typography.css, spacings.css, rich-text.css
  types/             # TypeScript interfaces that mirror Laravel API response shapes
```

## Component conventions

Every component lives in its own folder:
```
ComponentName/
  ComponentName.tsx        # implementation
  ComponentName.types.ts   # prop types
  index.ts                 # re-export (required — no exceptions)
```

All components must accept a `className` prop for Tailwind overrides. No exceptions.

No `any` casts. No inline `style={{}}` with hex values or magic numbers.

## Design tokens

All tokens are CSS custom properties defined in `src/styles/`. Use them via Tailwind utility classes — never hardcode values.

**Colors** (`colors.css`)
```
primary     #1B2978   navy
dark-blue   #061549   deep navy
mint        #5BC4A0   teal accent
secondary   #5C607C   slate
dark-grey   #2A3645   charcoal
pin         #E51919   map pin red
surface     #EEF1F8   image placeholder background
```

**Type scale** (`typography.css`) — fluid clamp values
```
text-h1   46–60px    text-h4  20px
text-h2   32–50px    text-h5  18px
text-h3   22–32px    text-h6  16px
text-body 16–20px    text-body-sm  16px (fixed)
text-button 14px
```

**Spacing** (`spacings.css`)
```
section           100–200px (clamp)
section-inner     50–100px (clamp)
section-inner-sm  48–96px (clamp)
subsection        20–40px (clamp)
gutter            24px
```

**Custom breakpoint** (`globals.css`)
```
nav:   75rem / 1200px   — header switches hamburger ↔ desktop nav here
```

## API-driven data pattern

**Rule: data is fetched at the page level and passed down as props. Section components are pure — they never fetch.**

```
src/types/hero.ts          ← TypeScript interface matching the API response
src/data/hero.mock.ts      ← static data matching that interface (used now)
src/app/page.tsx           ← imports mock, passes to <HeroVideo data={...} />
src/components/sections/HeroVideo/HeroVideo.tsx  ← receives typed props, renders
```

When the Laravel API is ready, the only change is in `page.tsx`:
```ts
// Before (mock)
import { heroMock } from "@/data/hero.mock"
<HeroVideo data={heroMock} />

// After (API)
const data = await fetch(`${process.env.API_URL}/homepage/hero`).then(r => r.json())
<HeroVideo data={data} />
```

Zero component changes needed.

**Page files must stay thin.** One import + one JSX line per section. All layout complexity lives inside the section component.

```tsx
// correct — page.tsx
<HeroVideo data={hero} />
<HomeStatsMediaSection data={statsMedia} />

// wrong — layout logic leaking into page.tsx
<div className="grid xl:grid-cols-4 ...">
  <StatRotator items={...} />
  ...
</div>
```

## API layer (`src/lib/api/`)

- `fetcher.ts` — generic `apiFetch<T>()` with ISR revalidation (default 1hr) and cache tags
- `home.ts` — `getHomePage()` fetches `/pages/home`, transforms raw snake_case API → typed `HomePageData`
- `pages.ts` — `getPage(slug)` for CMS pages (disclaimer, privacy-policy, terms-and-conditions)
- `CmsPage` type includes: `title`, `slug`, `description` (HTML), `seo`, `status`, `content: CmsBlock[]`
- Pages with `status !== "published"` return 404

When adding a new page backed by the API, create `src/lib/api/{page}.ts` following the `home.ts` pattern: raw type → transformed type → fetch + transform function.

## Cache invalidation

Every fetcher revalidates on a 1hr ISR window by default — content edited in Laravel can take up to an hour to appear on Vercel unless busted on demand.

`POST /api/revalidate` (`src/app/api/revalidate/route.ts`) does that bust. Laravel should call it after publishing/editing content:

```
POST /api/revalidate
Headers: x-revalidate-secret: <REVALIDATE_SECRET>
Body: { "tag": "blogs" }          // or { "tags": ["blogs", "homepage"] }
```

`REVALIDATE_SECRET` must be set in both `.env.local` and the Vercel project's environment variables — without it the route always returns 401.

**Current tags, one per fetcher:**
| Tag | Fetcher |
|---|---|
| `homepage` | `home.ts` |
| `awards` | `awards.ts` |
| `blogs` | `blogs.ts` |
| `blog-{slug}` (e.g. `blog-spf-in-skincare`) | `blog-post.ts` — `getBlogPost(slug)`. Editing a post must bust BOTH this tag and `blogs` |
| `code-of-conduct` | `code-of-conduct.ts` |
| `about-us` | `about.ts` |
| `manufacturing` | `manufacturing.ts` |
| `events` | `events.ts` |
| `board-of-directors` | `board.ts` |
| `contact-us` | `contact.ts` |
| `career` | `career.ts` |
| `global-presence` | `global-presence.ts` |
| `country-categories` | `country-categories.ts` — `getCountryCategories()` |
| `country-{slug}` (e.g. `country-uganda`) | `country.ts` — `getCountryPage(slug)` |
| `dealer` | `dealer.ts` |
| `white-label` | `white-label.ts` |
| `history` | `history.ts` |
| `life-at-torque` | `life-at-torque.ts` |
| `product-{slug}` (e.g. `product-xtraderm-cream-15gm`) | `product.ts` — `getProduct(slug)` |
| `category-{slug}` (e.g. `category-derma`) | `product-category.ts` — `getCategoryPage(slug)` |
| `category-children-{parentSlug}` (e.g. `category-children-domestic`) | `product-category.ts` — `getSiblingCategories(parentSlug)` |
| `event-{slug}` (e.g. `event-nainital-marathon`) | `events.ts` — `getEventDetail(slug)`. Also tagged `events`, so busting `event-{slug}` alone won't refresh the events list |
| `news` | `news.ts` — `getNews()` |
| `news-{slug}` (e.g. `news-torque-free-rx-closure-allows-for-single-handed-operation`) | `news.ts` — `getNewsDetail(slug)`. Also tagged `news`, so busting `news-{slug}` alone won't refresh the news list |
| `{slug}` (e.g. `privacy-policy`) | `pages.ts` — tag is the page slug itself |

When adding a new fetcher with a `tags: [...]` option, add its tag to this table so Laravel knows what to send.

## Key components

| Component | Location | Notes |
|---|---|---|
| `SplitButton` | `ui/SplitButton` | Primary CTA button — label + animated arrow. Variants: primary, secondary, outline, outline-dark, ghost |
| `SectionHeader` | `ui/SectionHeading` | Eyebrow + heading + description. Variants: default, split. Themes: light, dark |
| `CTA` | `ui/CTA` | CTA card. Variants: glass, gradient. Description always `font-light` — do not pass to SectionHeader |
| `FeatureCard` | `ui/FeatureCard` | Icon + title + description on dark backgrounds. Used in ContractManufacturingSection |
| `Slider` | `ui/Slider` | Horizontal slider with progress bar, showing X/Y counter, custom prev/next arrows |
| `HeroVideo` | `sections/HeroVideo` | Full-screen video hero with typewriter eyebrow. Data-driven |
| `ContentMediaSection` | `sections/ContentMediaSection` | Reusable section: layouts centered/split-left/split-right, media type image or video |
| `CtaSection` | `sections/shared/CtaSection` | Section wrapper for CTA card. Props: `eyebrow`, `title`, `description?`, `variant?` (gradient\|glass), `button?` ({label, href, variant?}), `children?` (custom button override). Used on 7 pages |
| `FaqSection` | `sections/shared/FaqSection` | Section wrapper for SectionHeader + Accordion. Props: `eyebrow`, `title`, `description?`, `items`, `containerSize?` (default reading). Used on 4 pages |
| `ContractManufacturingSection` | `sections/ContractManufacturingSection` | Dark-blue full-width section with FeatureCard grid. Wired to API |
| `HomeStatsMediaSection` | `sections/HomeStatsMediaSection` | StatRotator + VideoBackground + MediaContentCard grid |
| `StatsMediaSection` | `sections/StatsMediaSection` | Generic wrapper: split SectionHeader + children + optional footer |
| `TypewriterWord` | `ui/TypewriterWord` | Cycles through a `words[]` array with typewriter animation |
| `VideoBackground` | `ui/VideoBackground` | `<video>` primitive — accepts `sources: VideoSource[]` for WebM/MP4 fallback. `showAudioToggle` prop adds mute/unmute button |
| `WorldMap` | `ui/WorldMap` | Auto-rotating country map. Desktop: floating tooltip. Mobile: card below map. Positions hardcoded in `POSITIONS` object — add new countries there if API adds them |
| `StatRotator` | `ui/StatRotator` | Pair of StatCards that auto-advance. Pauses when off-screen or tab is hidden |
| `StatCard` | `ui/StatCard` | `label` is optional. No label = number-first layout (About Us style). With label = manufacturing style |
| `SafeHtml` | `ui/SafeHtml` | `sanitize-html` sanitiser (server-side) + auto-injects `loading="lazy"` on images. Note: `Accordion` does NOT sanitise — callers must pass pre-sanitized HTML |
| `BlogCard` | `ui/BlogCard` | Grid card — image, category pill, title, hover "Read More". Links to `/blogs/[slug]` |
| `FeaturedBlogSlider` | `ui/FeaturedBlogSlider` | Single full-bleed slide (content + image) cycling through `is_featured` posts via dot indicators |
| `Pagination` | `ui/Pagination` | Numbered pagination with ellipsis collapsing. Controlled: `currentPage`/`totalPages`/`onPageChange` |
| `Tabs` (`TabList`/`Tab`) | `ui/Tabs` | Underline tab bar — parent owns active-index state, `Tab` takes `isActive`/`onClick` |
| `BlogsSection` | `sections/blog/BlogsSection` | `/blogs` page body — derives category tabs + client-side pagination from the full post list |
| `Container` | `layouts/Container` | Max-width wrapper. Usable content widths (after px-8 gutter): wide (1700px), xl (1500px), large (1430px), standard (1360px), content (1264px), narrow (1152px), reading (1065px). max-w values are 64px larger to compensate for padding. |
| `Section` | `layouts/Section` | Semantic section with spacing tokens. `spacing="default"` \| `"none"`. Use `first` prop on the first section of every page |

## Pages

| Route | Status | Data source |
|---|---|---|
| `/` | Active — 7 sections built | API (6 sections) + mock (statsMedia) |
| `/about-us` | Active — fully built | `getAboutUsPage()` — all sections wired: contentMedia, overview, stats, mission/vision, values, built-on, connect, cta |
| `/manufacturing-facility` | Active — fully built | `getManufacturingPage()` — all sections wired: hero, production, process, stats, certifications, quality-assessment, production-scale, cta, faq |
| `/board-of-directors` | Active — 2 sections API-driven | `getBoardPage()` — executive_board + cta wired; founder, director, executive_directorate sections not yet built |
| `/category/[parent]/[slug]` | Active — fully built | `getCategoryPage(slug)` + `getSiblingCategories(parent)` — hero, disclaimer, product grid (client-filtered), CTA, FAQ; SSG via `generateStaticParams` |
| `/company` `/global-presence` `/products` `/capabilities` `/life-at-torque` | Stub — h1 only | None |
| `/blogs` | Active — featured slider, category tabs, paginated grid | `getBlogs()` |
| `/blogs/[slug]` | Active — fully built | `getBlogPost(slug)` — hero, body, related posts; SSG via `generateStaticParams` |
| `/news-and-media` | Active — hero (featured + editor's picks), category-tabbed paginated archive | `getNews()` |
| `/news-and-media/[slug]` | Active — fully built | `getNewsDetail(slug)` — hero, TOC + content-block body, related news; SSG via `generateStaticParams` |
| `/resources` | **Does not exist** — no nav link points here directly (Resources dropdown links straight to children) | None |
| `/contact-us` | Active — ContactInfoSection wired | `getContactPage()` — info section live; enquiry form section not yet built |
| `/disclaimer` `/privacy-policy` `/terms-and-conditions` | Active — API-driven | `getPage(slug)` |

## Known issues to fix before launch

- `src/app/globals.css` `.cta-gradient` — uses raw `color-mix()` percentages, should reference CSS tokens
- `src/lib/api/blogs.ts` — `/blogs` endpoint path is a guess based on REST convention; confirm against the real Laravel route. "Medically reviewed by" name in `FeaturedBlogSlider` is a hardcoded placeholder — API has no reviewer field yet
- `src/app/error.tsx`, `loading.tsx`, `not-found.tsx` — all exist and wrap the whole tree (legal routes also have their own). Remaining gaps: no `global-error.tsx` (root-layout errors fall back to Next's unstyled default), and `blogs/[slug]`/`events/[slug]` fetch without `.catch`, so a missing slug throws 404→500 instead of calling `notFound()`
- `src/components/sections/HomeStatsMediaSection` — permanently on mock data; no `stats_media_section` defined in API yet. Track with backend
- `src/components/ui/WorldMap/WorldMap.tsx` — `POSITIONS` object is hardcoded for 26 countries. If API returns a new country with no entry, the pin silently does not render. Add new countries to `POSITIONS` manually until the API delivers coordinates

## Rich text

CMS HTML is rendered via `<SafeHtml>` with the `.rich-text` class. Styles are in `src/styles/rich-text.css`. Use `.rich-text--policy` variant on legal pages (reduces h2 to h3 size).

## Accessibility rules

- Every page must have `export const metadata` with a real `title` and `description` — no placeholders
- Icon-only buttons and links must have `aria-label`
- Nav links use `aria-current="page"` — already wired via `usePathname` in Header
- Skip-to-content link is the first focusable element in the layout
- Mobile drawer has a focus trap (Escape closes, Tab cycles within drawer)

## Do not

- Hardcode colour hex values — use Tailwind token classes (`text-primary`, `bg-mint`)
- Use `style={{}}` with raw hex or rgba — add a CSS token and reference it
- Add `pt-32` or other magic spacing to pages — use `Section` + `Container`
- Fetch data inside section or UI components — page level only
- Use `dark-mint` — removed (identical to `mint`)
- Cast with `as any` — fix the type
- Skip `index.ts` on any component folder
- Skip `className` prop on any component
- Put grid/layout logic in `page.tsx` — it belongs in the section component
- Commit `.env.local`
- Use placeholder metadata like `description: "Contact Us Description"` — write real copy
