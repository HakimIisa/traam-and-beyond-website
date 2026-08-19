# Summary — Fourth Build Session

**Date:** 2026-04-17
**Scope:** Hero scroll animation overhaul (mobile bowl-to-logo transformation, desktop diagonal + scale), Our Story section rebuild, Navbar/Footer refinements, LOGO.png integration, Research section, About page fixes

---

## Inherited from Previous Sessions

Everything from `docs/summary-second-build.md` (covering builds 2 and 3) remains in place. This document adds all new changes on top.

---

## 1. Hero Section — Complete Animation Overhaul (`components/home/HeroSection.tsx`)

The hero section was extensively reworked with separate mobile and desktop scroll animations using Framer Motion's `useScroll` + `useTransform`.

### Sticky Scroll Container
- Outer container: `h-[calc(100vh+500px)]` provides scroll runway
- Inner section: `sticky top-0 h-screen overflow-hidden` locks the hero in viewport while scroll progresses
- `scrollYProgress` runs `0 → 1` over the difference between container and viewport height (500px of scroll)
- All transforms use `[0, 0.7]` range — animation completes at 70% of scroll progress

### Desktop Animation (unchanged from mid-session)
```ts
bowlY:     ["45vh", "0vh"]     // vertical rise
bowlX:     ["26vw", "0vw"]     // horizontal drift from center to left
bowlScale: [0.7, 1]            // grows from 70% to 100%
```
- Bowl starts centered (`left-0 + translateX(26vw)`) and drifts diagonally up-left to its natural bottom-left position
- `opacity-40` (fixed, not animated)
- `object-contain object-left-bottom`, `w-[48%]`

Desktop text:
```ts
textScaleDesktop: [0.7, 1]     // text scales from 70% to 100%
```
- Logo (`LOGO.png`) inside the text wrapper with `-mb-[4.25rem]` to overlap h1
- Logo, h1, tagline, subtext, CTA all scale together

### Mobile Animation — Bowl-to-Logo Transformation (new)

**Concept:** The copper bowl background starts as a solid visible image at the bottom of the screen. As the user scrolls, the bowl rises and fades while the logo (a transparent-background silhouette modelled on the same bowl) grows large and drifts upward to overlay the bowl — creating the illusion that the solid bowl "transforms" into its logo outline. The text simultaneously slides downward to make room.

```ts
// Mobile bowl: solid at bottom, rises to near top, fades, shrinks 5%
bowlYMobile:       ["20vh", "-20vh"]
bowlOpacityMobile: [1, 0.4]
bowlScaleMobile:   [1, 0.95]

// Mobile logo: starts near top (small), grows 4.5× and drifts to overlay bowl
logoScaleMobile:   [1, 4.5]
logoYMobile:       ["-38vh", "-17vh"]

// Mobile text: starts above center, slides down
textScaleMobile:   [0.85, 1]
textYMobile:       ["-20vh", "25vh"]
```

**Page load state:**
- Bowl: fully visible, solid (opacity 1), in lower viewport (`y: 20vh`)
- Logo: small, near top of page (`y: -38vh` from center ≈ 12vh from top)
- Text: in upper-center area (`y: -20vh` from center ≈ 30vh from top)

**End state (70% scroll):**
- Bowl: faint (opacity 0.4), near top (`y: -20vh`), slightly smaller (scale 0.95)
- Logo: large (4.5× scale), positioned to overlay bowl (`y: -17vh`)
- Text: in lower area (`y: 25vh` from center), scaled to 100%

**Mobile-specific layout changes:**
- Bowl image uses `object-contain object-center` (not `object-[center_20%]`) so it centers in viewport and aligns with the logo
- Logo is a **separate absolutely-positioned `motion.div`** (not inside the text wrapper): `absolute z-20 inset-0 flex items-center justify-center pointer-events-none`
- Text wrapper has **no logo** on mobile — the logo moves independently

**Image facts relevant to the animation:**
- `hero-vessel.png`: 1700×1886px (~0.9:1 portrait)
- `LOGO.png`: 2480×2480px (1:1 square, transparent background, bowl silhouette)
- On a 390px mobile viewport, the bowl renders at ~390×433px via `object-contain`
- Logo at `h-48` = 192px; at 4.5× scale = 864px — large enough to overlay the bowl with overshoot

---

## 2. LOGO.png Integration

### Navbar (`components/layout/Navbar.tsx`)
- `LOGO.png` added next to the site name in the navbar
- `<Image src="/LOGO.png" width={240} height={80} className="h-16 w-auto" />`
- Site title: `text-2xl font-semibold text-cream tracking-wide -ml-2`
- Both wrapped in a flex container with no gap (tight spacing)

### Hero Section (Desktop)
- Logo sits above the h1 inside the text wrapper
- `-mb-[4.25rem]` pulls the h1 tightly beneath the logo
- Scales with all other text via the parent `motion.div`

### Hero Section (Mobile)
- Logo is extracted from the text wrapper into its own absolutely-positioned `motion.div`
- Has independent scale and y transforms (see section 1 above)

---

## 3. Our Story Section — Complete Rebuild (`components/home/OurStorySection.tsx`)

The previous Our Story section (scroll-animated text reveal with sticky pattern) was scrapped and rebuilt from scratch as a static, self-contained section.

### Design
- **Background:** `bg-[#FAF6F0]` (cream/off-white)
- **Text color:** `text-[#1a130a]` (very dark brown — same as Our Collections background)
- **Cushioning:** `my-[10px]` top and bottom margin
- **Title:** `font-display text-6xl`, centered, same size as "Our Collections"
- **Content:** Fetches the 5 "Our Story" paragraphs from the About page Firebase content

### Mobile Layout
- 1:1 square box filling full screen width (`aspect-square w-full flex`)
- Left half: image (`/SW1.png`, `w-1/2`, `object-cover`)
- Right half: scrollable text (`w-1/2`, `overflow-y-auto`, hidden scrollbar)
- Text: `text-xs leading-relaxed text-left space-y-3`

### Desktop Layout
- Side-by-side flex row: image 1/3 left, text 2/3 right (`hidden lg:flex`)
- Image: `w-1/3 shrink-0 min-h-[500px]`, `object-cover`
- Text: `w-2/3 text-lg text-justify space-y-5 pl-10`

### Home Page Integration
- Sits between HeroSection and CategoryHighlights
- `getAboutContent()` fetched in `app/(public)/page.tsx` and passed as `content={aboutContent.introduction}`

---

## 4. Navbar Changes (`components/layout/Navbar.tsx`)

### Navigation Renames
- "Introduction" sub-link → **"Our Story"** (still links to `/about#introduction`)
- "Crafts" heading → **"Our Collections"**

### Research Section (new)
Added a new navigation heading "Research" with 3 horizontal sub-links:
```
Research
├── Adaptive Reuse       → /research/adaptive-reuse
├── Reinterpretation     → /research/reinterpretation
└── Graphic Design       → /research/graphic-design
```
Sub-links displayed horizontally using `flex-row flex-wrap gap-x-8 gap-y-1.5`

### CRAFTS Array Update
```tsx
const CRAFTS = [
  { label: "Copperware",       slug: "copperware" },
  { label: "Papier-mâché",    slug: "papier-mch" },
  { label: "Silverware",      slug: "silverware" },
  { label: "Enamelware",      slug: "enamelware" },
  { label: "Terracotta",      slug: "terracotta" },
  { label: "Green Serpentine", slug: "green-serpentine" },
  { label: "Coins",           slug: "coins" },
  { label: "Shawls",          slug: "shawls" },
  { label: "Jewellery",       slug: "jewellery" },
  { label: "Carpets",         slug: "carpets" },
  { label: "Willow Wicker",   slug: "willow-wicker" },
  { label: "Woodwork",        slug: "wood-work" },
  { label: "Brass Ware",      slug: "brass-ware" },
];
```
Note: "Sculptures" removed. Some labels changed from previous build (e.g., "Copper Ware" → "Copperware").

---

## 5. Research Pages (new)

Three placeholder pages created:

| File | Route | Title |
|------|-------|-------|
| `app/(public)/research/adaptive-reuse/page.tsx` | `/research/adaptive-reuse` | Adaptive Reuse |
| `app/(public)/research/reinterpretation/page.tsx` | `/research/reinterpretation` | Reinterpretation |
| `app/(public)/research/graphic-design/page.tsx` | `/research/graphic-design` | Graphic Design |

Each page uses `ScrollReveal`, `font-display text-6xl` heading, and "Coming soon." placeholder text.

---

## 6. About Page Fixes (`app/(public)/about/page.tsx`)

### Background Image Fix
- Changed from `position: fixed` to `position: absolute` with `top-0 h-screen`
- This prevents the bowl image from painting on top of normal-flow elements (like the footer) due to CSS paint order issues with `position: fixed; z-index: 0`
- Desktop only (`hidden lg:block`)

### Gradient Fix
- Changed gradient from `fixed inset-0` to `absolute inset-0` (desktop only)
- Covers full page height for consistent dark-to-right background
- Both gradient and image are `pointer-events-none z-0`

### Section Title Rename
- "Introduction" → **"Our Story"** (section heading on the About page)

### Craft Heritage Section
- Removed `bg-walnut` background to keep it transparent (shows gradient beneath)

---

## 7. Footer Fix (`components/layout/Footer.tsx`)

- Removed `mt-20` from the `<footer>` element (margin was outside the background, creating a visible colored strip)
- Added `pt-20` inside the footer's inner `<div>` so `bg-walnut-light` covers the spacing gap

---

## 8. New Assets

| File | Dimensions | Purpose |
|------|------------|---------|
| `public/LOGO.png` | 2480×2480px (square, transparent bg) | Bowl silhouette logo — used in Navbar, Hero (desktop inline, mobile animated), modelled on the hero bowl |
| `public/SW1.png` | 1417×2480px (tall portrait) | Our Story section image |

---

## 9. Key Files Modified (Fourth Build)

| File | Change type |
|------|-------------|
| `components/home/HeroSection.tsx` | Full rewrite — split mobile/desktop, bowl-to-logo transformation, diagonal scroll, logo integration |
| `components/home/OurStorySection.tsx` | Full rewrite — static section with inverted color scheme, square mobile layout |
| `components/layout/Navbar.tsx` | Logo added, title text resized, Research section, renames |
| `components/layout/Footer.tsx` | mt-20 → pt-20 fix |
| `app/(public)/page.tsx` | OurStorySection wired in with aboutContent |
| `app/(public)/about/page.tsx` | Background image fix (absolute not fixed), gradient fix, title rename |
| `app/(public)/research/adaptive-reuse/page.tsx` | **New file** — placeholder |
| `app/(public)/research/reinterpretation/page.tsx` | **New file** — placeholder |
| `app/(public)/research/graphic-design/page.tsx` | **New file** — placeholder |
| `public/LOGO.png` | **New file** — bowl silhouette logo |
| `public/SW1.png` | **New file** — Our Story image |

---

## 10. Animation Tuning Log

The mobile hero animation went through extensive iteration:

### Bowl position
| Parameter | Values tried | Final |
|-----------|-------------|-------|
| `bowlYMobile` start | `70vh`, `20vh` | **`20vh`** |
| `bowlYMobile` end | `0vh`, `-20vh` | **`-20vh`** |
| `bowlOpacityMobile` | `[1, 0.4]` | **`[1, 0.4]`** |
| `bowlScaleMobile` | not applied, `[1, 0.95]` | **`[1, 0.95]`** |
| Mobile `object-position` | `object-[center_20%]`, `object-center` | **`object-center`** |

### Logo position & scale
| Parameter | Values tried | Final |
|-----------|-------------|-------|
| `logoScaleMobile` end | `2.2`, `2.5`, `4`, `5`, `6`, `4.5` | **`4.5`** |
| `logoYMobile` start | `30vh`, `0vh`, `-5vh`, `-15vh`, `-21vh`, `-25vh`, `-38vh` | **`-38vh`** |
| `logoYMobile` end | `0vh`, `-20vh`, `-22vh`, `-15vh`, `-17vh` | **`-17vh`** |

### Text position
| Parameter | Values tried | Final |
|-----------|-------------|-------|
| `textScaleMobile` | `[0.85, 1]` | **`[0.85, 1]`** |
| `textYMobile` | `["-20vh", "25vh"]` | **`["-20vh", "25vh"]`** |

### Desktop text scale (split)
| Parameter | Values tried | Final |
|-----------|-------------|-------|
| `textScaleDesktop` | `[0.7, 1]` | **`[0.7, 1]`** |

### Logo-to-text spacing (hero)
| Parameter | Values tried | Final |
|-----------|-------------|-------|
| Logo wrapper `mb` (desktop) | `mb-6`, `mb-1`, `-mb-6`, `-mb-10`, `-mb-20`, `-mb-[4.25rem]` | **`-mb-[4.25rem]`** |
| Logo wrapper `mb` (mobile) | was `-mb-[2.5rem]` before logo was extracted | N/A (separate div now) |

### Navbar logo spacing
| Parameter | Values tried | Final |
|-----------|-------------|-------|
| Logo-text gap | `gap-2`, no gap | **no gap** |
| Text `-ml` | `-ml-1`, `-ml-4`, `-ml-2` | **`-ml-2`** |
| Text size | `text-xl`, `text-2xl` | **`text-2xl`** |

---

## 11. Architecture Notes

### Scroll Animation Pattern
The hero uses a **sticky scroll** pattern:
- Outer `div` has height > viewport (creates scroll runway)
- Inner `section` is `sticky top-0 h-screen` (stays fixed during scroll)
- `useScroll({ target: containerRef, offset: ["start start", "end end"] })` tracks scroll progress
- `scrollYProgress` goes `0 → 1` over `containerHeight - viewportHeight`
- All transforms use `[0, 0.7]` range so animation completes before the section unsticks

### Mobile vs Desktop Split
Mobile and desktop bowl/text are completely separate DOM elements:
- Mobile: `lg:hidden` classes
- Desktop: `hidden lg:block` classes
- Each has its own `motion.div` with independent transforms
- No shared transform values between mobile and desktop (split was necessary for the different animation behaviors)

### CSS Paint Order Issue (About Page)
Using `position: fixed; z-index: 0` for background images causes them to paint over normal-flow elements in certain browsers. Fixed by switching to `position: absolute` which participates in normal document flow and respects z-index stacking correctly.

### Footer Background Gap
`margin-top` on a footer element creates space OUTSIDE the footer's background color, revealing the body background beneath. Moving the spacing to `padding-top` inside the footer keeps the background color continuous.

---

## 12. Item Detail Page Fixes (`app/(public)/category/[slug]/[itemId]/page.tsx`)

### Title Color Fix
- `text-walnut` (`#20180C`) on the `h1` was invisible against the dark body background (`bg-walnut: #20180C`).
- Changed to `text-[#FAF6F0]` (off-white cream) — now legible on the dark background.

### Description Color Fix
- `text-stone` on the description `<p>` replaced with `text-[#FAF6F0]` to match the title and improve readability.

### Breadcrumb Item Title Fix
- The item title span in the breadcrumb also used `text-walnut` (invisible). Changed to `text-cream`.

### Dimensions Label Fix
- "Dimensions" label used `text-walnut` (invisible). Changed to `text-cream`.

### Price / Not for Sale — Moved to After Description
Previously the price appeared immediately after the title (before the description). It now appears **after** the description and dimensions, so the reading order is:

```
Badge (category) → Title → Description → Price / "Not for Sale" → Dimensions → Enquiry form
```

Price text color remains `text-terracotta` (unchanged).

### Summary of Color Roles (Item Detail Page)
| Element | Class | Hex |
|---------|-------|-----|
| Title (h1) | `text-[#FAF6F0]` | `#FAF6F0` |
| Description | `text-[#FAF6F0]` | `#FAF6F0` |
| Price / Not for Sale | `text-terracotta` | `#B57031` |
| Dimensions label | `text-cream` | `#F8E8D2` |
| Dimensions value | `text-stone` | `#A68F67` |
| Breadcrumb item title | `text-cream` | `#F8E8D2` |

---

## 13. Enquiry Form — Color & Visibility Fixes (Site-wide)

All `text-walnut` (`#20180C`) elements inside dark-background contexts were invisible. Fixed across three files.

### `components/forms/EnquiryForm.tsx`
| Element | Before | After |
|---------|--------|-------|
| Form labels (Name, Email, Message) | `text-walnut` | `text-cream` |
| Input / Textarea background | `bg-white` | `bg-walnut-light` |
| Input / Textarea typed text | `text-walnut` | `text-cream` |
| Placeholder text | (browser default) | `placeholder:text-stone` |
| "Enquiring about:" label | `text-stone` | `text-stone-light` |
| Item title in "Enquiring about:" | `text-walnut` | `text-cream` |
| Success "Thank you!" heading | `text-walnut` | `text-cream` |
| Success subtext | `text-stone` | `text-stone-light` |

### `components/forms/EnquiryDialog.tsx`
- Dialog background: `bg-cream` → `bg-cream-dark` (matches dark site aesthetic)
- Dialog title: `text-walnut` → `text-cream`

### `app/(public)/contact/page.tsx`
- Page h1 "Get in Touch": `text-walnut` → `text-cream`
- Subheading paragraph: `text-stone` → `text-stone-light`
- "Email" / "Based in" info labels: `text-walnut` → `text-cream`
- "Enquire" inline span: `text-walnut` → `text-cream`

### `app/(public)/category/[slug]/[itemId]/page.tsx`
- "Enquire About This Item" h2: `text-walnut` → `text-cream`

---

## 14. Our Story Section — Mobile Layout Revisions (`components/home/OurStorySection.tsx`)

Several iterative changes were made to the mobile layout of the Our Story section:

### Image swap: SW1.png → SW3.png
- `SW3.png` dimensions: **621×2480px** (very narrow portrait, ~1:4 ratio)
- At `w-1/3` on a 390px viewport: renders ~130px wide × ~519px tall
- Only the top portion (~75%) visible on load; image scrolls with text

### Width split: 1/2 + 1/2 → 1/3 + 2/3
- Image: `w-1/2` → `w-1/3` (narrower image, more text room)
- Text: `w-1/2` → `w-2/3`

### Unified scroll: text-only → whole frame scrolls
- Previously: only the text div had `overflow-y-auto`; the image was fixed
- Now: the outer `aspect-square` frame has `overflow-y-auto`; image and text scroll together as one unit
- Effect: scrolling on either the left (image) or right (text) side moves both — works for left- and right-handed users equally

### Image flush to left wall
- Mobile block moved outside the `max-w-6xl px-4` padded container to sit full-bleed
- Image hugs the left edge of the screen with no padding
- Text side has its own `pl-4 pr-4` padding

### Text alignment & size
- Mobile text: `text-left` → `text-justify`
- Both mobile and desktop: `text-xs` / `text-lg` → `text-base` (16px, consistent with item description)

### Structure after refactor
```
<section>
  <div class="padded">          ← title only (pt-16 pb-10)
    <h2>Our Story</h2>
  </div>
  <div class="full-bleed lg:hidden aspect-square overflow-y-auto flex">
    <div class="w-1/3">SW3.png (natural height, h-auto)</div>
    <div class="w-2/3 pl-4 pr-4 py-4">paragraphs</div>
  </div>
  <div class="padded hidden lg:block">   ← desktop layout (pb-16)
    <div class="flex">
      <div class="w-1/3">SW3.png (fill)</div>
      <div class="w-2/3 pl-10">paragraphs</div>
    </div>
  </div>
</section>
```

### New asset
| File | Dimensions | Purpose |
|------|------------|---------|
| `public/SW3.png` | 621×2480px (narrow portrait) | Our Story mobile image — replaces SW1.png on mobile |

---

## 15. Font Size Consistency — `text-base` (16px) Applied Site-wide

To match the item description font size (default `text-base`), the following were updated:

| Location | Element | Before | After |
|----------|---------|--------|-------|
| `OurStorySection.tsx` mobile | Story text | `text-xs` | `text-base` |
| `OurStorySection.tsx` desktop | Story text | `text-lg` | `text-base` |
| `CategoryHighlights.tsx` mobile | Category description | `text-sm` | `text-base` |
| `CategoryHighlights.tsx` desktop | Category description | (already `text-base`) | unchanged |
| `CategoryHighlights.tsx` | "Each category tells…" subtitle | (already `text-base`) | unchanged |

---

## 16. Hero Section — Mobile Bowl Start Position Tuning

`bowlYMobile` start value adjusted (final after iteration):

| Value tried | Result |
|-------------|--------|
| `"20vh"` | original |
| `"10vh"` | slightly high |
| `"15vh"` | **final** |

Final: `bowlYMobile = ["15vh", "-20vh"]`

---

# Fifth Build Session — Addendum

**Date:** 2026-04-21
**Scope:** Our Story section architectural overhaul (fixed background plane, desktop parity), footer z-index fix, navbar navigation wiring, `/research` landing page

---

## 17. Our Story Section — Fixed Background Plane (`components/home/OurStorySection.tsx`)

The section was fully rebuilt again. The previous static layout was replaced with a CSS `position: fixed` background plane that sits behind all scrolling content.

### Architecture
- **Mobile + Desktop:** Single `fixed inset-0 z-[1] bg-[#FAF6F0] flex flex-col items-center justify-center` div
- Content centered using `max-w-lg mx-auto w-full` wrapper (keeps natural proportions on wide screens)
- Images use `width={2480} height={...} className="w-full h-auto"` — natural proportions, centered
- The old `hidden lg:block` desktop section (SW1.png + Firebase paragraphs) was removed entirely

### Content layout
```
fixed panel:
  OurStory1.png   (w-full h-auto, natural proportions)
  text block      (px-6 py-5, center-aligned)
    P1: dark brown (#1a130a)
    P2: saffron (#D4A017, font-semibold)
  OurStory2.png   (w-full h-auto, natural proportions)
```

### Z-index stack (mobile + desktop)
| Layer | z-index | Element |
|-------|---------|---------|
| 1 | `z-[1]` | Our Story fixed background |
| 2 | `z-[2]` | Hero outer div, CategoryHighlights, enquiry section, footer wrapper |
| 50 | `z-50` | Navbar |

### New assets used
| File | Dimensions | Purpose |
|------|------------|---------|
| `public/OurStory1.png` | 2480×1752px | Top image in Our Story fixed panel |
| `public/OurStory2.png` | 2480×1745px | Bottom image in Our Story fixed panel |

---

## 18. Home Page Changes (`app/(public)/page.tsx`)

| Change | Before | After |
|--------|--------|-------|
| "Our Story" title strip | `relative z-[2] bg-walnut lg:hidden` with h2 | **Removed entirely** |
| Scroll runway | `h-screen lg:hidden` | `h-screen` (all screens) |
| "Read Our Story" button strip | `relative z-[2] bg-walnut lg:hidden`, full-width button | `relative z-[2] bg-walnut` (all screens), **auto-width** centered button |

The "Read Our Story" button now uses `inline-block px-8 py-3` (auto-width, centered) instead of `block w-full` — consistent with the hero CTA button style.

---

## 19. Layout — Footer Z-index Fix (`app/(public)/layout.tsx`)

Footer was hidden behind the fixed Our Story panel (`z-[1]`) because it had no explicit z-index.

**Fix:** Footer wrapped in `<div className="relative z-[2]">` in the layout file so it stacks above the fixed background on all pages.

```tsx
// Before
<Footer />

// After
<div className="relative z-[2]"><Footer /></div>
```

---

## 20. Navbar — Navigation Wiring (`components/layout/Navbar.tsx`)

### "Our Collections" — now a link
Changed from `<span>` (non-interactive) to `<Link href="/#collections">`:
- Navigates to the home page's `#collections` section (same as hero "Explore Collections" CTA)
- Active state coloring **removed** — always `text-cream`, turns terracotta on hover

### "Research" — now a link
Changed from `<span>` (non-interactive) to `<Link href="/research">`:
- Navigates to the new `/research` landing page
- Highlights `text-terracotta` when `pathname.startsWith("/research")`

### Active state cleanup
Both "Home" and "Our Collections" had `pathname === "/"` active state which made them permanently terracotta on the home page. Both now use plain `text-cream hover:text-terracotta` — consistent with menu items that aren't currently active.

---

## 21. Research Landing Page — New (`app/(public)/research/page.tsx`)

New placeholder page at `/research` that lists the three research sub-areas as navigable cards.

```
/research
├── Adaptive Reuse       → /research/adaptive-reuse
├── Reinterpretation     → /research/reinterpretation
└── Graphic Design       → /research/graphic-design
```

- Dark background (`bg-[#1a130a]`) matching the Collections section
- Each sub-area: border-top divider, `font-display text-4xl` title, description paragraph, "Explore →" link
- Uses `ScrollReveal` with staggered delays
- Highlights active sub-link in navbar when on `/research/*` routes

---

## 22. Key Files Modified (Fifth Build)

| File | Change type |
|------|-------------|
| `components/home/OurStorySection.tsx` | Full rewrite — fixed background plane, natural proportions, desktop parity |
| `app/(public)/page.tsx` | Title strip removed, scroll runway extended to all screens, button auto-width |
| `app/(public)/layout.tsx` | Footer wrapped in `relative z-[2]` |
| `components/layout/Navbar.tsx` | "Our Collections" and "Research" wired as Links, active state cleanup |
| `app/(public)/research/page.tsx` | **New file** — Research landing page placeholder |

---

# Sixth Build Session — Addendum

**Date:** 2026-04-25
**Scope:** About page OurStoryTimeline polish, Vercel image loading fix, bidirectional scroll image swap, home page button background color

---

## 23. OurStoryTimeline — "Our Story" Title Fix (`components/about/OurStoryTimeline.tsx`)

The "Our Story" title was previously placed above `<OurStoryTimeline />` in `about/page.tsx`. This pushed the sticky background container ~150px below the viewport top on page load, causing the first image to appear off-centre.

**Fix:** Title moved inside the foreground layer of `OurStoryTimeline.tsx` as the first element before the `STORIES.map()`. Since the foreground uses `-mt-[100vh]` to overlap the sticky layer, the title renders as an opaque panel without affecting the sticky container's starting position.

```tsx
<div className="relative z-[2] w-full flex flex-col -mt-[100vh]">
  <div className="bg-[#1a130a] w-full pt-24 pb-0 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="font-display text-5xl sm:text-6xl text-cream text-center">Our Story</h2>
    </div>
  </div>
  {STORIES.map(...)}
</div>
```

---

## 24. Vercel Image Loading Fix — Filename & Folder Case (`public/aboutImages/`)

Images loaded correctly on local (Windows, case-insensitive filesystem) but failed on Vercel (Linux, case-sensitive).

Two issues found and fixed:

### Image filenames had spaces
Original: `Story 1.jpg.jpeg`, `Story 2.jpg.jpeg`, `Story 3.jpg.jpeg`, `Story 4.jpg.jpeg`
Renamed to: `story-1.jpg`, `story-2.jpg`, `story-3.jpg`, `story-4.jpg`

### Folder name had wrong case
`public/AboutImages/` (capital A) did not match the component's `/aboutImages/` (lowercase a) reference.

**Fix:** Used `git mv` two-step rename: `AboutImages` → `aboutImages-tmp` → `aboutImages`. This ensures git tracks the case change on case-insensitive Windows and the rename lands correctly on Vercel's Linux filesystem.

Also cleaned up two stray files accidentally created by a node script: `public/AboutImages/console.log(i+1` and `key`.

### Curly quote corruption fix
The `Edit` tool introduced Unicode curly-quote characters (`“`, `”`) as JavaScript string delimiters in the STORIES array (on `era`, `shortEra`, `location`, and text paragraph lines). Fixed by running targeted Node.js replacement scripts that:
1. Replaced property value delimiters (`era: "..."`) back to ASCII straight quotes
2. Replaced text paragraph delimiters (lines starting with `“`) back to ASCII straight quotes while preserving internal curly-quote content characters

---

## 25. OurStoryTimeline — Text Block Typography & Alignment

| Element | Before | After |
|---------|--------|-------|
| "Our Story" title | left-aligned | `text-center` |
| Era dates | `font-display text-4xl lg:text-5xl text-center` | `text-lg lg:text-xl text-left` |
| Location | `text-terracotta text-sm uppercase tracking-widest font-semibold text-center` | `text-terracotta text-base lg:text-lg font-semibold text-left` |
| Body paragraphs | `text-justify lg:text-center` | `text-justify` |
| Text block inner wrapper | `text-center` | `text-left` |

---

## 26. OurStoryTimeline — Bidirectional Image Swap (`components/about/OurStoryTimeline.tsx`)

The previous single-direction `useInView` observer caused asymmetric image swap timing: perfect when scrolling down, lagged when scrolling up.

### Root cause
`isNearTop` (margin `-20% 0px -70% 0px`) fires `false` twice per TextBlock pass:
1. When block exits the trigger zone going UPWARD (scrolling down past it) → was incorrectly showing previous image
2. When block exits the trigger zone going DOWNWARD (scrolling up) → correct restore behaviour

### Fix: scroll direction tracker
A `scrollDirRef` (`useRef<'up' | 'down'>`) is tracked in the parent `OurStoryTimeline` component via a passive scroll listener:

```tsx
const scrollDirRef = useRef<'up' | 'down'>('down');
useEffect(() => {
  let lastY = window.scrollY;
  const handleScroll = () => {
    scrollDirRef.current = window.scrollY > lastY ? 'down' : 'up';
    lastY = window.scrollY;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

The ref is passed to each `TextBlock`. The image swap `useEffect` now only restores the previous image when `scrollDirRef.current === 'up'`:

```tsx
useEffect(() => {
  if (isNearTop) {
    setImageIndex(index);                           // scrolling down: show this image
  } else if (index > 0 && scrollDirRef.current === 'up') {
    setImageIndex(index - 1);                       // scrolling up: restore previous image
  }
}, [isNearTop, index, setImageIndex, scrollDirRef]);
```

Result: image swap is perfectly symmetric — the exact same scroll position triggers the transition in both directions.

---

## 27. Home Page — "Read Our Story" Button Background Color (`app/(public)/page.tsx`)

The button strip background was `bg-walnut` (`#3D2B1F`) which didn't match the adjacent "Our Collections" section (`bg-[#1a130a]`).

**Fix:** Changed button strip from `bg-walnut` to `bg-[#1a130a]`.

---

## 28. Key Files Modified (Sixth Build)

| File | Change type |
|------|-------------|
| `components/about/OurStoryTimeline.tsx` | Title moved inside foreground layer, typography/alignment overhaul, bidirectional scroll image swap with direction tracker |
| `public/aboutImages/story-1.jpg` | Renamed from `AboutImages/Story 1.jpg.jpeg` (case + spaces fix) |
| `public/aboutImages/story-2.jpg` | Renamed from `AboutImages/Story 2.jpg.jpeg` |
| `public/aboutImages/story-3.jpg` | Renamed from `AboutImages/Story 3.jpg.jpeg` |
| `public/aboutImages/story-4.jpg` | Renamed from `AboutImages/Story 4.jpg.jpeg` |
| `app/(public)/page.tsx` | Button strip background `bg-walnut` → `bg-[#1a130a]` |

---

# Seventh Build Session — Addendum

**Date:** 2026-05-18
**Scope:** BackgroundController architecture (two-panel crossfade), FeaturedSection refactor, OurStorySection refactor, text shadow tuning, mobile font size tuning, mobile text position stabilization (URL bar jitter fix)

---

## 29. BackgroundController — New Architecture (`components/home/BackgroundController.tsx`)

### Problem
Both OurStorySection and FeaturedSection were `position: fixed; z-index: 1` divs. Because they were sibling DOM elements, the later-rendered FeaturedSection painted over OurStorySection everywhere on the page — the crossfade never worked. Various z-index attempts failed because you cannot layer two independent `fixed` elements in the intended way without a shared parent.

### Fix: Single fixed container, two panels, scroll-based opacity toggling
A new `BackgroundController` client component wraps both panels inside a single `fixed inset-0 z-[1]` container. Each panel is `absolute inset-0` within the container. Visibility is toggled via direct DOM manipulation (`useRef` → `style.opacity`/`style.pointerEvents`) in response to a scroll event listener, bypassing React state batching entirely.

**Switch condition:** A sentinel `<div id="featured-start-sentinel" className="h-[2px]" />` is placed in the page at the exact point where the solid dark `#1a130a` button section begins. The switch fires when:
```ts
sentinel.getBoundingClientRect().top <= 0
```
This is a purely positional condition — the panel switches exactly when the sentinel's top edge reaches the viewport's top edge, meaning the dark section fully covers the fixed background.

**`current` flag** prevents redundant DOM writes when the condition hasn't changed between scroll events.

```tsx
"use client";

export default function BackgroundController({ ourStoryContent }: Props) {
  const ourStoryRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    featured.style.opacity = "0";
    featured.style.pointerEvents = "none";
    let current = false;
    const check = () => {
      const show = sentinel.getBoundingClientRect().top <= 0;
      if (show === current) return;
      current = show;
      ourStory.style.opacity = show ? "0" : "1";
      featured.style.opacity = show ? "1" : "0";
    };
    window.addEventListener("scroll", check, { passive: true });
    document.addEventListener("scroll", check, { passive: true }); // belt-and-suspenders
    check();
  }, []);

  return (
    <div className="fixed inset-0 z-[1]">
      <div ref={ourStoryRef} className="absolute inset-0"><OurStorySection /></div>
      <div ref={featuredRef} className="absolute inset-0"><FeaturedSection /></div>
    </div>
  );
}
```

### Why `window` AND `document` scroll listeners
Some mobile browsers fire `scroll` on `document` rather than `window`. Listening on both ensures the check fires in all environments.

### Why direct DOM manipulation instead of React state
React's batched state updates introduced perceptible lag (one render cycle) between scroll position and panel opacity. Direct `ref.current.style` writes happen synchronously on the scroll event.

---

## 30. FeaturedSection — Refactor from Fixed to Relative (`components/home/FeaturedSection.tsx`)

Prior to this build, `FeaturedSection` was `fixed inset-0 z-[1]`. It is now `relative h-full w-full bg-[#FAF6F0]` — it fills its parent (`BackgroundController`'s `absolute inset-0` wrapper) rather than positioning itself independently.

No other visual changes to the image or desktop text overlay.

---

## 31. OurStorySection — Outer Div Refactor (`components/home/OurStorySection.tsx`)

`OurStorySection`'s outer div was changed from `fixed inset-0 z-[2]` to `absolute inset-0 bg-[#FAF6F0]`. Like FeaturedSection, it now fills the `BackgroundController` wrapper rather than positioning itself.

---

## 32. Home Page — Sentinel + BackgroundController Wiring (`app/(public)/page.tsx`)

| Change | Before | After |
|--------|--------|-------|
| OurStorySection | Direct render in page | Removed — rendered inside BackgroundController |
| FeaturedSection | Direct render in page | Removed — rendered inside BackgroundController |
| BackgroundController | Did not exist | Added at top, before HeroSection |
| Sentinel div | Did not exist | `<div id="featured-start-sentinel" className="h-[2px]" />` placed between scroll runway and button strip |
| Scroll runway | Various | `<div className="h-screen" />` — Our Story visible while scrolling through here |
| Featured runway | `h-screen` after CategoryHighlights | Unchanged |

Page scroll structure after this build:
```
BackgroundController (fixed z-[1])         ← always in background
HeroSection (z-[2], sticky)                ← covers background during hero
<div h-screen />                           ← Our Story visible here
<div id="featured-start-sentinel" />       ← switch triggers at this line
<div z-[2] bg-[#1a130a]>buttons</div>      ← covers background, triggers switch
<CategoryHighlights z-[2] />
<div h-screen />                           ← Featured visible here
<section z-[2]>Enquiry</section>
```

---

## 33. FeaturedSection — Text Shadow Intensification

### Lines 3 & 4 (saffron, over variable background)
The saffron text (`#D4A017`) on the translation and attribution lines was hard to read when the Kashmir image's lighter sky area was behind them. A dense multi-layer dark shadow was applied:
```css
text-shadow: 0 0px 4px rgba(0,0,0,1), 0 0px 10px rgba(0,0,0,1),
             0 0px 20px rgba(0,0,0,1), 0 0px 30px rgba(0,0,0,0.9)
```

### Lines 1 & 2 (dark text, over variable background)
The dark text (`#0a0a0a`) on the Sanskrit and romanized lines was similarly difficult to read over darker portions of the image. The same multi-layer approach was applied but with white shadows:
```css
text-shadow: 0 0px 4px rgba(255,255,255,1), 0 0px 10px rgba(255,255,255,1),
             0 0px 20px rgba(255,255,255,1), 0 0px 30px rgba(255,255,255,0.9)
```
An earlier attempt applied a frosted-glass backdrop filter to the text container — this was reverted at the user's request. The final approach keeps the glow on the letters themselves only.

---

## 34. FeaturedSection — Mobile Text Positioning

### Initial approach: CSS calc
`pt-[calc((100vh_-_100vw)/2_-_1rem)]` was added on mobile to push the text overlay down to the top edge of the centered square image. This worked at rest but broke when the browser URL bar appeared/disappeared on scroll — `100vh` changed while the image repositioned using the actual container pixel dimensions, causing the text to drift above the image.

Attempts with `100svh` and `100dvh` also failed for similar reasons (CSS unit references do not stay in sync with the container's measured `clientHeight`).

### Final fix: ResizeObserver + inline style
`FeaturedSection` was converted to a `"use client"` component. A `ResizeObserver` on the container div measures actual pixel dimensions and sets `paddingTop` as an inline style:

```tsx
const update = () => {
  const h = container.clientHeight;
  const w = container.clientWidth;
  if (w < 640) {
    const offset = Math.max(0, (h - w) / 2 + 8); // +8px breathing room
    overlay.style.paddingTop = `${offset}px`;
  } else {
    overlay.style.paddingTop = ""; // sm:pt-14 lg:pt-20 take over
  }
};
```

`ResizeObserver` fires on every container resize (including URL bar show/hide). The `clientHeight` is the same value `object-contain` uses to center the image, so text and image stay in sync regardless of browser chrome state.

The `+8` constant was tuned iteratively (`-16` → `+8`) to position text slightly below the image's top edge for visual breathing room.

---

## 35. FeaturedSection — Mobile Font Size Tuning

All four text lines reduced on mobile only:

| Line | Content | Mobile before | Mobile after |
|------|---------|--------------|--------------|
| Line 1 | Sanskrit verse | `text-base` | `text-sm` |
| Line 2 | Romanized transliteration | `text-sm` | `text-xs` |
| Line 3 | English translation (italic) | `text-sm` | `text-xs` |
| Line 4 | Attribution ("Nilamata Purana…") | `text-xs` | `text-[11px]` |

Line 4 required an arbitrary value because `text-xs` (12px) is the smallest standard Tailwind step.

Final responsive sizes:
```
text-sm     sm:text-lg   lg:text-xl   ← Sanskrit (line 1)
text-xs     sm:text-base lg:text-lg   ← Romanized (line 2)
text-xs     sm:text-base lg:text-lg   ← Translation (line 3)
text-[11px] sm:text-sm   lg:text-base ← Attribution (line 4)
```

---

## 36. Key Files Modified (Seventh Build)

| File | Change type |
|------|-------------|
| `components/home/BackgroundController.tsx` | **New file** — single fixed container managing OurStory + Featured panels with scroll-based opacity toggling |
| `components/home/FeaturedSection.tsx` | Outer div `fixed inset-0 z-[1]` → `relative h-full w-full`; converted to client component; ResizeObserver text positioning; text shadow intensification; mobile font size tuning |
| `components/home/OurStorySection.tsx` | Outer div `fixed inset-0 z-[2]` → `absolute inset-0 bg-[#FAF6F0]` |
| `app/(public)/page.tsx` | BackgroundController wired in; sentinel div added; OurStorySection + FeaturedSection direct renders removed |

---

# Eighth Build Session — Addendum

**Date:** 2026-05-19
**Scope:** CraftHeritageTimeline panel layout overhaul — caption repositioning, top separator bars, two-spacer text centering, overlap fix

---

## 37. CraftHeritageTimeline — Caption Repositioned to Panel Bottom (`components/about/CraftHeritageTimeline.tsx`)

Previously each panel's image caption sat inline in the document flow immediately below the body text, leaving a large empty space beneath it. The caption is now `absolute bottom-0` — pinned to the bottom of every panel regardless of content length.

### Caption structure
```tsx
<div className="absolute bottom-0 inset-x-0 px-6 lg:px-20 pb-10">
  <div className="max-w-2xl mx-auto border-t border-white/10 pt-6">
    <p className="text-stone/60 text-xs lg:text-sm italic leading-relaxed whitespace-pre-line">
      {panel.caption}
      {panel.captionUrl && <a ...>{panel.captionUrl}</a>}
    </p>
  </div>
</div>
```

- `border-t border-white/10` — divider line matching the existing `border-white/10` dividers used elsewhere in the timeline
- `pt-6` (24px) — uniform space between divider and caption text
- `pb-10` (40px) — breathing room between caption text and panel bottom edge
- `pb-40` on the outer panel — reserves 160px at the bottom so the absolute caption never overlaps body text (on normal-length panels)

---

## 38. CraftHeritageTimeline — Top Separator Bars for Panels 2+ (`components/about/CraftHeritageTimeline.tsx`)

A horizontal `border-t border-white/10` line was added near the very top of every panel from panel 2 onwards (index > 0). This mirrors the bottom caption bar and visually frames the content.

### Implementation
The separator is the **first flex child** inside the panel div — it sits at the top of the flex column, right after the `pt-10` (40px) top padding:

```tsx
{index > 0 && (
  <div className="w-full max-w-2xl mx-auto border-t border-white/10 shrink-0" />
)}
```

- `shrink-0` prevents the separator from being compressed by the flex layout
- `border-white/10` matches the color of the intro-text divider in panel 1 and the caption divider in all panels
- Panel 1 is excluded (`index > 0`) because it already has the `border-b border-white/10` divider between the intro text and the section 1 heading

---

## 39. CraftHeritageTimeline — Two-Spacer Text Centering (`components/about/CraftHeritageTimeline.tsx`)

The earlier `justify-center` approach was replaced with two equal `flex-1` spacers sandwiching the content. This centers the body text precisely between the top separator bar and the bottom caption divider, regardless of viewport height.

### Panel structure after refactor

```
panel div (pt-10 pb-40, flex flex-col, min-h-[75vh])
  ├── separator bar         ← border-t, shrink-0 (panels 2+)
  ├── flex-1 min-h-20       ← top spacer (≥ 80px)
  ├── max-w-2xl content     ← heading + subtitle + body text
  ├── flex-1 min-h-20       ← bottom spacer (≥ 80px)
  └── absolute caption      ← pinned to bottom-0
```

### Why two spacers instead of `justify-center`
`justify-center` centers content within the full flex area (bounded by `pt` and `pb`). The top separator and bottom caption are at asymmetric distances from the `pt`/`pb` boundaries, so `justify-center` always produced visually off-center text. Two equal `flex-1` spacers center the content within the space between the separator and the caption — regardless of the padding values.

### `min-h-20` on both spacers
- Guarantees at least **80px of breathing room** between the top bar and the heading text
- Guarantees at least **80px of breathing room** between the body text and the caption divider
- When both spacers share the same `min-h`, the centering remains symmetric even when spacers are at their floor value (long-content panels like panel 6)

---

## 40. CraftHeritageTimeline — Caption Overlap Fix (Panel 6) (`components/about/CraftHeritageTimeline.tsx`)

Panel 6 (The Shah Miri Dynasty) has two long paragraphs. Its caption is also unusually tall (~177px including 5 lines of text, URL, `pt-6`, and `pb-10`) — exceeding the `pb-40` (160px) bottom reserve, causing the absolute caption to overlap the body text.

### Fix
The `min-h-20` (80px) on the bottom spacer extends the effective bottom reserve to `pb-40 + min-h-20 = 160 + 80 = 240px`. Since the tallest caption (panel 6) is ~177px, the content's bottom edge is always at least `240 - 177 = 63px` clear of the caption divider.

### Why not just increase `pb`
Increasing `pb` globally would create visible dead space below shorter captions. The `min-h` on the spacer is local to the flex layout — it only adds space where the content is long enough to compress the spacers.

---

## 41. Panel Layout — Final Class Summary (`components/about/CraftHeritageTimeline.tsx`)

| Element | Classes | Purpose |
|---------|---------|---------|
| Outer panel div | `pt-10 pb-40 px-6 lg:px-20 min-h-[75vh] flex flex-col items-center relative z-10` | Small top padding, large bottom reserve for caption |
| Top separator | `w-full max-w-2xl mx-auto border-t border-white/10 shrink-0` | Visual top bar, panels 2+ only |
| Top spacer | `flex-1 min-h-20` | Centers text; 80px minimum breathing room above content |
| Content div | `max-w-2xl w-full mx-auto text-left space-y-6` | All panel text |
| Bottom spacer | `flex-1 min-h-20` | Centers text; 80px minimum + prevents caption overlap |
| Caption wrapper | `absolute bottom-0 inset-x-0 px-6 lg:px-20 pb-10` | Pins caption to panel bottom |
| Caption inner | `max-w-2xl mx-auto border-t border-white/10 pt-6` | Divider + spacing above caption text |

---

## 42. Key Files Modified (Eighth Build)

| File | Change type |
|------|-------------|
| `components/about/CraftHeritageTimeline.tsx` | Caption moved to `absolute bottom-0`; top separator bars added for panels 2+; two-spacer centering; `min-h-20` on both spacers for breathing room and overlap prevention |

---

# Ninth Build Session — Addendum

**Date:** 2026-05-19
**Scope:** Home page sticky/crossfade architecture overhaul, "Explore Collection" button removal, category page descriptions, CategoryHighlights scroll animation (Option A)

---

## 43. Home Page — Sticky Background + Crossfade Architecture

### Problem
The previous `BackgroundController` used `position: fixed; z-index: 1` for both `OurStorySection` and `FeaturedSection`. This required explicit z-index management on every subsequent element (including the footer) and introduced paint-order edge cases.

### New architecture (`components/home/HomePageClient.tsx` — new file)
The home page was split into a thin server component (`app/(public)/page.tsx`) that fetches data and a client component (`HomePageClient.tsx`) that owns the full layout. The pattern mirrors the about page's sticky/foreground approach.

- **Sticky background container**: `sticky top-0 h-screen z-[1] overflow-hidden` wraps both panels
- Each panel is `absolute inset-0` inside the sticky container
- **Crossfade**: `transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]` on each panel, driven by `showFeatured` React state
- **Foreground**: `relative z-[2] -mt-[100vh]` overlaps the sticky background
- **Switch trigger**: `getBoundingClientRect().top <= 0` on a `buttonStripRef` — fires when the button strip (first opaque element after the transparent gap) fully covers the sticky background

### Scroll structure after refactor
```
sticky background (h-screen, z-[1])
  ├── OurStorySection (absolute inset-0, opacity crossfades)
  └── FeaturedSection (absolute inset-0, opacity crossfades)

foreground (z-[2], -mt-[100vh])
  ├── HeroSection (opaque)
  ├── transparent gap (aspect-square lg:h-[85vh])  ← OurStory visible here
  ├── button strip [ref] (bg-[#1a130a])             ← switch triggers here
  ├── CategoryHighlights (bg-[#1a130a] / bg-[#0a0a0a])
  ├── transparent gap (aspect-square lg:h-[85vh])  ← Featured visible here
  └── Enquiry section (bg-cream-dark)
```

### Switch trigger detail
`getBoundingClientRect().top <= 0` continues returning a negative value after the element scrolls fully above the viewport, so `showFeatured` stays `true` persistently once triggered. A `current` flag prevents redundant React state updates on every scroll event. Both `window` and `document` scroll listeners are attached for mobile browser compatibility.

### Why sticky over fixed
Sticky background stops sticking naturally once the user scrolls past the container — the footer appears without any z-index workarounds. `BackgroundController.tsx` is now orphaned (not imported) but left in place.

---

## 44. Home Page — "Explore Collection" Button Removed

The "Explore Collection" button was removed from the button strip in `HomePageClient.tsx`. Only "Read Our Story ›››" remains, using `inline-block px-8 py-3 bg-terracotta` (auto-width, centered).

---

## 45. Category Pages — Descriptions Added (`app/(public)/category/[slug]/page.tsx`)

A `CATEGORY_DESCRIPTIONS: Record<string, string>` constant was added covering all 13 category slugs. The descriptions were extracted from `public/CategoriesDiscriptions.docx`.

| Slug | Craft |
|------|-------|
| `copperware` | Engraving tradition, Persian/Mughal/naga influence |
| `papier-mch` | Dual-artisan (Saakhta Kaar + Naqash), Persian aesthetic |
| `silverware` | Declining tradition, European hybrid forms, filigree |
| `enamelware` | Vitreous enamel on copper/brass/silver, largely extinct |
| `terracotta` | Oldest craft, Neolithic Burzahom (c. 3000–1500 BCE) |
| `green-serpentine` | Zahar mohar, protective/medicinal, poison-detection lore |
| `coins` | Political history Indo-Greek → Mughal dynasties |
| `shawls` | Pashmina/shahtoosh, Sozni/kaani weaving |
| `jewellery` | Silver + stones, everyday and ceremonial adornment |
| `carpets` | 15th-century Persian import under Zain-ul-Abidin |
| `willow-wicker` | Late 19th–20th century, British colonial origin |
| `wood-work` | Medieval origins, lattice/relief carving, Silk Route |
| `brass-ware` | Sultanate/Mughal era, Kashmiri Pandit ritual use |

### Page header structure
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
  <div className="mb-10">
    <h1 className="font-display text-3xl lg:text-6xl text-cream mb-4">{category.name}</h1>
    {description && (
      <p className="text-stone text-sm lg:text-base leading-relaxed text-justify mb-8">{description}</p>
    )}
    <div className="border-t border-white/10" />
  </div>
  <ItemGrid items={items} ... />
</div>
```

- `pt-24` — prevents title hugging the navbar
- Title matches item card title styling (`font-display`, `text-cream`)
- Description matches item description styling (`text-stone`, `text-base`, `text-justify`, full container width)
- Divider `border-white/10` matches CraftHeritageTimeline separators
- Item count removed

---

## 46. CategoryHighlights — Scroll Animation (`components/home/CategoryHighlights.tsx`)

### Animation design (Option A)
Cards stay fixed width. On hover (desktop) or active scroll position (mobile):
- **Card scale**: 90% default → 105% active/hovered
- **Image zoom**: 100% default → 110% active/hovered (within fixed card bounds, `overflow-hidden`)
- **Opacity dimming**: non-active cards fade to 50%

### Rejected approach — Option B (width expansion)
Width-expanding cards (`w-[70vw]` → `w-[85vw]` via `animate={{ width }}`) were tried first. User rejected as "choppy and expands in a weird way."

### Failed first Option A attempt
Adding `animate={{ scale, opacity }}` directly to the outer `motion.div` (which also has `whileInView`) caused framer-motion's priority chain (`whileHover > whileInView > animate`) to let `whileInView={{ scale: 1 }}` permanently override `animate={{ scale: 0.9 }}`. Images appeared tiny on desktop.

### Final two-layer implementation
```tsx
<motion.div  // outer — entrance animation only
  initial={{ opacity: 0, scale: 0.96 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, root: scrollContainerRef }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  onMouseEnter={() => setHoveredIndex(i)}
>
  <motion.div  // inner — all interactive effects
    initial={false}
    animate={{
      scale: isActive ? 1.05 : 0.9,
      opacity: isDimmed ? 0.5 : 1,
    }}
    whileHover={isLg ? { scale: 1.05 } : {}}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
```

`initial={false}` prevents a mount animation from scale(1) → scale(0.9) — cards appear directly at 90% without an initial shrink.

### Why framer-motion instead of CSS classes for scale
A CSS attempt used `scale-90 lg:hover:scale-105` Tailwind classes. On hover, the browser snapped to 100% momentarily before the CSS transition to 105% began — likely a Tailwind v4 CSS custom property composition issue with the hover pseudo-class. Framer-motion interpolates the full 0.9 → 1.05 range in JS, guaranteeing a smooth animation with no intermediate snap.

### New state and refs
| Variable | Type | Purpose |
|----------|------|---------|
| `hoveredIndex` | `number \| null` | Desktop: which card is hovered (drives dimming) |
| `scrollActiveIndex` | `number \| null` | Mobile: which card is closest to scroll container center |
| `isLg` | `boolean` | Viewport ≥ 1024px — gates `whileHover` to desktop only |
| `cardRefs` | `ref[]` | Array of card DOM refs for mobile centre-detection |

### Mobile active detection
Scroll listener on `scrollContainerRef` computes which card's centre is closest to the container's visible centre:
```tsx
const centre = el.scrollLeft + el.clientWidth / 2;
cardRefs.current.forEach((card, i) => {
  const cardCentre = card.offsetLeft + card.offsetWidth / 2;
  if (Math.abs(cardCentre - centre) < minDist) { minDist = ...; closest = i; }
});
setScrollActiveIndex(closest);
```

### isDimmed and isActive logic
```tsx
const isActive = !isLg && scrollActiveIndex === i;
const isDimmed = isLg
  ? hoveredIndex !== null && hoveredIndex !== i
  : scrollActiveIndex !== null && scrollActiveIndex !== i;
```

---

## 47. Key Files Modified (Ninth Build)

| File | Change type |
|------|-------------|
| `app/(public)/page.tsx` | Converted to thin server component; passes categories + homeContent + aboutContent to HomePageClient |
| `components/home/HomePageClient.tsx` | **New file** — client component owning full home page layout with sticky background, crossfade, scroll trigger |
| `app/(public)/category/[slug]/page.tsx` | Added `CATEGORY_DESCRIPTIONS` (13 slugs), `pt-24` padding, description + divider header, item count removed |
| `components/home/CategoryHighlights.tsx` | Option A animation — inner `motion.div` for scale/opacity, mobile active detection, `isLg` breakpoint, `hoveredIndex` + `scrollActiveIndex` state |

---

# Tenth Build Session — Addendum

**Date:** 2026-05-19
**Scope:** Research section added to home page foreground — `ResearchHighlights` component, static research items, same scroll/animation pattern as CategoryHighlights

---

## 48. ResearchHighlights — New Home Page Section (`components/home/ResearchHighlights.tsx`)

A new static section was added to the home page foreground mirroring the structure and behavior of `CategoryHighlights`. Unlike CategoryHighlights (which receives `categories` as a prop from Firestore), ResearchHighlights is fully static — the three items are hardcoded in a `RESEARCH_ITEMS` constant.

### Position in home page scroll structure

```
foreground (z-[2], -mt-[100vh])
  ├── HeroSection (opaque)
  ├── transparent gap 1 (aspect-square lg:h-[85vh])   ← OurStory visible
  ├── button strip [ref] (bg-[#1a130a])                ← crossfade trigger
  ├── CategoryHighlights (bg-[#1a130a] / bg-[#0a0a0a])
  ├── transparent gap 2 (aspect-square lg:h-[85vh])   ← Featured visible
  ├── ResearchHighlights (bg-[#1a130a] / bg-[#0a0a0a]) ← NEW
  └── Enquiry section (bg-cream-dark)
```

No button or additional transparent gap is inserted before `ResearchHighlights` — it follows immediately after the Featured transparent gap, so the Featured background is visible during the gap and then the Research section appears as a solid opaque block.

### Static items

```tsx
const RESEARCH_ITEMS = [
  { id: "adaptive-reuse",   name: "Adaptive Reuse",   href: "/research/adaptive-reuse",   image: "/Research/AdaptiveReuse.jpg" },
  { id: "reinterpretation", name: "Reinterpretation", href: "/research/reinterpretation", image: "/Research/Reinterpretation.jpg" },
  { id: "graphic-design",   name: "Graphic Design",   href: "/research/graphic-design",   image: "/Research/GraphicDesign.jpg" },
];
```

Image files are in `public/Research/` (capital R — matches Vercel's case-sensitive filesystem). Routes match the existing navbar sub-links wired in the seventh build.

### Section header

Same structure as CategoryHighlights:
- Same `/IsbandHomePage.png` centered image (placeholder — to be replaced with a research-specific asset later)
- `h2`: `font-display text-6xl text-cream font-semibold text-center` — "Research"
- Subtitle: filler text describing the research programme (to be replaced with CMS content)
- `border-t border-white/5` divider below subtitle

### Scroll panel behavior

Identical to CategoryHighlights:
- Horizontal `overflow-x-auto` scroll container with hidden scrollbar
- Same custom scrollbar: draggable thumb, click-to-seek track, left/right arrow buttons
- Same `[&::-webkit-scrollbar]:hidden` + `scrollbarWidth: none` cross-browser hide
- Same card dimensions: `w-[70vw]` mobile, `w-[30vw]` desktop

### Animation — identical to CategoryHighlights Option A

The same two-layer `motion.div` pattern with `initial={false}`:

```tsx
<motion.div  // outer — entrance only
  initial={{ opacity: 0, scale: 0.96 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, root: scrollContainerRef }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  onMouseEnter={() => setHoveredIndex(i)}
>
  <motion.div  // inner — interactive scale + opacity
    initial={false}
    animate={{
      scale: isActive ? 1.05 : 0.9,
      opacity: isDimmed ? 0.5 : 1,
    }}
    whileHover={isLg ? { scale: 1.05 } : {}}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
```

All state variables, refs, and logic (`hoveredIndex`, `scrollActiveIndex`, `isLg`, `cardRefs`, mobile center-detection, drag handlers) are reproduced verbatim from `CategoryHighlights.tsx`.

Image CSS zoom uses the same CSS transition (not framer-motion) since it doesn't suffer from the snap issue:
```tsx
className={`object-cover transition-transform duration-700 lg:group-hover:scale-110 ${isActive ? "scale-110" : ""}`}
```

### Colors

Same palette as CategoryHighlights:
- Section: `bg-[#1a130a]`
- Scroll track: `bg-[#0a0a0a]`
- Text: `text-cream`, `text-stone`, `text-terracotta` (on hover)
- Scrollbar thumb: `bg-cream`

---

## 49. HomePageClient — ResearchHighlights Wired In (`components/home/HomePageClient.tsx`)

`ResearchHighlights` imported and placed between transparent gap 2 and the General Enquiry section:

```tsx
import ResearchHighlights from "@/components/home/ResearchHighlights";

// ...

{/* Transparent gap 2 — Featured visible beneath */}
<div className="aspect-square lg:h-[85vh] w-full" />

{/* Research — opaque */}
<ResearchHighlights />

{/* General Enquiry — opaque */}
<section className="bg-cream-dark py-16">
```

No new props required — `ResearchHighlights` is self-contained (static data, no DB fetch).

---

## 50. Key Files Modified (Tenth Build)

| File | Change type |
|------|-------------|
| `components/home/ResearchHighlights.tsx` | **New file** — static Research section with three items, full CategoryHighlights animation parity |
| `components/home/HomePageClient.tsx` | Added `ResearchHighlights` import; placed between transparent gap 2 and enquiry section |

---

# Eleventh Build Session — Addendum

**Date:** 2026-05-20
**Scope:** CategoryHighlights vertical padding, Urdu script names under category titles, ResearchHighlights image updates + padding, category page description source linked to Firestore

---

## 51. CategoryHighlights — Vertical Padding Added (`components/home/CategoryHighlights.tsx`)

The `bg-[#0a0a0a]` scroll container previously had no top padding (images started flush at the top) and only `pb-8` (32px) below the title text.

**Fix:** Added `pt-12 pb-12` (48px top and bottom) to the scroll container:

```tsx
// Before
className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden bg-[#0a0a0a]"

// After
className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 [&::-webkit-scrollbar]:hidden bg-[#0a0a0a]"
```

Image dimensions, card dimensions, and all animation values are unchanged — only the black space above the images and below the category titles was expanded.

---

## 52. CategoryHighlights — Urdu Script Names (`components/home/CategoryHighlights.tsx`)

A `URDU_NAMES` lookup map was added (slug → Urdu script) and a `<p>` element renders the Urdu name centered below the English title on every card.

### Lookup map
```tsx
const URDU_NAMES: Record<string, string> = {
  "copperware":        "کاپر ویئر",
  "papier-mch":        "پیپر ماشی",
  "silverware":        "سلور ویئر",
  "enamelware":        "اینامل ویئر",
  "terracotta":        "ٹیراکوٹا",
  "green-serpentine":  "گرین سرپینٹائن",
  "coins":             "سکے",
  "shawls":            "شالیں",
  "jewellery":         "زیورات",
  "carpets":           "قالین",
  "willow-wicker":     "بید کی ٹوکری سازی",
  "wood-work":         "لکڑی کا کام",
  "brass-ware":        "پیتل کے برتن",
};
```

### Rendered element
```tsx
{URDU_NAMES[cat.slug] && (
  <p
    className="text-stone/70 text-[24px] lg:text-[26px] mt-1"
    dir="rtl"
    lang="ur"
  >
    {URDU_NAMES[cat.slug]}
  </p>
)}
```

- `dir="rtl" lang="ur"` — enables correct Urdu text shaping in the browser
- `text-stone/70` — slightly muted to sit below the English title in visual hierarchy
- If a category slug has no entry in the map, the element is simply not rendered

### Font size tuning log
| Step | Mobile | Desktop |
|------|--------|---------|
| Initial | `text-lg` (18px) | `text-xl` (20px) |
| +2pt | `text-[20px]` | `text-[22px]` |
| +2pt | `text-[22px]` | `text-[24px]` |
| +2pt (final) | `text-[24px]` | `text-[26px]` |

---

## 53. ResearchHighlights — Image Updates (`components/home/ResearchHighlights.tsx`)

Two card images replaced with new `.png` assets:

| Card | Before | After |
|------|--------|-------|
| Reinterpretation | `/Research/Reinterpretation.jpg` | `/Research/Reinterpretation1.png` |
| Graphic Design | `/Research/GraphicDesign.jpg` | `/Research/GraphicDesign1.png` |

Adaptive Reuse image (`/Research/AdaptiveReuse.jpg`) unchanged.

---

## 54. ResearchHighlights — Vertical Padding Added (`components/home/ResearchHighlights.tsx`)

Same `pt-12 pb-12` padding applied to the Research scroll container, matching the CategoryHighlights change (section 51):

```tsx
// Before
className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden bg-[#0a0a0a]"

// After
className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 [&::-webkit-scrollbar]:hidden bg-[#0a0a0a]"
```

---

## 55. Category Page — Description Source Linked to Firestore (`app/(public)/category/[slug]/page.tsx`)

### Problem
The admin panel's `CategoryForm` saves a `description` field to Firestore when a category is created or edited. However, the category page was reading descriptions from a hardcoded `CATEGORY_DESCRIPTIONS` constant — it never read `category.description` from Firestore, so admin panel edits had no effect on the displayed text.

### Fix
```tsx
// Before — only reads hardcoded constant
const description = CATEGORY_DESCRIPTIONS[slug];

// After — Firestore first, constant as fallback
const description = category.description || CATEGORY_DESCRIPTIONS[slug];
```

The hardcoded constant is kept as a fallback so categories that have never been saved via the admin panel continue to display the original descriptions. Once a description is saved in the admin panel for a category, it takes precedence.

### Category type
`Category.description` is already typed as `description?: string` in `types/index.ts` — no type changes required.

---

## 56. Key Files Modified (Eleventh Build)

| File | Change type |
|------|-------------|
| `components/home/CategoryHighlights.tsx` | `pt-12 pb-12` padding on scroll container; `URDU_NAMES` map added; Urdu `<p>` rendered below each English title |
| `components/home/ResearchHighlights.tsx` | `Reinterpretation.jpg` → `Reinterpretation1.png`, `GraphicDesign.jpg` → `GraphicDesign1.png`; `pt-12 pb-12` padding on scroll container |
| `app/(public)/category/[slug]/page.tsx` | Description source changed from hardcoded constant only → `category.description \|\| CATEGORY_DESCRIPTIONS[slug]` |

---

# Twelfth Build Session — Addendum

**Date:** 2026-05-21
**Scope:** CategoryHighlights English title color fix, OurStory + Featured panel background color, FeaturedSection image + text overhaul, clickability affordance (underline + "Explore →"), dual-language Kashmiri title feature (admin + catalogue), "Get in Touch" heading color fix

---

## 57. CategoryHighlights — English Title Color + Urdu Hover (`components/home/CategoryHighlights.tsx`)

The English category title (`h3`) was using `text-cream` which made it brighter than the Urdu subtitle. Changed to match the Urdu title color (`text-stone/70`) so both sit at the same visual weight by default.

- **Before:** `text-cream`
- **After:** `text-stone/70`

Urdu subtitle (`<p dir="rtl">`) also updated to participate in the hover color transition:

```tsx
// Before
className="text-stone/70 text-[24px] lg:text-[26px] mt-1"

// After
className="text-stone/70 text-[24px] lg:text-[26px] mt-1 group-hover:text-terracotta transition-colors duration-300"
```

---

## 58. CategoryHighlights + ResearchHighlights — Clickability Affordance

Users reported collections and research cards were not obviously clickable. Two affordances were added to both sections:

### Invisible underline that appears on hover
Added to the `h3` title in both components:
```tsx
underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-terracotta transition-[text-decoration-color] duration-300
```
The underline exists in the DOM at all times but is `decoration-transparent` — it becomes `decoration-terracotta` only on hover, with a smooth CSS transition.

### "Explore →" fade-in below title
```tsx
<p className="text-terracotta text-sm mt-2 tracking-wide lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
  Explore →
</p>
```
On mobile (`!lg`): always visible. On desktop (`lg`): hidden by default, fades in on hover.

---

## 59. OurStorySection + FeaturedSection — Background Color (`components/home/OurStorySection.tsx`, `components/home/FeaturedSection.tsx`)

Background color changed from `bg-[#FAF6F0]` (cream) to `bg-[#3f4d42]` (dark green) on both panels.

Text colors updated to remain legible on the new background:
- **OurStorySection P1** (main story text): `text-[#1a130a]` (dark brown)
- **OurStorySection P2** (tagline): `text-[#D4A017]` (saffron)
- **FeaturedSection lines 1 & 2** (Sanskrit + romanized): `text-[#0a0a0a]` (near-black)
- **FeaturedSection lines 3 & 4** (translation + attribution): `text-[#D4A017]` (saffron)

---

## 60. FeaturedSection — Image + Text Overhaul (`components/home/FeaturedSection.tsx`)

The Featured panel was fully redesigned:

### New image
`/FeaturedPannelImage1.jpeg` replaces the previous image. Actual dimensions: **2480×2034px** (not 1:1).

### New text (4 lines)
| Line | Content | Color |
|------|---------|-------|
| 1 | कश्मीरा हि महाभागा देशानामुत्तमोत्तमा । (Sanskrit) | `#0a0a0a` |
| 2 | Kaśmīrā hi mahābhāgā deśānām uttamottamā. (romanized) | `#0a0a0a` |
| 3 | Kashmir is greatly fortunate, the finest among lands. (italic) | `#D4A017` |
| 4 | Nilamata Purana, around AD 500-700 (attribution) | `#D4A017` |

### Layout
- **Mobile** (`!lg`): text and image centered vertically in the panel (`flex flex-col items-center justify-center`)
- **Desktop** (`lg`): text and image pinned to the bottom of the panel (`lg:bottom-0 lg:justify-end`)
- Text block sits immediately above the image (`mb-2` between text and image wrapper)

### Aspect ratio fix — no letterboxing
Because the image is 2480×2034 (not square), using a `1:1` wrapper with `object-contain` created dead space above the image. Fixed by using `aspect-[2480/2034]` on the image wrapper, matching the image's actual proportions:
```tsx
<div className="relative w-full max-w-[min(90vw,80vh)] aspect-[2480/2034]">
  <Image src="/FeaturedPannelImage1.jpeg" fill className="object-cover" />
</div>
```

### Responsive font sizes
```
text-sm     sm:text-lg   lg:text-xl   ← Sanskrit (line 1)
text-xs     sm:text-base lg:text-lg   ← Romanized (line 2)
text-xs     sm:text-base lg:text-lg   ← Translation (line 3, italic)
text-[11px] sm:text-sm   lg:text-base ← Attribution (line 4)
```

### `"use client"` removed
The ResizeObserver from the seventh build was no longer needed once the aspect ratio mismatch was fixed with `aspect-[2480/2034]`. The component reverted to a plain server component.

---

## 61. Dual-Language Kashmiri Title Feature (6 files)

A second title field (`titleKashmiri`) was added to items — editable via admin panel, rendered on item cards and the item detail page. If not filled in, no empty space is added.

### `types/index.ts`
Added `titleKashmiri?: string` to the `Item` interface.

### `lib/validations.ts`
Added `titleKashmiri: z.string().optional()` to `itemSchema`.

### `lib/firebase/items.ts` (critical bug fix)
Added `titleKashmiri: data.titleKashmiri ?? undefined` inside the `serialize()` function. This was the root cause of Kashmiri titles saved in Firestore not appearing on the website — `serialize()` mapped every field except `titleKashmiri`.

### `lib/firebase/admin-items.ts`
Added `titleKashmiri?: string` to the `ItemWriteData` interface and `titleKashmiri: data.titleKashmiri ?? undefined` in the `adminGetAllItems` mapping.

### `components/forms/ItemForm.tsx`
- "Title" label renamed → "English Title"
- Added "Kashmiri Title (optional)" `<Input>` with `dir="rtl" lang="ks"` for correct Nastaliq text shaping
- Added `titleKashmiri` to local Zod schema, `defaultValues`, and submit data

### `components/items/ItemCard.tsx`
Kashmiri title rendered below the English title on both mobile and desktop variants:
```tsx
{item.titleKashmiri && (
  <p className="font-display text-xl text-cream mb-2 group-hover:text-terracotta transition-colors text-left" dir="rtl" lang="ks">
    {item.titleKashmiri}
  </p>
)}
```
`text-left` overrides the browser's default RTL right-alignment. Only rendered when `titleKashmiri` exists — no dead space otherwise.

### `app/(public)/category/[slug]/[itemId]/page.tsx`
Same conditional render on the item detail page:
```tsx
{item.titleKashmiri && (
  <p className="font-display text-2xl text-[#FAF6F0] mb-3 text-left" dir="rtl" lang="ks">
    {item.titleKashmiri}
  </p>
)}
```

---

## 62. "Get in Touch" Heading Color Fix (`components/home/HomePageClient.tsx`)

The "Get in Touch" h2 in the General Enquiry section used `text-walnut` (`#3D2B1F`) — nearly invisible against the `bg-cream-dark` background.

- **Before:** `text-walnut`
- **After:** `text-cream`

Confirmed consistent with:
- `app/(public)/contact/page.tsx` — already `text-cream` ✓
- `components/forms/EnquiryDialog.tsx` — `DialogTitle` already `text-cream` ✓

---

## 63. Key Files Modified (Twelfth Build)

| File | Change type |
|------|-------------|
| `components/home/CategoryHighlights.tsx` | English title `text-cream` → `text-stone/70`; Urdu hover color; invisible underline + "Explore →" affordance |
| `components/home/ResearchHighlights.tsx` | Same invisible underline + "Explore →" affordance as CategoryHighlights |
| `components/home/OurStorySection.tsx` | Background `bg-[#FAF6F0]` → `bg-[#3f4d42]`; text colors updated |
| `components/home/FeaturedSection.tsx` | Background → `bg-[#3f4d42]`; new image (`FeaturedPannelImage1.jpeg`); 4-line Sanskrit verse text; `aspect-[2480/2034]` letterbox fix; mobile centering; `"use client"` removed |
| `components/home/HomePageClient.tsx` | Enquiry section h2 `text-walnut` → `text-cream` |
| `types/index.ts` | `titleKashmiri?: string` added to `Item` interface |
| `lib/validations.ts` | `titleKashmiri: z.string().optional()` added to `itemSchema` |
| `lib/firebase/items.ts` | `titleKashmiri` added to `serialize()` — root-cause fix for Kashmiri titles not appearing on website |
| `lib/firebase/admin-items.ts` | `titleKashmiri` added to `ItemWriteData` interface and `adminGetAllItems` mapping |
| `components/forms/ItemForm.tsx` | "Kashmiri Title" field added; "English Title" label; RTL input |
| `components/items/ItemCard.tsx` | Kashmiri title rendered conditionally below English title on mobile + desktop; `text-left` fix |
| `app/(public)/category/[slug]/[itemId]/page.tsx` | Kashmiri title rendered conditionally on item detail page |

---

# Thirteenth Build Session — Addendum

**Date:** 2026-05-23
**Scope:** Panel background color update, Adaptive Reuse image swap, FeaturedSection text size normalization

---

## 64. OurStorySection + FeaturedSection — Background Color Update

Both panels updated from `#3f4d42` (dark green) to `#6D6554` (warm grey-brown).

| File | Change |
|------|--------|
| `components/home/OurStorySection.tsx` | `bg-[#3f4d42]` → `bg-[#6D6554]` |
| `components/home/FeaturedSection.tsx` | `bg-[#3f4d42]` → `bg-[#6D6554]` |

---

## 65. ResearchHighlights — Adaptive Reuse Image Swap (`components/home/ResearchHighlights.tsx`)

| Card | Before | After |
|------|--------|-------|
| Adaptive Reuse | `/Research/AdaptiveReuse.jpg` | `/Research/AdaptiveReuse1.png` |

---

## 66. FeaturedSection — Text Size Normalization (`components/home/FeaturedSection.tsx`)

Lines 1–3 were simplified to a flat `text-base` (16px) on all screen sizes, matching the Our Story panel's approach (no responsive variants). Line 4 was updated to match the CraftHeritageTimeline caption sizes.

### Lines 1–3
| Line | Before | After |
|------|--------|-------|
| Line 1 (Sanskrit) | `text-sm sm:text-lg lg:text-xl` | `text-base` |
| Line 2 (Romanized) | `text-xs sm:text-base lg:text-lg` | `text-base` |
| Line 3 (Translation, italic) | `text-xs sm:text-base lg:text-lg` | `text-base` |

### Line 4 (Attribution)
Matched to `CraftHeritageTimeline` caption sizes:

| Before | After |
|--------|-------|
| `text-[11px] sm:text-sm lg:text-base` | `text-xs lg:text-sm` |

---

## 67. Key Files Modified (Thirteenth Build)

| File | Change type |
|------|-------------|
| `components/home/OurStorySection.tsx` | Background `bg-[#3f4d42]` → `bg-[#6D6554]` |
| `components/home/FeaturedSection.tsx` | Background `bg-[#3f4d42]` → `bg-[#6D6554]`; lines 1–3 → flat `text-base`; line 4 → `text-xs lg:text-sm` |
| `components/home/ResearchHighlights.tsx` | Adaptive Reuse image `AdaptiveReuse.jpg` → `AdaptiveReuse1.png` |

---

# Fourteenth Build Session — Addendum

**Date:** 2026-05-23
**Scope:** Background color iterations on both panels, mobile line break in FeaturedSection, hero tagline color, FeaturedSection image swap, mobile heading size tuning, `/collections` page (new route), Navbar link update, custom CollectionItemCard layout

---

## 68. OurStorySection + FeaturedSection — Background Color Iterations

Multiple background color iterations across the two panels:

| Step | Color | Hex |
|------|-------|-----|
| Start | Warm grey-brown | `#6D6554` |
| 2 | Dark reddish brown | `#7A3B20` |
| 3 | Sienna | `#A0522D` |
| 4 | Very dark brown | `#3D1F0F` |
| 5 | Pantone Copper (approx.) | `#AD6F3B` |
| 6 | Pantone Hyatts (approx.) | `#C9896A` |
| 7 | Cream | `#FAF6F0` |
| **Final** | Pantone Copper | **`#AD6F3B`** |

Saffron text (`#D4A017`) in both panels was changed to cream (`#FAF6F0`) and `font-semibold` was removed from both panels when the background settled at `#AD6F3B`.

| Panel | Element | Before | After |
|-------|---------|--------|-------|
| OurStorySection | P2 tagline | `text-[#D4A017] font-semibold` | `text-[#FAF6F0]` |
| FeaturedSection | Lines 3 & 4 | `text-[#D4A017]` | `text-[#FAF6F0]` |

---

## 69. FeaturedSection — Mobile Line Break (`components/home/FeaturedSection.tsx`)

Line 3 (the English translation) was broken into two visual lines on mobile only using `<br className="sm:hidden" />` after the comma:

```tsx
Kashmir is greatly fortunate,<br className="sm:hidden" /> the finest among lands.
```

- Mobile (< 640px): renders on two lines
- 640px+: `sm:hidden` hides the `<br>`, text flows as one line

---

## 70. FeaturedSection — Image Swap (`components/home/FeaturedSection.tsx`)

| Before | After |
|--------|-------|
| `/FeaturedPannelImage1.jpeg` | `/BuddhaFeaturedPannel.png` |

The new image's actual dimensions (read from PNG header bytes): **2480×2055px**.

Aspect ratio wrapper updated:
```tsx
// Before
<div className="relative w-full max-w-[min(90vw,80vh)] aspect-[2480/2034]">

// After
<div className="relative w-full max-w-[min(90vw,80vh)] aspect-[2480/2055]">
```

---

## 71. HeroSection — Tagline Color Update (`components/home/HeroSection.tsx`)

The "Silenced Crafts, Speaking Again" tagline was updated from `text-saffron` (`#D4A017`) to `#CA9A56` (a warmer, slightly lighter gold) on both the mobile and desktop variants.

```tsx
// Before (both mobile + desktop)
className="text-[#CA9A56] ..."   // was text-saffron

// After
className="text-[#CA9A56] ..."
```

`replace_all` was used to update both instances simultaneously.

---

## 72. CategoryHighlights + ResearchHighlights — Mobile Heading Size Tuning

Both section headings were adjusted for mobile. Starting at `text-6xl` on all sizes, they were tuned down for mobile:

| Step | Size |
|------|------|
| Start | `text-6xl` (all sizes) |
| -2pt mobile | `text-5xl lg:text-6xl` |
| +1pt mobile (final) | `text-5xl lg:text-6xl` → **`text-5xl lg:text-6xl`** |

Final: `text-5xl lg:text-6xl` on both `CategoryHighlights` and `ResearchHighlights` section headings.

---

## 73. `/collections` Page — New Route (`app/(public)/collections/page.tsx`)

A new `/collections` page was created showing all categories with their items in a single scrollable view.

### Architecture decisions
- **Data**: fetches all categories via `getAllCategories()`, then parallel `getItemsByCategory()` for each — same data sources as the home page and individual category pages
- **Empty categories filtered**: `categoryItems.filter(({ items }) => items.length > 0)` — categories with no items are silently excluded. When items are added to previously empty categories, they appear automatically on next page load (`force-dynamic`)
- **Descriptions**: reads `category.description` (Firestore) first, falls back to shared `CATEGORY_DESCRIPTIONS` constant — same priority as `category/[slug]/page.tsx`

### Shared `CATEGORY_DESCRIPTIONS` extracted

The inline constant from `app/(public)/category/[slug]/page.tsx` was extracted to a new shared module:

**New file:** `lib/category-descriptions.ts`
```ts
export const CATEGORY_DESCRIPTIONS: Record<string, string> = { /* 13 slugs */ };
```

Both `category/[slug]/page.tsx` and `collections/page.tsx` import from this shared file, ensuring descriptions stay in sync.

### Page structure
```tsx
<div pt-24 pb-12>
  {/* Page header */}
  <h1>Our Collections</h1>
  <p>Explore our entire collection.</p>
  <border-t />

  {/* One section per non-empty category */}
  {populated.map(({ category, items }) => (
    <section mb-24>
      <Link href={`/category/${category.slug}`}>
        <h2>{category.name}</h2>     ← clickable, hover:text-terracotta
      </Link>
      {description && <p>{description}</p>}
      <border-t />
      <CollectionItemCard grid>
    </section>
  ))}
</div>
```

- Category heading links to the individual category page (`/category/[slug]`)
- Order follows `getAllCategories()` order (same `order` field as navbar)

---

## 74. CollectionItemCard — New Component (`components/items/CollectionItemCard.tsx`)

A purpose-built card for the `/collections` page replacing the standard `ItemGrid` / `ItemCard`.

### Design
- **Image**: square `aspect-square`, `object-cover`, hover zoom (`scale-105` over 700ms) — identical animation to the existing `ItemCard`
- **Title block**: centered below the image
  - English title: `font-display text-xl lg:text-2xl text-cream`, hover → `text-terracotta`
  - Kashmiri title (if set): `font-display text-base lg:text-lg text-stone`, `dir="rtl" lang="ks"`, hover → `text-terracotta`
- **Hidden**: price, dimensions, description, badge, enquire button — none visible
- **Link**: entire card wraps in `<Link href={/category/${item.categorySlug}/${item.id}}>` — navigates to the item detail page

### Grid layout
Applied directly in `collections/page.tsx`:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
  {items.map((item) => (
    <CollectionItemCard key={item.id} item={item} />
  ))}
</div>
```
- **Mobile**: 1 column
- **Desktop** (≥ 1024px): 2 columns
- Gap: `gap-x-8` (32px) horizontal, `gap-y-12` (48px) vertical

### Entrance animation
Uses a single `motion.div` with `whileInView` (no stagger — simpler than the dual-layer `ItemCard`):
```tsx
const fadeUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};
```
`once: false` — animation re-fires when cards scroll back into view.

---

## 75. Navbar — "Our Collections" Link Updated (`components/layout/Navbar.tsx`)

The hamburger menu "Our Collections" link was changed from anchoring to the home page collections section to navigating to the new dedicated `/collections` page:

```tsx
// Before
href="/#collections"

// After
href="/collections"
```

---

## 76. Key Files Modified (Fourteenth Build)

| File | Change type |
|------|-------------|
| `components/home/OurStorySection.tsx` | Background through multiple iterations → final `bg-[#AD6F3B]`; P2 `text-[#D4A017] font-semibold` → `text-[#FAF6F0]` |
| `components/home/FeaturedSection.tsx` | Background → `bg-[#AD6F3B]`; lines 3 & 4 `text-[#D4A017]` → `text-[#FAF6F0]`; `font-semibold` removed; mobile `<br>` on line 3; image → `BuddhaFeaturedPannel.png`; `aspect-[2480/2055]` |
| `components/home/HeroSection.tsx` | Tagline `text-saffron` → `text-[#CA9A56]` (both mobile + desktop) |
| `components/home/CategoryHighlights.tsx` | Section heading `text-6xl` → `text-5xl lg:text-6xl` |
| `components/home/ResearchHighlights.tsx` | Section heading `text-6xl` → `text-5xl lg:text-6xl`; Adaptive Reuse image → `AdaptiveReuse1.png` |
| `lib/category-descriptions.ts` | **New file** — shared `CATEGORY_DESCRIPTIONS` constant (13 slugs) |
| `app/(public)/category/[slug]/page.tsx` | Inline `CATEGORY_DESCRIPTIONS` removed; imports from shared `lib/category-descriptions.ts` |
| `app/(public)/collections/page.tsx` | **New file** — `/collections` route; all categories + items; `CollectionItemCard` grid (1-col mobile, 2-col desktop) |
| `components/items/CollectionItemCard.tsx` | **New file** — image + centered title only; hover zoom; links to item detail page |
| `components/layout/Navbar.tsx` | "Our Collections" `href="/#collections"` → `href="/collections"` |

---

# Fifteenth Build Session — Addendum

**Date:** 2026-05-24
**Scope:** Logo replacement (LogoNew.png → Logo.png), navbar refinements, hero section desktop logo size increase, mobile hero animation tuning (size + Y position), README overhaul (new video, live site link, new sections + screenshots)

---

## 77. Logo Replacement — `Logo.png` Site-wide

The website logo was updated from `LOGO.png` (old silhouette) to `Logo.png` (new calligraphic bowl outline in cream) across all four instances in the codebase. An intermediate step used `LogoNew.png` before the final `Logo.png` file was confirmed.

| File | Instance | Src |
|------|----------|-----|
| `components/home/HeroSection.tsx` | Mobile hero animated logo | `Logo.png` |
| `components/home/HeroSection.tsx` | Desktop hero static logo | `Logo.png` |
| `components/layout/Navbar.tsx` | Mobile navbar logo | `Logo.png` |
| `components/layout/Navbar.tsx` | Desktop navbar logo | `Logo.png` |

`Logo.png` dimensions: **2480×2480px** (square, transparent background, cream calligraphic bowl outline).

---

## 78. Navbar — Desktop Logo Size + Spacing (`components/layout/Navbar.tsx`)

| Element | Before | After |
|---------|--------|-------|
| Desktop logo height | `h-16` (64px) | `h-14` (56px) |
| Text gap (desktop) | `-ml-2` (overlap) | `ml-2` (8px gap) |

---

## 79. Navbar — Mobile Text Size + Spacing (`components/layout/Navbar.tsx`)

| Element | Before | After |
|---------|--------|-------|
| "Traam and Beyond" text (mobile) | `text-2xl` (24px) | `text-[23px]` |
| Text gap (mobile) | `-ml-2` (overlap) | `ml-1` (4px gap) |

Desktop text remains `text-2xl`. The class is now `text-[23px] lg:text-2xl ... ml-1 lg:ml-2`.

---

## 80. HeroSection — Desktop Logo Size Increase (`components/home/HeroSection.tsx`)

The desktop hero logo (inside `hidden lg:block` wrapper) was increased:

| | Before | After |
|--|--------|-------|
| Mobile breakpoint | `h-48` (192px) | `h-56` (224px) |
| sm breakpoint | `h-60` (240px) | `h-72` (288px) |

Both the start (scale 0.7) and end (scale 1.0) sizes grow proportionally since the whole text wrapper scales together.

---

## 81. HeroSection — Mobile Logo Animation Tuning (`components/home/HeroSection.tsx`)

Extensive iterative tuning of the mobile logo to align it with the copper bowl background image at full scroll. The goal was to have `Logo.png`'s bowl outline trace the physical bowl in `hero-vessel.png` at the end state.

### Base size
| Step | Value | End pixel size |
|------|-------|---------------|
| Start | `h-48` (192px) | 864px (scale 4.5) |
| Reduced | `h-40` (160px) | **160px base** (final) |

### End scale (end pixel size) — iterations
| Scale | End size |
|-------|----------|
| 4.5 | 864px |
| 4.375 | 700px |
| 4.0625 | 650px |
| 3.75 | 600px |
| 3.5625 | 570px |
| 3.4375 | 550px |
| 3.375 | 540px |
| 3.53125 | 565px |
| 3.5125 | 562px |
| 3.5 | 560px |
| **3.53125** | **565px** ← final |

### End Y position — iterations
| Value | Direction |
|-------|-----------|
| `-17vh` | original |
| `-13vh` | moved down 4vh |
| `-15vh` | moved up 2vh |
| `-15.25vh` | fine-tuned |
| `-15.20vh` | fine-tuned |
| `-15.10vh` | **final** |

### Start Y position — iterations
| Value | Direction |
|-------|-----------|
| `-38vh` | original |
| `-37vh` | moved down 1vh |
| **`-36vh`** | **final** |

### Temporary opacity removal (alignment aid)
Bowl opacity animation was temporarily set to `opacity: 1` (fixed) during alignment work, then restored to `opacity: bowlOpacityMobile` (fades to 0.4 at full scroll).

### Final mobile logo animation values
```ts
const logoScaleMobile = useTransform(scrollYProgress, [0, 0.7], [1, 3.53125]);
// Base h-40 (160px) × 3.53125 = 565px at full scroll

const logoYMobile = useTransform(scrollYProgress, [0, 0.7], ["-36vh", "-15.10vh"]);
// Starts ~288px above center; ends ~121px above center
```

---

## 82. README — Demo Video + Live Site + New Sections (`README.md`)

### Demo video replaced
Old video URL (HEVC codec, failed GitHub upload) replaced with a VLC-converted H.264 MP4:
```
Old: https://github.com/user-attachments/assets/f8299bab-1646-4b75-8832-a3d9e1dbbf36
New: https://github.com/user-attachments/assets/041271cf-5477-422e-aadd-73d9a112167e
```
Source file: `Screenshots for github/DemoVideoTraamAndBeyond.mp4` (22.8 MB, H.264).

### Live site link added
```markdown
**Live site:** [traam-and-beyond-website.vercel.app](https://traam-and-beyond-website.vercel.app/)
```

### Screenshots replaced
| Section | Old file | New file |
|---------|----------|----------|
| Home Page — Our Story | `HomePageOurStorySection.jpeg` | `HomePageOurStorySection1.jpeg` |
| Home Page — Our Collections (intro) | `HomePageOurCollectionIntro.jpeg` | `HomePageOurCollectionIntro1.jpeg` |
| Home Page — Our Collections (list) | `HomePageOurCollectionList.jpeg` | `HomePageOurCollectionList1.jpeg` |

### New sections added (14 → 17 total)

| New section | Screenshot | Placement |
|-------------|------------|-----------|
| 3. Navigation Menu | `NavigationMenu.jpeg` | After Hero Section |
| 5. Home Page — Featured Panel | `FeaturedPannel.jpeg` | After Our Story |
| 7. Home Page — Research | `ResearchPannel.jpeg` | After Our Collections |

All subsequent sections renumbered (5→8 through 14→17). Project structure in section 15 updated to include `collections/page.tsx`, `FeaturedSection.tsx`, `ResearchHighlights.tsx`, `category-descriptions.ts`.

---

## 83. Key Files Modified (Fifteenth Build)

| File | Change type |
|------|-------------|
| `components/home/HeroSection.tsx` | `LOGO.png`/`LogoNew.png` → `Logo.png` (all 2 instances); desktop logo `h-48 sm:h-60` → `h-56 sm:h-72`; mobile base `h-48` → `h-40`; `logoScaleMobile` end `4.5` → `3.53125`; `logoYMobile` start `-38vh` → `-36vh`, end `-17vh` → `-15.10vh` |
| `components/layout/Navbar.tsx` | `LOGO.png`/`LogoNew.png` → `Logo.png` (all 2 instances); desktop logo `h-16` → `h-14`; desktop gap `-ml-2` → `ml-2`; mobile text `text-2xl` → `text-[23px]`; mobile gap `-ml-2` → `ml-1` |
| `README.md` | New demo video URL; live site link; 3 new sections; 3 screenshot replacements; TOC renumbered to 17 items; project structure updated |

---

# Sixteenth Build Session — Addendum

**Date:** 2026-05-30
**Scope:** Research section description update, Navbar layout overhaul (text removed, centered desktop, mobile back-button layout), research pages fully populated (static data architecture, ResearchItemCard, 3 section pages, 3 item detail pages, research landing page restructure)

---

## 84. ResearchHighlights — Description Text Updated (`components/home/ResearchHighlights.tsx`)

The placeholder subtitle text was replaced with the final copy:

**Before:**
> An ongoing exploration into the living relevance of Kashmiri craft traditions. These research projects examine how heritage forms can evolve, be recontextualised, and find new expression in contemporary practice — bridging the historical with the speculative.

**After:**
> An ongoing exploration into the living relevance of Kashmiri craft and building traditions. These projects investigate how heritage forms, materials, and visual languages can evolve, be recontextualised and find new expression in contemporary contexts. Through design-led inquiry, they create new narratives that connect cultural memory with present day design practices, ensuring that traditional knowledge remains meaningful, relevant, and capable of evolving into the future.

---

## 85. Navbar — Full Layout Overhaul (`components/layout/Navbar.tsx`)

### "Traam and Beyond" text removed
The `<span>` containing the site name was removed entirely. The logo image is now the only brand element in the navbar.

### Desktop layout — centered
The `<nav>` inner layout changed from `justify-between` (logo-left, controls-right) to `justify-center` with a single flex row containing all three elements:

```
Search icon  →  Logo  →  Menu button
```

`gap-5` between elements. `ChevronLeft` icon imported from lucide-react for use on mobile.

### Mobile layout — left logo, right controls, back button
The navbar now renders two completely separate DOM trees gated by `lg:hidden` / `hidden lg:flex`:

**Mobile (`lg:hidden`):**
- Left group: `[Back button]  [Logo]`
  - Back button uses `router.back()`, only visible when `pathname !== "/"`
  - Icon: `ChevronLeft size={24}`
  - Logo: `h-16` (64px)
- Right group: `[Search]  [Menu]`

**Desktop (`hidden lg:flex`, centered):**
- `[Search]  [Logo]  [Menu]`
- Logo: `h-18`
- Unchanged from centered layout established above

### Logo size iterations (mobile)

| Step | Value | Notes |
|------|-------|-------|
| After text removal | `h-20` (80px) | initial increase |
| Reduced | `h-[68px]` | "h-17" equivalent |
| Final | `h-16` (64px) | standard Tailwind step |

### Why two separate DOM trees
Mobile and desktop have fundamentally different element ordering and grouping (back+logo left vs search+menu right on mobile; linear centered row on desktop). Using a single DOM tree with responsive classes would require complex reordering — two separate `div`s with `lg:hidden` / `hidden lg:flex` is cleaner and avoids layout conflicts.

---

## 86. Research Pages — Static Data Architecture (new)

All research content is static (not Firestore). A new data module was introduced to centralise it.

### `lib/research-data.ts` (new file)

Exports two interfaces and one constant:

```ts
interface ResearchItem {
  slug: string;
  title: string;
  description: string;
  images: string[]; // [0] = cover, rest = detail gallery
}

interface ResearchSection {
  sectionSlug: string;
  title: string;
  description: string;
  items: ResearchItem[];
}

const RESEARCH_SECTIONS: ResearchSection[]
```

Also exports helper functions `getResearchSection(slug)` and `getResearchItem(sectionSlug, itemSlug)`.

### Content

| Section | `sectionSlug` | Item | `slug` | Images |
|---------|--------------|------|--------|--------|
| Adaptive Reuse | `adaptive-reuse` | Console | `console` | `AR2A.jpeg`, `AR2B.jpeg`, `AR2C.jpeg` |
| Reinterpretation | `reinterpretation` | Warusi Wardrobe | `warusi-wardrobe` | `RE1A.jpeg`, `RE1B.jpeg`, `RE1C.jpeg`, `RE1D.jpeg` |
| Graphic Design | `graphic-design` | Office Mugs | `office-mugs` | `GD1A.jpeg`, `GD1B.jpeg` |

All images are in `public/Research/` (capital R — Vercel case-sensitive).

Office Mugs description is intentionally blank (placeholder).

---

## 87. ResearchItemCard — New Component (`components/items/ResearchItemCard.tsx`)

A purpose-built card for research item listings. Mirrors `ItemCard` layout but omits all commerce elements.

### What's removed vs ItemCard
- No `EnquiryDialog` import or usage
- No price / `Badge` / `formatPrice`
- No "Enquire" button
- No Kashmiri title field (research items don't have one)

### What's kept
- Mobile: full-width `aspect-square` image + title + description below (`line-clamp-3`)
- Desktop: alternating 35/65 split — image (35%) and text panel (65%, `bg-walnut`) switching sides on odd indices
- Desktop description: `line-clamp-4`
- Same `cardVariants` / `childVariants` stagger animation as `ItemCard`
- `group-hover:scale-105` image zoom (700ms)
- Description conditionally rendered — no empty `<p>` when blank

### Link target
`href="/research/${sectionSlug}/${item.slug}"` — navigates to the item detail page.

---

## 88. Research Section Pages — Populated (3 files updated)

All three section listing pages were rewritten from placeholder "Coming soon." to full content pages matching the `category/[slug]/page.tsx` structure.

### Structure (all three identical in pattern)
```tsx
<div pt-24 pb-12 max-w-7xl>
  <div mb-10>
    <h1 font-display text-3xl lg:text-6xl text-cream>{section.title}</h1>
    <p text-stone text-justify>{section.description}</p>
    <border-t border-white/10 />
  </div>
  <div flex flex-col>
    {section.items.map((item, index) => (
      <ResearchItemCard sectionSlug="..." />
    ))}
  </div>
</div>
```

Data sourced from `getResearchSection()` in `lib/research-data.ts` — non-null asserted (`!`) since slugs are hardcoded.

| File | Section |
|------|---------|
| `app/(public)/research/adaptive-reuse/page.tsx` | Adaptive Reuse |
| `app/(public)/research/reinterpretation/page.tsx` | Reinterpretation |
| `app/(public)/research/graphic-design/page.tsx` | Graphic Design |

---

## 89. Research Item Detail Pages — New (3 new routes)

Three new dynamic routes created, one per section:

| Route | File |
|-------|------|
| `/research/adaptive-reuse/[slug]` | `app/(public)/research/adaptive-reuse/[slug]/page.tsx` |
| `/research/reinterpretation/[slug]` | `app/(public)/research/reinterpretation/[slug]/page.tsx` |
| `/research/graphic-design/[slug]` | `app/(public)/research/graphic-design/[slug]/page.tsx` |

### Structure (all three identical in pattern)
Mirrors `category/[slug]/[itemId]/page.tsx` but removes all commerce elements:

```
Breadcrumb: Home > Research > [Section] > [Item Title]

2-column grid (1-col mobile):
  Left: ItemImageGallery (reused — supports thumbnails + lightbox)
  Right: h1 title + description paragraph
```

**Removed vs item detail page:**
- No `Badge` (category label)
- No price display
- No dimensions
- No `EnquiryForm` panel

**Breadcrumb links:**
- Home → `/`
- Research → `/research`
- Section name → `/research/[sectionSlug]`
- Item title (non-linked span)

`notFound()` called if `getResearchItem()` returns `undefined`.

`generateMetadata` also provided per page.

---

## 90. Research Landing Page — Restructured (`app/(public)/research/page.tsx`)

The previous placeholder page (a vertical list of 3 linked areas with short descriptions) was replaced with a full collections-style page.

### New structure (mirrors `app/(public)/collections/page.tsx`)

```
max-w-7xl container, pt-24 pb-12

Page header:
  h1: "Research"
  p: [home page description — same text as ResearchHighlights subtitle]
  border-t border-white/10

{RESEARCH_SECTIONS.map(section =>
  <section mb-24>
    <Link href="/research/[sectionSlug]">
      <h2 font-display text-3xl lg:text-5xl text-cream hover:text-terracotta>
        {section.title}
      </h2>
    </Link>
    <p>{section.description}</p>
    <border-t border-white/10 />

    <div flex flex-col>
      {section.items.map((item, i) =>
        <ResearchItemCard sectionSlug={...} index={i} />
      )}
    </div>
  </section>
)}
```

Section headings link to the individual section pages (e.g. `/research/adaptive-reuse`). Items link to their detail pages via `ResearchItemCard`. The `bg-[#1a130a] min-h-screen` wrapper and `ScrollReveal` from the old page were removed — the global dark background from the layout handles it.

---

## 91. Key Files Modified (Sixteenth Build)

| File | Change type |
|------|-------------|
| `components/home/ResearchHighlights.tsx` | Description text replaced with final copy |
| `components/layout/Navbar.tsx` | "Traam and Beyond" `<span>` removed; desktop → centered single row (search → logo → menu); mobile → two-group layout (back+logo left, search+menu right); `ChevronLeft` added; mobile logo `h-20` → `h-[68px]` → `h-16` |
| `lib/research-data.ts` | **New file** — `ResearchItem` + `ResearchSection` interfaces; `RESEARCH_SECTIONS` constant with all 3 sections + items; `getResearchSection()` + `getResearchItem()` helpers |
| `components/items/ResearchItemCard.tsx` | **New file** — ItemCard layout without enquiry/price/badge; links to `/research/[sectionSlug]/[slug]` |
| `app/(public)/research/adaptive-reuse/page.tsx` | Rewritten — title + description + ResearchItemCard list |
| `app/(public)/research/reinterpretation/page.tsx` | Rewritten — title + description + ResearchItemCard list |
| `app/(public)/research/graphic-design/page.tsx` | Rewritten — title + description + ResearchItemCard list |
| `app/(public)/research/adaptive-reuse/[slug]/page.tsx` | **New file** — item detail page (gallery + title + description, no enquiry) |
| `app/(public)/research/reinterpretation/[slug]/page.tsx` | **New file** — item detail page |
| `app/(public)/research/graphic-design/[slug]/page.tsx` | **New file** — item detail page |
| `app/(public)/research/page.tsx` | Full rewrite — collections-style layout; Research h1 + description; 3 sections each with h2 link + description + ResearchItemCard items |

---

# Seventeenth Build Session — Addendum

**Date:** 2026-05-31
**Scope:** ResearchItemCard mobile description + title centering, home page enquiry heading removed, footer text + links overhaul, research data content additions (Coffee Table, Invitation Card, Wardrobe image swap), hero section background image swap, mobile hero animation tuning (bowl + logo), about page title sizes + spacing fixes

---

## 92. ResearchItemCard — Mobile Description Hidden + Title Centered (`components/items/ResearchItemCard.tsx`)

On mobile only:
- Description `<p>` removed from the mobile card variant — only image and title shown
- Title wrapper `<motion.div>` changed from default alignment to `text-center`

Desktop (65% text panel) is unchanged — description still shows with `line-clamp-4`.

---

## 93. Home Page — "Get in Touch" Heading Removed (`components/home/HomePageClient.tsx`)

The `<h2>` containing `{content.enquiry.title}` ("Get in Touch") was removed from the General Enquiry section. The subtitle `<p>` and `<EnquiryForm>` remain.

---

## 94. Footer — Text + Links Overhaul (`components/layout/Footer.tsx`)

### Tagline text replaced
| Before | After |
|--------|-------|
| "Curated Kashmiri handcrafted items — copper, silver, jade, papier-mâché, and more." | Two lines: "Silenced crafts, Speaking again" (line 1) + "Timeless Kashmiri Treasures Curated by Hakim Ali Reza" (line 2, `whitespace-nowrap`) |

### Navigation links — 6 links in 2 columns
The single "Explore" column (About + Contact) was replaced with two columns:

| Column 1 | Column 2 |
|----------|----------|
| About → `/about` | Stories → `/stories` |
| Our Collections → `/collections` | Buy from Artisans → `/buy-from-artisans` |
| Research → `/research` | Contact → `/contact` |

"Explore" heading removed. Both columns wrapped in `flex gap-12`.

---

## 95. Research Data — Content Additions (`lib/research-data.ts`)

### Coffee Table added (Adaptive Reuse, first item)
```
slug: "coffee-table"
images: ["/Research/AR1A.jpeg", "/Research/AR1B.jpeg"]
```
Placed before "Console" so it appears first in listing order.

### Warusi Wardrobe — images replaced (Reinterpretation)
Old: `RE1A.jpeg`, `RE1B.jpeg`, `RE1C.jpeg`, `RE1D.jpeg`
New: `Wardrobe1.jpeg`, `Wardrobe2.jpeg`, `Wardrobe3.jpeg`, `Wardrobe4.jpeg`

### Invitation Card added (Graphic Design, second item)
```
slug: "invitation"
title: "Invitation Card"
description: ""
images: ["/Research/GD2.jpeg"]
```

---

## 96. Hero Section — Background Image Swap + Mobile Animation Tuning (`components/home/HeroSection.tsx`)

### Background image
`/hero-vessel.png` → `/newherobackground.png` (both mobile and desktop instances).

### Mobile bowl animation — final values

| Parameter | Previous | Final |
|-----------|----------|-------|
| `bowlScaleMobile` end | `0.95` | `0.910` (≈355px on 390px viewport) |
| `bowlYMobile` end | `-20vh` | `-18vh` |

### Mobile logo animation — final values after iterative tuning

| Parameter | Previous | Final |
|-----------|----------|-------|
| `logoScaleMobile` end | `3.53125` (565px) | `3.40625` (545px) |
| `logoYMobile` end | `-15.10vh` | `-15.25vh` |
| `logoXMobile` (x style) | `"0vw"` | `"1.25vw"` (right of center) |

The `x` value was introduced as an explicit tweakable value (previously centered via flex only). It applies uniformly across the full scroll range (static, not animated).

### X offset implementation
`justify-center` flex centering was kept on the container. The `x: "1.25vw"` framer-motion style shifts the entire `inset-0` container right, effectively offsetting the centered logo.

---

## 97. About Page — Title Sizes + Spacing Fixes

### "Our Story" + "Craft Heritage of Kashmir" — mobile font size
Both reduced from `text-5xl` → `text-3xl` on mobile (matching collections/category page heading size):
- `components/about/OurStoryTimeline.tsx`
- `components/about/CraftHeritageTimeline.tsx`

Desktop (`sm:text-6xl`) unchanged.

### OurStoryTimeline — first panel top padding reduced
`index === 0` panel: `pt-28` → `pt-8` (mobile), `lg:pt-40` → `lg:pt-12` (desktop). Closes the gap between "Our Story" title and "February 2004". Image-swap logic unaffected (tied to `useInView` ref on outer div).

### OurStoryTimeline — last panel bottom padding removed
`isLast` prop added to `TextBlock`. Last panel (`index === 4`): `pb-28` → `pb-0`. Closes excess space above the "Craft Heritage of Kashmir" separator.

### CraftHeritageTimeline — horizontal separator added above title
`<div className="max-w-2xl mx-auto border-t border-white/10 mb-10" />` added before the h2. Uses same `border-white/10` style as all other separators in the timeline.

### CraftHeritageTimeline — title div top padding reduced
`pt-24` → `pt-10` so space above separator = `mb-10` (40px) = space below separator (40px). Symmetric spacing.

### CraftHeritageTimeline — first panel top padding + spacer reduced
`index === 0` panel: `pt-10` → `pt-4`; top `flex-1 min-h-20` spacer → `h-4` (fixed 16px). Closes gap between "Craft Heritage of Kashmir" title and first paragraph text. Other panels and image-change logic unaffected.

---

## 98. Key Files Modified (Seventeenth Build)

| File | Change type |
|------|-------------|
| `components/items/ResearchItemCard.tsx` | Mobile description removed; mobile title `text-center` added |
| `components/home/HomePageClient.tsx` | "Get in Touch" `<h2>` removed from enquiry section |
| `components/layout/Footer.tsx` | Tagline replaced with 2-line text; nav replaced with 6-link two-column layout; "Explore" heading removed |
| `lib/research-data.ts` | Coffee Table added (Adaptive Reuse, first); Wardrobe images replaced; Invitation Card added (Graphic Design) |
| `components/home/HeroSection.tsx` | Background → `newherobackground.png`; `bowlScaleMobile` end `0.95` → `0.910`; `bowlYMobile` end `-20vh` → `-18vh`; `logoScaleMobile` end → `3.40625` (545px); `logoYMobile` end → `-15.25vh`; `x: "1.25vw"` added to logo motion style |
| `components/about/OurStoryTimeline.tsx` | Title `text-5xl` → `text-3xl` mobile; first panel `pt-8`; last panel `pb-0` via `isLast` prop |
| `components/about/CraftHeritageTimeline.tsx` | Title `text-5xl` → `text-3xl` mobile; separator added above title; title div `pt-24` → `pt-10`; first panel `pt-4` + `h-4` top spacer |

---

# Eighteenth Build Session — Addendum

**Date:** 2026-06-01
**Scope:** Kashmiri category names, font swap (Cormorant Garant → Cormorant Garamond), hero gradient + bowl direction flip + mobile logo tuning, contact page cleanup, research page header removal

---

## 99. CategoryHighlights — Kashmiri Names (`components/home/CategoryHighlights.tsx`)

The `URDU_NAMES` map was replaced with `KASHMIRI_NAMES` containing authentic Kashmiri script names for all 13 categories. `lang="ur"` changed to `lang="ks"` (ISO 639-1 for Kashmiri).

```tsx
const KASHMIRI_NAMES: Record<string, string> = {
  "copperware":        "ترٛام",
  "papier-mch":        "نقاشی",
  "silverware":        "رۄپھ",
  "enamelware":        "میناکاری",
  "terracotta":        "کَتٕر",
  "green-serpentine":  "زہر مۄہر",
  "coins":             "سِکہ جات",
  "shawls":            "شال",
  "jewellery":         "زیور",
  "carpets":           "قالین",
  "willow-wicker":     "کانہِ کٮ۪م",
  "wood-work":         "لٮ۪کَرِ کٮ۪م",
  "brass-ware":        "سَرٛتَل",
};
```

`dir="rtl"` retained (Kashmiri Nastaliq is also RTL).

### Font size tuning log

| Step | Mobile | Desktop |
|------|--------|---------|
| Initial (Urdu) | `text-[24px]` | `text-[26px]` |
| +6pt | `text-[30px]` | `text-[32px]` |
| +2pt | `text-[32px]` | `text-[34px]` |
| Mobile back | `text-[30px]` | `text-[34px]` |
| Final | `text-[27px]` | `text-[34px]` |

---

## 100. Font Swap — Cormorant Garant → Cormorant Garamond (`app/layout.tsx`)

All `font-display` elements site-wide now use **Cormorant Garamond** instead of Cormorant Garant. Both are variants of the Cormorant family by Christian Thalmann; Garamond has a more classical Garamond-inspired structure.

Change was a single-file update — the CSS variable `--font-cormorant` and all component `font-display` classes required no changes.

```ts
// Before
import { Cormorant, Raleway } from "next/font/google";
const cormorantGarant = Cormorant({ ... variable: "--font-cormorant" });

// After
import { Cormorant_Garamond, Raleway } from "next/font/google";
const cormorantGaramond = Cormorant_Garamond({ ... variable: "--font-cormorant" });
```

---

## 101. HeroSection — Gradient Direction + Bowl Side Flip (`components/home/HeroSection.tsx`)

### Gradient reversed
`bg-gradient-to-r` → `bg-gradient-to-l`: dark side now on the left, light side on the right.

### Gradient lightened
`to-black` → `to-black/70`: left side reduced from full black to 70% opacity, brightening the bowl on both mobile and desktop.

### Desktop bowl moved to right side
Bowl container repositioned from left to right. Three changes:

| Property | Before | After |
|----------|--------|-------|
| Container anchor | `left-0` | `right-0` |
| `bowlX` animation | `["26vw", "0vw"]` | `["-26vw", "0vw"]` |
| Object position | `object-left-bottom` | `object-right-bottom` |

Bowl now starts from center (shifted `-26vw` left) and drifts to the right edge as scroll progresses.

---

## 102. HeroSection — Mobile Logo Animation Final Values (`components/home/HeroSection.tsx`)

Extensive iterative tuning session. Final values:

| Parameter | Previous | Final |
|-----------|----------|-------|
| `logoScaleMobile` end | `3.40625` (545px) | `3.43125` (549px) |
| `logoYMobile` end | `-15.25vh` | `-15.40vh` |
| `x` (static offset) | `1.25vw` | `2.28vw` |

Base size remains `h-40` (160px). 549px = 160 × 3.43125.

---

## 103. Contact Page Cleanup (`app/(public)/contact/page.tsx`)

| Change | Before | After |
|--------|--------|-------|
| "Get in Touch" h1 | Present | Removed |
| Subtext | "Whether you have a question…" | "Have a question or want to know more? We'd love to hear from you." |
| Email widget | Present | Removed |
| "Based in" widget | Present | Removed |
| `Mail`, `MapPin` imports | Present | Removed |
| Paragraph top spacing | none | `mt-24` |
| Info box position | top of right column | `mt-auto` (bottom of right column) |

---

## 104. Research Page — Header Removed (`app/(public)/research/page.tsx`)

The "Research" `<h1>` title and full description paragraph were removed. The page now opens directly with the Adaptive Reuse section (first entry in `RESEARCH_SECTIONS`).

---

## 105. Key Files Modified (Eighteenth Build)

| File | Change type |
|------|-------------|
| `components/home/CategoryHighlights.tsx` | `URDU_NAMES` → `KASHMIRI_NAMES` with correct Kashmiri script; `lang="ur"` → `lang="ks"`; font size `27px` mobile / `34px` desktop |
| `app/layout.tsx` | `Cormorant` → `Cormorant_Garamond` import; `cormorantGarant` → `cormorantGaramond` variable |
| `components/home/HeroSection.tsx` | Gradient `to-r` → `to-l`; `to-black` → `to-black/70`; desktop bowl `left-0` → `right-0`, `bowlX` `["26vw","0vw"]` → `["-26vw","0vw"]`, `object-left-bottom` → `object-right-bottom`; mobile logo scale end `3.43125` (549px); `logoYMobile` end `-15.40vh`; `x` offset `2.28vw` |
| `app/(public)/contact/page.tsx` | h1 removed; subtext replaced; Email + Based In widgets removed; `mt-24` on paragraph; `mt-auto` on info box |
| `app/(public)/research/page.tsx` | "Research" h1 and description paragraph removed; page starts directly from sections |

---

# Nineteenth Build Session — Addendum

**Date:** 2026-06-02
**Scope:** Page title size standardisation (Stories, Buy from Artisans), Our Story first image swap, developer credit in footer, new `/developer` page

---

## 106. Title Size Standardisation (`app/(public)/stories/page.tsx`, `app/(public)/buy-from-artisans/page.tsx`)

Both page h1 titles were reduced to match the `text-3xl sm:text-6xl` sizing used by "Our Story" and "Craft Heritage of Kashmir" on the About page.

| File | Before | After |
|------|--------|-------|
| `stories/page.tsx` | `text-6xl sm:text-7xl` | `text-3xl sm:text-6xl` |
| `buy-from-artisans/page.tsx` | `text-6xl sm:text-7xl` | `text-3xl sm:text-6xl` |

---

## 107. OurStoryTimeline — First Panel Image Swap (`components/about/OurStoryTimeline.tsx`)

The February 2004 panel image was replaced:

| Before | After |
|--------|-------|
| `/aboutImages/story-1.jpg` | `/Story1b.jpg` |

---

## 108. Footer — Developer Credit Line (`components/layout/Footer.tsx`)

A developer credit line was added below the copyright line. The entire line is a clickable link to `/developer`.

```tsx
// Before
© {new Date().getFullYear()} Traam and Beyond. All rights reserved.

// After
© {new Date().getFullYear()} Traam and Beyond. All rights reserved.
<Link href="/developer">Developed by Hakim Iisa · Co-Founder - SEER</Link>
```

---

## 109. Developer Page — New (`app/(public)/developer/page.tsx`)

New page at `/developer` with professional profile layout.

### Content
- **Profile photo**: `/DeveloperImage.jpeg`, circular frame (`rounded-full overflow-hidden`), `w-56 h-56 sm:w-80 sm:h-80`
- **Name**: `font-display text-3xl sm:text-5xl text-cream` — "Hakim Iisa"
- **Designation**: `text-terracotta text-sm tracking-widest uppercase` — "Co-Founder — SEER"
- **Sub-label**: `text-stone text-sm` — "Developer · Traam and Beyond"
- Text block has `sm:pt-10` to align it below the image top edge on desktop

### Contact links
Three links with inline SVG icons (lucide-react has no LinkedIn/Instagram in this version):

| Link | Icon | URL |
|------|------|-----|
| Email | `Mail` (lucide) | `hakimohdiisa@gmail.com` |
| LinkedIn | Inline SVG | `linkedin.com/in/mohammad-iisa-hakim-099863362` |
| Instagram | Inline SVG | `instagram.com/hakim_essa` |

All icons use `text-terracotta`. Link text uses `text-stone` → `text-cream` on hover.

---

## 110. Key Files Modified (Nineteenth Build)

| File | Change type |
|------|-------------|
| `app/(public)/stories/page.tsx` | h1 `text-6xl sm:text-7xl` → `text-3xl sm:text-6xl` |
| `app/(public)/buy-from-artisans/page.tsx` | h1 `text-6xl sm:text-7xl` → `text-3xl sm:text-6xl` |
| `components/about/OurStoryTimeline.tsx` | First panel image `/aboutImages/story-1.jpg` → `/Story1b.jpg` |
| `components/layout/Footer.tsx` | Developer credit line added below copyright; full line links to `/developer` |
| `app/(public)/developer/page.tsx` | **New file** — profile image, name, designation, email + LinkedIn + Instagram links |

---

# Twentieth Build Session — Addendum

**Date:** 2026-06-02
**Scope:** Developer page designation update, footer name font/size, second Instagram link added

---

## 111. Developer Page — Designation Update (`app/(public)/developer/page.tsx`)

- "Co-Founder — SEER" → **"Director — SEER"**

---

## 112. Footer — "Hakim Iisa" Font + Size (`components/layout/Footer.tsx`)

The name "Hakim Iisa" in the developer credit line was given a distinct typographic treatment:
- `font-display` (Cormorant Garamond) applied to name only via `<span>`
- `text-base` (16px) vs surrounding `text-xs` (12px)

```tsx
Developed by <span className="font-display text-base">Hakim Iisa</span> · Director - SEER
```

---

## 113. Developer Page — Second Instagram Link (`app/(public)/developer/page.tsx`)

Added `@seerarchitects` Instagram link directly below `@hakim_essa`:

| Handle | URL |
|--------|-----|
| `@hakim_essa` | `instagram.com/hakim_essa` |
| `@seerarchitects` | `instagram.com/seerarchitects/` |

Same inline SVG icon and hover styling as the first Instagram link.

---

## 114. Key Files Modified (Twentieth Build)

| File | Change type |
|------|-------------|
| `app/(public)/developer/page.tsx` | Designation → "Director — SEER"; `@seerarchitects` Instagram link added |
| `components/layout/Footer.tsx` | "Hakim Iisa" wrapped in `<span className="font-display text-base">` |

---

# Twenty-First Build Session — Addendum

**Date:** 2026-06-02 / 2026-06-03
**Scope:** Security hardening (5 measures), admin enquiries fix, item reorder feature, navbar/about rename, footer credit update, developer page additions, public deployment to traamandbeyond.com, Google Search Console + sitemap

---

## 115. Security Hardening (5 measures)

### 1. Server-side admin middleware (`middleware.ts` — new file)
- Sets `admin-session=1` cookie on login (via `AdminAuthContext`) and clears it on logout
- `onAuthStateChanged` refreshes the cookie on every page load
- `middleware.ts` intercepts all `/admin/*` routes — redirects to `/login?from=...` if cookie absent
- Matcher: `["/admin/:path*"]`

### 2. Admin email check in `verifyAdminRequest` (`lib/admin-auth.ts`)
- Added `decoded.email !== ADMIN_EMAIL` check using `OWNER_EMAIL` env var
- **Reverted** in the same session after blocking the client's Firebase account — removed to allow all valid Firebase tokens

### 3. Rate limiting on enquiry endpoint (`app/api/enquiry/route.ts`)
- In-memory `Map` tracks submissions per IP
- Limit: 5 per hour per IP (`RATE_LIMIT = 5`, `WINDOW_MS = 3600000`)
- Returns `429` with "Too many requests" message when exceeded
- IP extracted from `x-forwarded-for` header, falls back to `"unknown"`

### 4. Security headers (`next.config.ts`)
Applied to all routes via `async headers()`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 5. Firestore security rules (Firebase Console)
Added catch-all deny rule to existing rules:
```
match /{document=**} {
  allow read, write: if false;
}
```
Protects any future collections not explicitly listed.

---

## 116. Admin Enquiries — Caching + Tab Colour Fix

### `force-dynamic` on enquiries page (`app/(admin)/admin/enquiries/page.tsx`)
Page was served from Next.js cache — new enquiries not appearing until cold reload. Fixed with `export const dynamic = "force-dynamic"`.

**Root cause:** Next.js Full Route Cache was serving a stale page. Firebase Admin SDK calls don't use `fetch`, so the Data Cache doesn't apply, but the Route Cache does.

### Tab colour fix (`app/(admin)/admin/enquiries/EnquiriesClient.tsx`)
Active/inactive tab styling conflicted — inactive tabs appeared dark. Fixed by adding `text-stone data-[state=inactive]:text-stone` to both `TabsTrigger` elements.

---

## 117. Item Reorder Feature (drag-and-drop per category)

### Data model
- `order?: number` added to `Item` interface (`types/index.ts`)
- `serialize()` in `lib/firebase/items.ts` and `lib/firebase/admin-items.ts` both map `data.order`
- `adminReorderItems()` added to `admin-items.ts` — Firestore batch write

### Public sort logic (`lib/firebase/items.ts`)
Client-side sort after Firestore fetch:
- Items with `order` set sort by `order` ascending
- Items without `order` (new additions) float to the **top** (appear first)
- Within unordered items, `createdAt desc` order from Firestore is preserved

### API endpoint — `POST /api/admin/items/reorder`
Accepts `{ items: Array<{ id: string, order: number }> }`, validates with Zod, batch-updates all items.

### Admin reorder page — `/admin/items/reorder`
- `ReorderClient.tsx` — `@dnd-kit/core` + `@dnd-kit/sortable` drag-and-drop
- Category tabs at top (only shows categories with items)
- Each item row: grip handle icon, thumbnail, title
- "Save Order" button — green tick on success, "Saving…" spinner during save
- On drag end: `arrayMove` updates local state; on save: POST to API with index-based order values

### Admin items page (`app/(admin)/admin/items/page.tsx`)
"Reorder Items" button (with `ArrowUpDown` icon) added next to "Add Item".

### Library installed
`@dnd-kit/core@6.3.1`, `@dnd-kit/sortable@10.0.0`, `@dnd-kit/utilities`

---

## 118. Navbar + About Page — Section Rename

| Location | Before | After |
|----------|--------|-------|
| Navbar hamburger menu (under About) | "Our Story" | "From Trām to Beyond" |
| About page section h2 (`OurStoryTimeline.tsx`) | "Our Story" | "From Trām to Beyond" |

Navigation href `/about#introduction` unchanged.

---

## 119. Footer — Developer Credit Update (`components/layout/Footer.tsx`)

Added "Know more." with persistent underline after the developer credit. Entire line remains one clickable link to `/developer`:
```tsx
Developed by <span className="font-display text-base">Hakim Iisa</span> · Director - SEER. <span className="underline underline-offset-2">Know more.</span>
```

---

## 120. Public Deployment — traamandbeyond.com

### Domain
- Purchased `traamandbeyond.com` on GoDaddy
- Privacy protection included free

### DNS configuration (GoDaddy)
| Type | Name | Value |
|------|------|-------|
| A | @ | 216.198.79.1 (Vercel) |
| CNAME | www | cname.vercel-dns.com |

Deleted conflicting GoDaddy default records: `A @ → WebsiteBuilder Site`, `CNAME www → traamandbeyond.com.`

### Vercel
- Domain added to `traam-and-beyond-website` project
- SSL certificate auto-provisioned
- Both `traamandbeyond.com` and `www.traamandbeyond.com` show "Valid Configuration"

### Firebase Auth
- `traamandbeyond.com` and `www.traamandbeyond.com` added to Authorised Domains

### Google Search Console
- Property verified via GoDaddy DNS auto-verification
- Sitemap submitted: `sitemap.xml`
- **66 pages discovered** and processed successfully

---

## 121. Sitemap + SEO (`app/sitemap.ts` — new file, `app/layout.tsx`)

### `app/sitemap.ts`
Dynamic sitemap using Next.js `MetadataRoute.Sitemap`. Fetches all categories and items from Firestore at build/request time. Includes:
- Static routes (home, about, collections, research, contact)
- All category pages (`/category/[slug]`)
- All item detail pages (`/category/[slug]/[id]`)
- Falls back to static routes only if Firestore fetch fails

### `app/layout.tsx`
Added `metadataBase: new URL("https://traamandbeyond.com")` to global metadata — required for Next.js to resolve relative Open Graph URLs correctly.

---

## 122. Key Files Modified (Twenty-First Build)

| File | Change type |
|------|-------------|
| `middleware.ts` | **New file** — server-side admin route protection via session cookie |
| `context/AdminAuthContext.tsx` | Sets/clears `admin-session` cookie on login/logout/auth state change |
| `lib/admin-auth.ts` | Email check added then reverted; final state = token verification only |
| `app/api/enquiry/route.ts` | In-memory rate limiting (5/hour per IP) added |
| `next.config.ts` | Security headers added for all routes |
| `app/(admin)/admin/enquiries/page.tsx` | `force-dynamic` added |
| `app/(admin)/admin/enquiries/EnquiriesClient.tsx` | Tab colour conflict fixed |
| `types/index.ts` | `order?: number` added to `Item` |
| `lib/firebase/items.ts` | `order` in serialize; client-side sort (new items first) |
| `lib/firebase/admin-items.ts` | `order` in serialize; `adminReorderItems()` batch function |
| `app/api/admin/items/reorder/route.ts` | **New file** — batch reorder endpoint |
| `app/(admin)/admin/items/reorder/page.tsx` | **New file** — reorder page (server component) |
| `app/(admin)/admin/items/reorder/ReorderClient.tsx` | **New file** — dnd-kit drag-and-drop reorder UI |
| `app/(admin)/admin/items/page.tsx` | "Reorder Items" button added |
| `components/layout/Navbar.tsx` | "Our Story" → "From Trām to Beyond" in hamburger menu |
| `components/about/OurStoryTimeline.tsx` | Section h2 → "From Trām to Beyond" |
| `components/layout/Footer.tsx` | "Know more." underlined span added to developer credit |
| `app/sitemap.ts` | **New file** — dynamic sitemap (66 pages) |
| `app/layout.tsx` | `metadataBase` added |
| `package.json` | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` added |

---

# Twenty-Second Build Session — Addendum

**Date:** 2026-06-03
**Scope:** Admin login page colour conflict fix

---

## 123. Admin Login Page — Colour Fix (`app/(admin)/login/page.tsx`)

The login page bypasses the `AdminShell` wrapper (which applies the `light-theme` class), so Tailwind colour utilities like `text-walnut` and `text-stone` resolved to the dark-theme CSS variable values — making labels and borders nearly invisible against the white form card.

**Fix:** Replaced all theme-variable-dependent classes with explicit hex values:

| Element | Before | After |
|---------|--------|-------|
| Page background | `bg-cream` | `bg-[#FAF6F0]` |
| Title | `text-walnut` | `text-[#3D2B1F]` |
| Subtitle "Admin Panel" | `text-stone` | `text-[#8B7355]` |
| Form border | `border-cream-dark` | `border-[#E8DDD4]` |
| Labels | `text-walnut` | `text-[#3D2B1F]` |
| Input border | `border-stone/30` | `border-[#C8B8A8]` |
| Input typed text | (browser default) | `text-[#3D2B1F] bg-white` |
| Placeholder text | (browser default) | `placeholder:text-[#B0A090]` |
| Sign In button text | `text-cream` | `text-white` |

**Root cause:** The admin login page returns `<>{children}</>` in `AdminShell` — it never receives the `light-theme` wrapper class. All other admin pages (which pass through `AdminShell`) do receive it and work correctly.

---

## 124. Key Files Modified (Twenty-Second Build)

| File | Change type |
|------|-------------|
| `app/(admin)/login/page.tsx` | All colour classes replaced with explicit hex values |

---

# Twenty-Third Build Session — Addendum

**Date:** 2026-06-12 / 2026-06-17
**Scope:** Vercel image optimization disabled, mobile hero text position fix, "Our Collections" → "Collections" rename (site-wide), Collections + Research home page titles wired as navigation links

---

## 125. Vercel Image Optimization Disabled (`next.config.ts`)

`unoptimized: true` added to the `images` config. Next.js's built-in image optimization (resizing/re-encoding via Vercel's Image Optimization API) counts against Vercel's free-tier usage quota; with `unoptimized: true`, `<Image>` components serve the original files directly instead, avoiding overage charges.

```ts
images: {
  unoptimized: true,
  remotePatterns: [ ... ],
}
```

---

## 126. HeroSection — Mobile Text Position Fix (`components/home/HeroSection.tsx`)

The mobile text block's start position was raised slightly to prevent overlap with the logo on small screens:

| Parameter | Before | After |
|-----------|--------|-------|
| `textYMobile` start | `-20vh` | `-12vh` |

`textYMobile` end (`25vh`) unchanged.

---

## 127. "Our Collections" → "Collections" Rename (site-wide)

The client requested shortening "Our Collections" to "Collections" for a cleaner title. Changed in four places:

| File | Element |
|------|---------|
| `types/home-content.ts` | `DEFAULT_HOME_CONTENT.collections.title` — fallback default only |
| `components/layout/Navbar.tsx` | Hamburger menu link text (href `/collections` unchanged) |
| `app/(public)/collections/page.tsx` | Page `<h1>` and `metadata.title` |

**Important caveat discovered during this change:** the home page section title (`CategoryHighlights.tsx`'s `{content.title}`) is **not** hardcoded — it's fetched from Firestore via `getHomeContent()` (`lib/firebase/site-content.ts`), which merges a stored document over `DEFAULT_HOME_CONTENT`. Since the client had already saved "Our Collections" through the `/admin/home` panel, editing the code default had no visible effect. The client updated the live value directly through `/admin/home` → "Collections Section" card → Title field → Save. The `Footer.tsx` "Our Collections" link text (`components/layout/Footer.tsx:22`) was intentionally left unchanged — not requested.

---

## 128. Home Page — "Collections" + "Research" Titles Wired as Navigation Links

Both home page section headings (previously static text) were turned into clickable links navigating to their respective full pages, matching the site's existing hover-affordance pattern (used on category/research cards): color transition to terracotta + underline reveal on hover.

### `components/home/CategoryHighlights.tsx`
```tsx
<Link href="/collections" className="group block">
  <h2 className="font-display text-5xl lg:text-6xl text-cream font-semibold mb-2 text-center underline decoration-transparent decoration-1 underline-offset-8 group-hover:text-terracotta transition-colors duration-300 group-hover:decoration-terracotta transition-[text-decoration-color] duration-300">
    {content.title}
  </h2>
</Link>
```

### `components/home/ResearchHighlights.tsx`
Identical pattern, `href="/research"`, static text "Research".

### Color iteration
First implementation used `hover:text-saffron` per an initial client request, but this was inconsistent with the rest of the site — every other interactive text element (navbar links, card titles, footer links) hovers to **terracotta**, and saffron is not used as a hover/interactive color anywhere else on the public site. Corrected to `group-hover:text-terracotta` / `group-hover:decoration-terracotta` to match.

Both links sit inside the existing `ScrollReveal` wrapper, so the entrance animation is unaffected — only the hover interaction was added.

---

## 129. Key Files Modified (Twenty-Third Build)

| File | Change type |
|------|-------------|
| `next.config.ts` | `images.unoptimized: true` added |
| `components/home/HeroSection.tsx` | `textYMobile` start `-20vh` → `-12vh` |
| `types/home-content.ts` | `collections.title` default "Our Collections" → "Collections" |
| `components/layout/Navbar.tsx` | Hamburger menu "Our Collections" → "Collections" (link target unchanged) |
| `app/(public)/collections/page.tsx` | `<h1>` and `metadata.title` "Our Collections" → "Collections" |
| `components/home/CategoryHighlights.tsx` | Section title wrapped in `Link href="/collections"`; terracotta hover + underline-reveal affordance added |
| `components/home/ResearchHighlights.tsx` | Section title wrapped in `Link href="/research"`; terracotta hover + underline-reveal affordance added |
| Firestore (`home-content` doc, via `/admin/home`) | `collections.title` value updated live to "Collections" |

---

# Twenty-Fourth Build Session — Addendum

**Date:** 2026-06-20
**Scope:** Netflix-style hover arrows for the Collections + Research horizontal scroll panels (`components/home/CategoryHighlights.tsx`, `components/home/ResearchHighlights.tsx`)

---

## 130. Horizontal Scroll Panels — Netflix-Style Hover Arrows

The client referenced Netflix's row-navigation arrows (large chevrons that fade in over the row edges on hover, darken further on direct hover) and asked for the same behavior on the Collections and Research carousels. Previously both panels had only small (18px) `ChevronLeft`/`ChevronRight` buttons sitting in a thin bar below the image row, next to a draggable scrollbar thumb.

### Structural change
The scroll track (`scrollContainerRef` div) was wrapped in a `relative group` container so the new arrow buttons could be absolutely positioned over the image row itself, rather than living in the bar below it:

```tsx
<div className="relative group">
  <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto ... bg-[#0a0a0a]">
    {/* cards */}
  </div>

  {!isAtStart && (
    <button onClick={() => scrollByCard(-1)} className="absolute inset-y-0 left-0 z-10 ...">
      <ChevronLeft ... />
    </button>
  )}
  {!isAtEnd && (
    <button onClick={() => scrollByCard(1)} className="absolute inset-y-0 right-0 z-10 ...">
      <ChevronRight ... />
    </button>
  )}
</div>
```

### Boundary hiding
`isAtStart` / `isAtEnd` booleans were derived from the existing `thumbLeft`/`thumbWidth` scrollbar-position state (already tracked for the draggable thumb) — no new scroll-tracking logic needed:
```ts
const isAtStart = thumbLeft <= 0.5;
const isAtEnd = thumbLeft + thumbWidth >= 99.5;
```
The left arrow doesn't render at the very start of the row; the right arrow doesn't render at the very end — matching Netflix's behavior.

### Visibility — mobile vs desktop
Mobile and desktop intentionally diverge, because `:hover` only exists for mouse input:
- **Mobile:** arrows always visible (`opacity-100`) since there's no hover state to fade in from.
- **Desktop (`lg:`):** arrows are invisible by default and fade in only when hovering anywhere over the row (`lg:opacity-0 lg:group-hover:opacity-100`).

### Two-tier darken/color effect
- Background: `bg-black/40` baseline, `hover:bg-black/60` when the cursor is directly on the arrow.
- Arrow color: `text-cream` baseline, `hover:text-terracotta` when the cursor is directly on the arrow (added in a follow-up tweak — see below).
- `active:` variants (`active:bg-black/60`, `active:text-terracotta`) were added alongside the `hover:` ones so touch devices get an equivalent color change while actively pressing, since `:hover` doesn't fire from touch input at all (see note below).

### Old bottom bar — chevrons removed, thumb track kept
The two small 18px chevron buttons were removed from the bar below the row. The draggable scrollbar thumb/track was kept as-is (renamed to "Scroll position track" in code comments) since it's still useful as a position indicator and for direct scrubbing.

### Size tuning (desktop only)
Icon size was increased on desktop only, leaving mobile/tablet untouched:
```tsx
<ChevronLeft size={44} strokeWidth={1.5} className="w-11 h-11 lg:w-16 lg:h-16" />
```
Lucide's `size` prop sets the base SVG width/height attributes; the `className` `w-*`/`h-*` utilities override them via CSS (which takes precedence over presentation attributes), enabling the `lg:` breakpoint override. The clickable zone width was widened to match (`lg:w-16` → `lg:w-20`).

### Progress bar hover/active color
The draggable thumb on the bottom track also received the same terracotta hover treatment, independent of the arrows:
```tsx
className={`absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-cream hover:bg-terracotta active:bg-terracotta transition-[width,background-color] duration-200 ease-out ...`}
```

### Why hover-only color didn't work on mobile (client question)
`:hover` tracks mouse cursor position — touchscreens have no persistent pointer, only touch-start/touch-end events, so there's no real "hover" moment to trigger from a tap. Mobile browsers sometimes emulate a brief "sticky hover" after a tap, but it's inconsistent across devices. The fix was adding `active:` variants (which map to `:active` and do fire on touch, while the finger is down) alongside every `hover:` class added in this session, giving mobile a comparable color-change moment.

### Code structure decision
Both components received identical edits made directly in each file rather than extracting a shared component — consistent with the existing codebase convention (everything in `CategoryHighlights.tsx`/`ResearchHighlights.tsx` is already duplicated verbatim, as established in the Sixteenth Build).

---

## 131. Key Files Modified (Twenty-Fourth Build)

| File | Change type |
|------|-------------|
| `components/home/CategoryHighlights.tsx` | Scroll track wrapped in `relative group`; large hover/always-visible arrows added over row edges with boundary hiding (`isAtStart`/`isAtEnd`); old small chevrons removed from bottom bar; desktop-only icon size increase; `hover:`/`active:` terracotta color on arrows and progress bar thumb |
| `components/home/ResearchHighlights.tsx` | Identical changes, mirrored verbatim from `CategoryHighlights.tsx` |

---

# Twenty-Fifth Build Session — Addendum

**Date:** 2026-07-03
**Scope:** Image carousel with indicator dots on catalogue cards, Kashmiri category titles on Collections and category pages

---

## 132. Image Carousel — New Component (`components/items/ImageCarousel.tsx`)

A new reusable carousel component replaces the bare `<Image>` on all catalogue item cards. It shows a swipeable image gallery with dot indicators below.

### Features
- **Swipe gesture** (mobile): horizontal touch with 40px threshold — left swipe advances, right swipe retreats
- **Dot click**: click any dot to jump to that image directly
- **Direction-aware slide animation**: uses Framer Motion `AnimatePresence` with `mode="popLayout"`; images slide in from the correct side (right when advancing, left when retreating), easing `[0.22, 1, 0.36, 1]` at 380ms
- **Always shows dots** when `images.length > 0` (even for single-image items — 1 dot shown)
- **`dotsPosition` prop**: `"below"` (default — dots below the image container) or `"inside"` (dots absolutely positioned over the image, `z-10 bottom-3`)
- All dot/swipe interactions use `e.stopPropagation()` + `e.preventDefault()` to avoid triggering the surrounding `<Link>` card

### Dot design (brand palette)
| State | Mobile | Desktop | Color |
|-------|--------|---------|-------|
| Active | `w-2 h-2` | `lg:w-3 lg:h-3` | `bg-terracotta` |
| Inactive | `w-1.5 h-1.5` | `lg:w-2 lg:h-2` | `bg-cream/30`, `hover:bg-cream/60` |
| Hover scale | — | `lg:hover:scale-150` | — |
| Gap | `gap-1.5` | `lg:gap-2` | — |

### Slide animation variants
```ts
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};
```
Each image is `absolute inset-0` inside the `relative overflow-hidden` container; `AnimatePresence` lets old and new images coexist for the slide duration.

### Direction tracking
`direction` state is set alongside `current` index on every navigation:
- `navigate(e, dir)` — used by swipe and future arrow buttons
- `goTo(e, index)` — used by dot clicks; direction derived from `index > current ? 1 : -1`

---

## 133. CollectionItemCard — Uses ImageCarousel (`components/items/CollectionItemCard.tsx`)

The inline `<div className="relative w-full aspect-square overflow-hidden">` + `<Image>` block was replaced with `<ImageCarousel images={item.images} title={item.title} sizes="(max-width: 1024px) 100vw, 50vw" />`. The unused `Image` import was removed.

The title block's top padding changed from `pt-4` → `pt-3` to account for the dots' `pt-2` now sitting between image and title.

---

## 134. ItemCard — Uses ImageCarousel (`components/items/ItemCard.tsx`)

Both the mobile and desktop image blocks were replaced with `<ImageCarousel>`:

| Layout | Previous | After |
|--------|----------|-------|
| Mobile | `<motion.div className="relative w-full aspect-square overflow-hidden">` + `<Image>` | `<motion.div>` wrapping `<ImageCarousel sizes="100vw" />` |
| Desktop | `<motion.div className="relative w-[35%] aspect-square overflow-hidden">` + `<Image>` | `<motion.div className="w-[35%]">` wrapping `<ImageCarousel sizes="35vw" />` |

The `w-[35%]` width control was moved to the outer `motion.div`; the carousel owns `w-full aspect-square overflow-hidden` internally. The `Image` import was removed.

---

## 135. Kashmiri Category Names — Shared File (`lib/category-kashmiri-names.ts`)

The `KASHMIRI_NAMES` constant previously defined inline in `CategoryHighlights.tsx` was extracted to a new shared module:

**New file:** `lib/category-kashmiri-names.ts`
```ts
export const CATEGORY_KASHMIRI_NAMES: Record<string, string> = {
  "copperware":       "ترٛام",
  "papier-mch":       "نقاشی",
  "silverware":       "رۄپھ",
  "enamelware":       "میناکاری",
  "terracotta":       "کَتٕر",
  "green-serpentine": "زہر مۄہر",
  "coins":            "سِکہ جات",
  "shawls":           "شال",
  "jewellery":        "زیور",
  "carpets":          "قالین",
  "willow-wicker":    "کانہِ کٮ۪م",
  "wood-work":        "لٮ۪کَرِ کٮ۪م",
  "brass-ware":       "سَرٛتَل",
};
```

`CategoryHighlights.tsx` was updated to import `CATEGORY_KASHMIRI_NAMES` from this file (replacing the inline `KASHMIRI_NAMES` constant) — no visible change on the home page carousel.

---

## 136. Kashmiri Category Titles on Collections Page (`app/(public)/collections/page.tsx`)

The Kashmiri name now appears to the right of each category heading on the `/collections` page, both on the same baseline in a flex row.

### Layout
```tsx
<div className="flex items-baseline justify-between gap-6 mb-4">
  <Link href={`/category/${category.slug}`} className="hover:text-terracotta ...">
    <h2 className="font-display text-3xl lg:text-5xl text-cream">
      {category.name}
    </h2>
  </Link>
  {CATEGORY_KASHMIRI_NAMES[category.slug] && (
    <p
      className="font-display text-3xl lg:text-5xl text-stone shrink-0"
      dir="rtl"
      lang="ks"
    >
      {CATEGORY_KASHMIRI_NAMES[category.slug]}
    </p>
  )}
</div>
```

- `items-baseline` — aligns English and Kashmiri text on their shared text baseline
- `justify-between` — English left, Kashmiri right
- `shrink-0` — prevents Kashmiri title from wrapping or shrinking
- `dir="rtl" lang="ks"` — correct Nastaliq character shaping; right-to-left reading direction
- Font size matches the English heading: `text-3xl lg:text-5xl`

---

## 137. Kashmiri Category Titles on Individual Category Pages (`app/(public)/category/[slug]/page.tsx`)

Same pattern applied to the `h1` header on each category's own page:

```tsx
<div className="flex items-baseline justify-between gap-6 mb-4">
  <h1 className="font-display text-3xl lg:text-6xl text-cream">
    {category.name}
  </h1>
  {CATEGORY_KASHMIRI_NAMES[slug] && (
    <p
      className="font-display text-3xl lg:text-6xl text-stone shrink-0"
      dir="rtl"
      lang="ks"
    >
      {CATEGORY_KASHMIRI_NAMES[slug]}
    </p>
  )}
</div>
```

Font size matches the `h1`: `text-3xl lg:text-6xl`.

---

## 138. Key Files Modified (Twenty-Fifth Build)

| File | Change type |
|------|-------------|
| `components/items/ImageCarousel.tsx` | **New file** — swipeable carousel, direction-aware slide animation, dot indicators with brand colours, desktop hover scale on dots |
| `components/items/CollectionItemCard.tsx` | Bare `<Image>` + wrapper replaced with `<ImageCarousel>`; `Image` import removed; title `pt-4` → `pt-3` |
| `components/items/ItemCard.tsx` | Bare `<Image>` + wrappers replaced with `<ImageCarousel>` in both mobile and desktop layouts; `Image` import removed; desktop outer `motion.div` width moved up one level |
| `lib/category-kashmiri-names.ts` | **New file** — shared `CATEGORY_KASHMIRI_NAMES` map (13 slugs) extracted from `CategoryHighlights.tsx` |
| `components/home/CategoryHighlights.tsx` | Inline `KASHMIRI_NAMES` removed; imports from `lib/category-kashmiri-names.ts` |
| `app/(public)/collections/page.tsx` | `CATEGORY_KASHMIRI_NAMES` imported; heading restructured as `flex items-baseline justify-between` row with Kashmiri title on the right (`text-3xl lg:text-5xl`, `dir="rtl" lang="ks"`) |
| `app/(public)/category/[slug]/page.tsx` | `CATEGORY_KASHMIRI_NAMES` imported; `h1` restructured as `flex items-baseline justify-between` row with Kashmiri title on the right (`text-3xl lg:text-6xl`, `dir="rtl" lang="ks"`) |

---

# Twenty-Sixth Build Session — Addendum

**Date:** 2026-07-03
**Scope:** Admin Research panel (full CRUD), Research items migrated to Firestore, CategoryForm "Save Changes" bug fix, Firestore permissions + composite index fixes

---

## 139. CategoryForm — "Save Changes" Bug Fix (`components/forms/CategoryForm.tsx`)

The "Save Changes" button on the admin Categories edit form failed with "Invalid input: expected string, received undefined" under the Display Order field.

### Root cause
`type="number"` HTML inputs managed by react-hook-form `Controller` can return a number or `undefined`, but the schema had `order: z.string().min(1)` which rejects non-strings.

### Fix
- Schema: `z.string().min(1)` → `z.coerce.number().int().min(0, "Order must be 0 or greater")`
- `defaultValues.order`: `String(existing?.order ?? 0)` → `existing?.order ?? 0`
- Removed manual `parseInt` block from `onSubmit`; `order: values.order` used directly
- TypeScript incompatibility between Zod v4 `z.coerce` input type (`unknown`) and @hookform/resolvers v5 strict typing required casts: `resolver: zodResolver(schema) as any`, `control={form.control as any}`, `(form.handleSubmit as any)(onSubmit)`

### Kashmiri Name autofill fix
`autoComplete="off"` added to the `nameKashmiri` `<Input>` to prevent browser autofill populating the field with a cached description value when opening an existing category for editing.

---

## 140. Research Admin Panel — Full Implementation

A complete admin panel for research items, mirroring the Items admin page structure.

### `types/index.ts`
Added `ResearchItem` interface:
```typescript
export interface ResearchItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  sectionSlug: string;
  order: number;
  createdAt: string;
}
```

### `components/layout/AdminSidebar.tsx`
`BookOpen` icon imported from lucide-react. Research link added between Categories and Enquiries:
```typescript
{ href: "/admin/research", label: "Research", icon: BookOpen, exact: false },
```

### `lib/firebase/admin-research.ts` (new file)
Admin SDK CRUD for the `research_items` Firestore collection:
- `adminGetAllResearchItems()` — all items ordered by `order` asc
- `adminGetResearchItemsBySection(sectionSlug)` — filters by section, sorts in memory (avoids composite index requirement)
- `adminGetResearchItemBySlug(sectionSlug, slug)` — two equality filters + `limit(1)`
- `adminCreateResearchItem(data)` — creates doc, returns id
- `adminUpdateResearchItem(id, data)` — partial update
- `adminDeleteResearchItem(id)` — deletes doc + clears `research/${id}/` storage prefix

A shared `serializeItem()` helper converts Firestore `QueryDocumentSnapshot` to `ResearchItem`.

### `lib/firebase/research.ts` (new file — Admin SDK backed)
Public-facing query functions that delegate to the Admin SDK via dynamic import (so they can be called from server components without bundling `firebase-admin` into the client):
- `getResearchItemsBySection(sectionSlug)` — calls `adminGetResearchItemsBySection`
- `getAllResearchItems()` — calls `adminGetAllResearchItems`
- `getResearchItemBySlug(sectionSlug, slug)` — calls `adminGetResearchItemBySlug`

All three fall back to `RESEARCH_SECTIONS` static data when Firebase is not configured (`NEXT_PUBLIC_FIREBASE_PROJECT_ID` absent).

### API Routes (3 new files)

| File | Methods | Purpose |
|------|---------|---------|
| `app/api/admin/research/route.ts` | GET, POST | List all / create new research item |
| `app/api/admin/research/[id]/route.ts` | PUT, DELETE | Update / delete by id |
| `app/api/admin/seed-research/route.ts` | POST | Seed static `RESEARCH_SECTIONS` data to Firestore; deduplicates via `where("sectionSlug","==").where("slug","==")` query before creating; returns `{ created: string[], skipped: string[] }` |

All routes use `verifyAdminRequest` for auth.

### `lib/admin-api.ts`
Added four functions:
```typescript
export async function apiCreateResearchItem(data: object): Promise<string>
export async function apiUpdateResearchItem(id: string, data: object): Promise<void>
export async function apiDeleteResearchItem(id: string): Promise<void>
export async function apiSeedResearch(): Promise<{ created: string[]; skipped: string[] }>
```

### Admin Pages (6 new files)

| File | Purpose |
|------|---------|
| `app/(admin)/admin/research/page.tsx` | List page — item count, "Add Item" button, `force-dynamic` |
| `app/(admin)/admin/research/ResearchClient.tsx` | Client component — section filter tabs (All + 3 sections), table with thumbnail/title/section/Edit/Delete |
| `app/(admin)/admin/research/DeleteResearchItemButton.tsx` | Confirm + delete pattern matching existing admin buttons |
| `app/(admin)/admin/research/SeedResearchButton.tsx` | Calls `apiSeedResearch()`, shows created/skipped result — removed from page after use |
| `app/(admin)/admin/research/new/page.tsx` | Renders `<ResearchItemForm />` |
| `app/(admin)/admin/research/[id]/page.tsx` | Fetches item via `adminGetAllResearchItems().find(id)`, renders `<ResearchItemForm existing={item} />` |

### `components/forms/ResearchItemForm.tsx` (new file)
Form with:
- Native `<select>` for section (Adaptive Reuse / Reinterpretation / Graphic Design) — matches ItemForm's category dropdown pattern, avoids shadcn `Select` dependency
- Title, description (optional), display order fields
- Multi-image `ImageUploadField` (no `single` prop)
- Same `z.coerce.number()` + `as any` casts as CategoryForm
- On create: `slug = slugify(values.title)`; on edit: `slug = existing.slug` (preserves existing URLs)
- Storage path: `research/${existing.id}` or `research/temp-${Date.now()}`

---

## 141. ResearchItemCard — Updated to Use ImageCarousel (`components/items/ResearchItemCard.tsx`)

The static `<Image>` inside `ResearchItemCard` was replaced with `<ImageCarousel>` matching the pattern applied to `ItemCard` and `CollectionItemCard` in the previous session:
- Mobile: `<ImageCarousel images={item.images} title={item.title} sizes="100vw" />` inside `motion.div`
- Desktop: `<ImageCarousel images={item.images} title={item.title} sizes="35vw" />` in `w-[35%]` div (carousel owns `aspect-square overflow-hidden`)
- `ResearchItem` now imported from `@/types` (not `@/lib/research-data`)

---

## 142. Public Research Pages — Firestore-Backed

All public research pages updated from static data to Firestore queries via `lib/firebase/research.ts`:

| File | Change |
|------|--------|
| `app/(public)/research/page.tsx` | Async server component; `Promise.all` fetches items for all 3 sections via `getResearchItemsBySection` |
| `app/(public)/research/adaptive-reuse/page.tsx` | Async; calls `getResearchItemsBySection("adaptive-reuse")` |
| `app/(public)/research/reinterpretation/page.tsx` | Async; calls `getResearchItemsBySection("reinterpretation")` |
| `app/(public)/research/graphic-design/page.tsx` | Async; calls `getResearchItemsBySection("graphic-design")` |
| `app/(public)/research/adaptive-reuse/[slug]/page.tsx` | Async; calls `getResearchItemBySlug("adaptive-reuse", slug)` |
| `app/(public)/research/reinterpretation/[slug]/page.tsx` | Async; calls `getResearchItemBySlug("reinterpretation", slug)` |
| `app/(public)/research/graphic-design/[slug]/page.tsx` | Async; calls `getResearchItemBySlug("graphic-design", slug)` |

All pages have `export const dynamic = "force-dynamic"`. Section titles/descriptions remain static (sourced from `RESEARCH_SECTIONS`); only items come from Firestore.

---

## 143. Firestore Permissions + Composite Index Fix

### Problem 1 — "Missing or insufficient permissions"
The original `lib/firebase/research.ts` used the **client SDK** (`firebase/firestore`). The Firestore security rules only permitted authenticated reads — unauthenticated public page requests were blocked.

**Fix:** Rewrote `lib/firebase/research.ts` to use the **Admin SDK** via dynamic import (`await import("./admin-research")`). Since all callers are server components (never client-side), this is safe. The Admin SDK authenticates via the service account and bypasses Firestore security rules entirely.

### Problem 2 — "9 FAILED_PRECONDITION: The query requires an index"
The compound query `.where("sectionSlug", "==", sectionSlug).orderBy("order", "asc")` requires a composite Firestore index that did not exist.

**Fix:** Removed `.orderBy("order", "asc")` from `adminGetResearchItemsBySection`. Items are now sorted in JavaScript after fetching (`items.sort((a, b) => a.order - b.order)`). This produces identical results for the small item counts involved and avoids the index creation requirement entirely.

---

## 144. Seed Button Removed

After successfully seeding all 5 research items to Firestore via the "Seed Existing Items" button, the button was removed from the admin Research page:
- `SeedResearchButton` import removed from `app/(admin)/admin/research/page.tsx`
- `<SeedResearchButton />` render removed
- `<div className="flex items-center gap-2">` wrapper simplified back to a direct `<Link>` for the "Add Item" button

---

## 145. Key Files Modified (Twenty-Sixth Build)

| File | Change type |
|------|-------------|
| `components/forms/CategoryForm.tsx` | `order` schema `z.string().min(1)` → `z.coerce.number().int().min(0)`; `defaultValues.order` → number; `parseInt` block removed; `as any` casts for Zod v4 + hookform v5; `autoComplete="off"` on Kashmiri name field |
| `types/index.ts` | `ResearchItem` interface added |
| `lib/firebase/admin-research.ts` | **New file** — Admin SDK CRUD; `serializeItem` helper; `adminGetResearchItemsBySection` + `adminGetResearchItemBySlug` added (in-memory sort, no composite index) |
| `lib/firebase/research.ts` | **New file** — public queries delegating to Admin SDK via dynamic import; static fallback when Firebase unconfigured |
| `app/api/admin/research/route.ts` | **New file** — GET + POST handlers |
| `app/api/admin/research/[id]/route.ts` | **New file** — PUT + DELETE handlers |
| `app/api/admin/seed-research/route.ts` | **New file** — seed static data to Firestore with deduplication |
| `lib/admin-api.ts` | `apiCreateResearchItem`, `apiUpdateResearchItem`, `apiDeleteResearchItem`, `apiSeedResearch` added |
| `components/layout/AdminSidebar.tsx` | `BookOpen` import; Research link added |
| `app/(admin)/admin/research/page.tsx` | **New file** — list page (seed button subsequently removed) |
| `app/(admin)/admin/research/ResearchClient.tsx` | **New file** — section filter tabs + table |
| `app/(admin)/admin/research/DeleteResearchItemButton.tsx` | **New file** — confirm + delete |
| `app/(admin)/admin/research/SeedResearchButton.tsx` | **New file** — seed trigger (used once, button removed from page) |
| `app/(admin)/admin/research/new/page.tsx` | **New file** — create form page |
| `app/(admin)/admin/research/[id]/page.tsx` | **New file** — edit form page |
| `components/forms/ResearchItemForm.tsx` | **New file** — section picker, title, description, order, multi-image upload |
| `components/items/ResearchItemCard.tsx` | `<Image>` → `<ImageCarousel>`; `ResearchItem` imported from `@/types` |
| `app/(public)/research/page.tsx` | Async; `Promise.all` fetches from Firestore |
| `app/(public)/research/adaptive-reuse/page.tsx` | Async; Firestore fetch |
| `app/(public)/research/reinterpretation/page.tsx` | Async; Firestore fetch |
| `app/(public)/research/graphic-design/page.tsx` | Async; Firestore fetch |
| `app/(public)/research/adaptive-reuse/[slug]/page.tsx` | Async; Firestore item detail |
| `app/(public)/research/reinterpretation/[slug]/page.tsx` | Async; Firestore item detail |
| `app/(public)/research/graphic-design/[slug]/page.tsx` | Async; Firestore item detail |

---

## Twenty-Seventh Build Session

**Date:** 2026-07-05
**Scope:** Research admin reorder functionality — mirrors the existing Items reorder panel

---

## 146. Research Reorder Button + Page

The client requested a "Reorder Items" button on the Research admin panel that works identically to the one on the Items page.

### Changes

**`lib/firebase/admin-research.ts`** — Added `adminReorderResearchItems`:
```typescript
export async function adminReorderResearchItems(
  items: Array<{ id: string; order: number }>
): Promise<void> {
  const batch = adminDb.batch();
  for (const { id, order } of items) {
    batch.update(adminDb.collection("research_items").doc(id), { order });
  }
  await batch.commit();
}
```
Uses an atomic Firestore batch write, identical pattern to `adminReorderItems` in `admin-items.ts`.

**`app/api/admin/research/reorder/route.ts`** — New POST endpoint:
- Protected by `verifyAdminRequest`
- Zod schema: `{ items: [{ id: string, order: number }] }` (min 1 item)
- Calls `adminReorderResearchItems` and returns `{ success: true }`

**`app/(admin)/admin/research/reorder/page.tsx`** — New server page:
- Fetches all research items via `adminGetAllResearchItems()`
- Renders heading + `<ReorderResearchClient items={items} />`
- `export const dynamic = "force-dynamic"`

**`app/(admin)/admin/research/reorder/ReorderResearchClient.tsx`** — New client component:
- Drag-and-drop list using `@dnd-kit/core` + `@dnd-kit/sortable` (same libraries as items reorder)
- **Section tabs** instead of category tabs — derived dynamically from item `sectionSlug` values using `slugToTitle` helper (e.g. `"graphic-design"` → `"Graphic Design"`)
- Each tab shows the section name + item count badge
- `Save Order` button POSTs ordered `[{id, order}]` to `/api/admin/research/reorder`
- Saving/saved/error states identical to items reorder
- `SortableResearchItem` sub-component: grip handle, 40×40 thumbnail, title

**`app/(admin)/admin/research/page.tsx`** — Added Reorder button:
- Added `ArrowUpDown` import from lucide-react
- Wrapped existing `Add Item` link in `<div className="flex items-center gap-2">`
- Added `<Link href="/admin/research/reorder">` with matching outline style (`bg-white border border-walnut text-walnut`)

---

## 147. Key Files Modified (Twenty-Seventh Build)

| File | Change type |
|------|-------------|
| `lib/firebase/admin-research.ts` | Added `adminReorderResearchItems` (batch write pattern) |
| `app/api/admin/research/reorder/route.ts` | **New file** — POST reorder endpoint |
| `app/(admin)/admin/research/reorder/page.tsx` | **New file** — server page |
| `app/(admin)/admin/research/reorder/ReorderResearchClient.tsx` | **New file** — DnD client with section tabs |
| `app/(admin)/admin/research/page.tsx` | Added `ArrowUpDown` import; Reorder Items button added |

---

# Twenty-Eighth Build Session — Addendum

**Date:** 2026-07-21
**Scope:** Fixed Safari "This Connection Is Not Private" SSL warning on `www.traamandbeyond.com` — infrastructure/DNS fix only, no code changes

---

## 148. `www.traamandbeyond.com` — SSL Certificate Mismatch Fix

### Symptom
Visitors opening `www.traamandbeyond.com` in Safari (mobile) saw a full-page "This Connection Is Not Private" interstitial warning them the site "may be impersonating www.traamandbeyond.com to steal your personal or financial information" — a serious trust-destroying error for first-time visitors.

### Diagnosis
DNS resolution was confirmed correct (`www` → CNAME → `cname.vercel-dns.com`; apex → A → `216.198.79.1`), ruling out a DNS misconfiguration. The actual fault was found by inspecting the TLS certificate directly:

```
$ openssl s_client -connect www.traamandbeyond.com:443 -servername www.traamandbeyond.com | openssl x509 -noout -subject -ext subjectAltName
subject=CN=traamandbeyond.com
X509v3 Subject Alternative Name:
    DNS:traamandbeyond.com          ← no www entry
```

`curl` reproduced the exact failure mode: `SEC_E_WRONG_PRINCIPAL — the target principal name is incorrect`.

**Root cause:** `www.traamandbeyond.com` had never been (re-)added as a domain on the Vercel project (`Settings → Domains` only listed `traamandbeyond.com` and the default `.vercel.app` domain). With no domain entry, Vercel never issued a certificate covering the `www` hostname, so every browser correctly flagged the hostname/certificate mismatch as a potential phishing indicator — this was not an actual security compromise, just a missing cert.

### Fix (Vercel dashboard, `Settings → Domains → Add Existing`)
- Added `www.traamandbeyond.com` to the project
- **Did not** check "Redirect apex domains to www" (would have flipped the canonical domain to `www`, conflicting with the existing `metadataBase` and `sitemap.ts` config which are keyed to the bare apex domain — see §121)
- Configured as **"Redirect to Another Domain"** → `traamandbeyond.com`, **308 Permanent Redirect** (not "Connect to an environment", which would have served the site independently at both hostnames and created duplicate-content/SEO issues)
- Vercel auto-issued a new Let's Encrypt certificate scoped to `www.traamandbeyond.com`

### Verification
```
subject=CN=www.traamandbeyond.com
X509v3 Subject Alternative Name:
    DNS:www.traamandbeyond.com
```
```
HTTP/1.1 308 Permanent Redirect
Location: https://traamandbeyond.com/
```
followed by `200 OK` on the apex domain.

### Follow-up (non-urgent, cosmetic)
After adding the domain, Vercel flagged "DNS Change Recommended" — they've expanded their IP range and now prefer a newer CNAME target (`07c03a6e4430f07e.vercel-dns-017.com`) over the legacy one (`cname.vercel-dns.com`) already in place. Vercel's own messaging confirms the legacy record "will continue to work" — this is optional cleanup, not a fix for the SSL issue, which was already resolved before this step. The `www` CNAME record was updated at GoDaddy (`dcc.godaddy.com → Domain → DNS`) to the new target; propagation window quoted as 1–48 hours, no downtime expected during the transition since the old record remains valid throughout.

### No application code changes
This was entirely a Vercel project settings + GoDaddy DNS fix. No files in the repository were modified.

---

# Twenty-Ninth Build Session — Addendum

**Date:** 2026-08-04
**Scope:** Trademark (™) notice added to hero headline (mobile + desktop) and footer, ahead of the pending trademark registration for the site name/logo

---

## 149. Trademark Symbol — Placement Strategy

The client is in the process of registering "Traam and Beyond" as a trademark. Rather than tagging ™ on every spelled-out occurrence of the name site-wide, standard trademark notice practice was followed: mark the first/most prominent use per key page (hero headline) plus a single sitewide ownership notice in the footer. Nav links, page titles, and body-copy mentions were intentionally left untagged.

Since the mark is *pending* (not yet registered), **™** was used rather than **®** — the registered-mark symbol is only appropriate once registration is actually granted. `&trade;` → `&reg;` is the swap to make in both files if/when that happens.

---

## 150. HeroSection — ™ on Headline (`components/home/HeroSection.tsx`)

A superscript ™ was appended after `content.headline` in both the mobile and desktop `h1` blocks. It's rendered in the JSX rather than baked into the stored `headline` string (which is admin-editable via `/admin/home` → Firestore), so it survives future copy edits made through the admin panel.

### Issues hit during implementation

1. **JSX whitespace was not the real cause of the first wrap.** The initial fix assumed a newline between `{content.headline}` and `<sup>` was collapsing into a rendered space; joining them onto one line in the source didn't resolve it.
2. **Actual root cause of the wrap:** the Firestore-stored `headline` value itself had a trailing space baked into the text ("Traam and Beyond "), confirmed by inspecting the raw served HTML. Fixed by rendering `{content.headline.trim()}` instead of `{content.headline}`.
3. **`<sup>` wasn't visually raised.** Tailwind's preflight reset for `sup`/`sub` (`font-size: 75%; position: relative; top: -0.5em`) wasn't taking effect in this stack, so the mark sat on the baseline instead of raised. Replaced `<sup>` with a plain `<span>` using explicit inline styles instead of relying on the browser/preflight default.
4. **Headline wrapped to an extra line.** The ™ span's added width pushed the already tight-fitting "Traam and Beyond" past the `max-w-3xl` container edge on desktop (dropping "Beyond™" to its own line), and similarly forced a wrap on mobile. Fixed with `whitespace-nowrap` — `lg:whitespace-nowrap` on the desktop `h1` (scoped since that heading only renders at `lg:` and up), and an unconditional `whitespace-nowrap` on the mobile `h1` (safe since that heading is `lg:hidden` and never shows above the breakpoint).
5. **Vertical position tuning.** The mark's raise height was iterated from the browser-default `vertical-align: super` (too subtle, barely lifted) to an explicit `top` offset, tuned through `-0.9em` up to a final **`-1.5em`**.

### Final implementation (both mobile and desktop `h1`)

```tsx
{content.headline.trim()}
<span
  style={{ position: "relative", top: "-1.5em", fontSize: "0.35em" }}
  className="font-normal ml-1"
>
  &trade;
</span>
```

Mobile `h1` className gained `whitespace-nowrap`; desktop `h1` className gained `lg:whitespace-nowrap`.

### Known tradeoff — flagged, not yet resolved
The hero `<section>` has `overflow-hidden`. Forcing the headline onto a single line via `whitespace-nowrap` is safe at the viewport widths tested during this session, but on very narrow phones (~375px and below) it could in theory push text past the screen edge and get clipped rather than wrap. Not confirmed as an actual issue yet — worth checking on a small real device. If it surfaces, the fix is stepping the mobile base font size down (e.g. `text-4xl` at the smallest breakpoint), not removing the `nowrap`.

---

## 151. Footer — ™ Symbol + Ownership Notice (`components/layout/Footer.tsx`)

### Site name mark
A superscript ™ was added next to "Traam and Beyond" in the footer's brand line, using the same explicit-offset `<span>` pattern as the hero, scaled down for the footer's smaller text:

```tsx
<p className="text-cream text-lg font-semibold mb-2">
  Traam and Beyond
  <span style={{ position: "relative", top: "-0.6em", fontSize: "0.5em" }} className="font-normal ml-0.5">
    &trade;
  </span>
</p>
```

### Ownership notice line
A new line was added beneath the copyright line, serving as the sitewide trademark notice referenced in the placement strategy (§149) — this single notice is intended to cover the rest of the site so other occurrences of the name don't need individual ™ tags:

```tsx
<p>© {new Date().getFullYear()} Traam and Beyond. All rights reserved.</p>
<p>Traam and Beyond&trade; is a trademark of Hakim Ali Reza.</p>
```

---

## 152. Key Files Modified (Twenty-Ninth Build)

| File | Change type |
|------|-------------|
| `components/home/HeroSection.tsx` | ™ superscript `<span>` added after `content.headline.trim()` on mobile + desktop `h1`; `whitespace-nowrap` (mobile, unconditional) / `lg:whitespace-nowrap` (desktop) added to stop the mark forcing a line wrap; raise height tuned to `top: "-1.5em"` |
| `components/layout/Footer.tsx` | ™ superscript added to "Traam and Beyond" brand line; new ownership notice line added below copyright ("Traam and Beyond™ is a trademark of Hakim Ali Reza.") |

---

# Thirtieth Build Session — Addendum

**Date:** 2026-08-11 to 2026-08-12
**Scope:** Homepage SEO metadata update, "Read Our Story" button replaced with an inline text link (plus a foreground pointer-events architecture fix that was blocking it), and mobile tap-discoverability treatment for the "Collections"/"Research" section headings

---

## 153. Homepage Metadata — Title & Description Update (`app/(public)/page.tsx`)

The homepage's route-level `metadata` export (which overrides the site-wide default in `app/layout.tsx` for `/` specifically) was updated:

```tsx
export const metadata: Metadata = {
  title: "Traam and Beyond — Silenced crafts, Speaking again",
  description:
    "An evolving repository of Kashmir's material heritage, bringing together distinctive antiques, craft research, artisan stories, and contemporary approaches to its traditional design language.",
};
```

This is the text Google shows in search results (confirmed via a live `traam and beyond` Google search showing the old description). Since it's static text (not Firestore-driven), the change required a code deploy rather than an admin-panel edit. After deploying, re-indexing was requested via Google Search Console (Domain property `traamandbeyond.com`, verified via DNS TXT record at GoDaddy) using URL Inspection → Request Indexing on the homepage — there's no guaranteed timeline for the new snippet to actually replace the cached one in search results.

---

## 154. Our Story Section — "Read Our Story" Button Replaced with Inline Link

### The change
The standalone terracotta "Read Our Story ›››" button (previously its own opaque strip on the home page, see §18/§27) was removed entirely. In its place, a text link was added directly inside `OurStorySection.tsx`, centered beneath the two intro paragraphs:

```tsx
// components/home/OurStorySection.tsx
<div className="px-6 py-5 text-center space-y-3">
  <p className="text-[#1a130a] text-base leading-relaxed">{MOBILE_P1}</p>
  <p className="text-[#FAF6F0] text-base leading-relaxed">{MOBILE_P2}</p>
  <a
    href="/about#introduction"
    className="inline-block text-[#1a130a] text-sm lg:text-base font-bold underline decoration-[#1a130a] lg:decoration-transparent underline-offset-4 transition-all duration-300 ease-out lg:hover:decoration-[#1a130a] lg:hover:scale-105"
  >
    Read Our Story →
  </a>
</div>
```

- Links to `/about#introduction` — matching the target the navbar's own "Our Story" sub-link already uses.
- Color fixed at `text-[#1a130a]` (matches the "In 2004…" paragraph) — an earlier iteration dimmed the color on hover (`hover:text-[#1a130a]/80`); this was explicitly removed at the client's request so the text color never changes.
- **Desktop:** underline starts transparent (`decoration-transparent`) and reveals via `lg:hover:decoration-[#1a130a]`, plus a `lg:hover:scale-105` grow — both gated to `lg:` so no lingering "stuck hover" state occurs on a mobile tap.
- **Mobile:** underline is always visible (`decoration-[#1a130a]`, no transparent state) since there's no hover to reveal it, and font size is dropped to `text-sm` (from `text-base` on desktop).

`components/home/HomePageClient.tsx`'s button strip was reduced to an empty `bg-[#1a130a] px-8 py-6` div — it's kept in the DOM (not deleted) because it's the scroll-trigger element (`buttonStripRef`) that fires the OurStory→Featured crossfade switch (see §29/§43); removing it outright would have broken that transition.

### Root-cause debugging: the link was unclickable
After the initial implementation, the link was visible but clicks did nothing. This took several iterations to fully diagnose:

1. **First hypothesis (wrong-ish):** the "Transparent gap 1" spacer div (`<div className="aspect-square lg:h-[85vh] w-full" />` in `HomePageClient.tsx`, sitting at `z-[2]` directly above the sticky background layer at `z-[1]`) was assumed to be capturing clicks since it's a normal block element with no visual content but default `pointer-events: auto`. Added `pointer-events-none` to it — this did not fully fix the issue.
2. **Actual root cause (confirmed via Chrome DevTools element picker):** `pointer-events: none` on a child only defers hit-testing to that child's *nearest ancestor* that still accepts pointer events — it does **not** skip across to an entirely different branch of the DOM (the sticky background layer where the link actually lives, a sibling subtree, not an ancestor). Since the foreground wrapper itself (`<div className="relative z-[2] -mt-[100vh]">`, wrapping the entire Hero-through-Enquiry page content) had no `pointer-events-none` of its own, clicks in the gap area kept resolving to *that* wrapper — confirmed directly by using DevTools' element picker on the link's screen position, which highlighted `div.relative.z-[2].-mt-[100vh]` as the hit target, not the `<a>`.
3. **Fix:** disabled `pointer-events` on the whole foreground wrapper, then explicitly re-enabled it (`pointer-events-auto`) on each opaque child section that needs to stay interactive — Hero, the trigger strip, Collections, Research, and the Enquiry form. Since `pointer-events` is an inherited CSS property, the transparent gap divs need no class of their own; they inherit `none` from the wrapper and become click-through automatically, letting clicks fall through to the sticky background layer's link.

```tsx
// components/home/HomePageClient.tsx
<div className="relative z-[2] -mt-[100vh] pointer-events-none">
  <div className="pointer-events-auto"><HeroSection ... /></div>
  <div className="aspect-square lg:h-[85vh] w-full" />                 {/* gap 1 — click-through, inherits none */}
  <div ref={buttonStripRef} className="bg-[#1a130a] px-8 py-6" />       {/* trigger strip — no interactive content, left as none */}
  <div className="pointer-events-auto"><CategoryHighlights ... /></div>
  <div className="aspect-square lg:h-[85vh] w-full" />                 {/* gap 2 */}
  <div className="pointer-events-auto"><ResearchHighlights /></div>
  <section className="bg-cream-dark py-16 pointer-events-auto">...</section>
</div>
```

---

## 155. Mobile Tap-Discoverability — "Collections" / "Research" Section Headings

### Problem
Both section headings (`components/home/CategoryHighlights.tsx` and `components/home/ResearchHighlights.tsx`) are themselves navigation links (to `/collections` and `/research` respectively), signaled on desktop only via a hover-triggered underline + terracotta color change (`group-hover:decoration-terracotta`, `group-hover:text-terracotta`). Touch devices have no hover state, so on mobile these headings looked like inert section titles with no indication they were tappable.

### Design pass
Ran through `/ui-ux-pro-max` for grounded options (the skill's CLI search tool itself hit a broken symlink in this environment — `scripts`/`data` under `.claude/skills/ui-ux-pro-max/` are unmaterialized git symlinks on this Windows setup — so the loaded Quick Reference rules were used directly: `hover-vs-tap`, `nav-label-icon`, `press-feedback`). Discussed four options (static underline / underline+arrow / press-feedback-only / eyebrow microcopy) before implementing.

### Implementation (mobile only; desktop hover behavior untouched)
Applied to both headings identically:

1. **Always-visible underline on mobile**, matching text color: `decoration-cream` at the base breakpoint (was briefly `decoration-terracotta` first, then corrected to match `text-cream`), reset to `lg:decoration-transparent` so desktop keeps its existing hover-reveal.
2. **Press/tap feedback**: `group-active:scale-[0.85]` on the `h2` (fired via the wrapping `<Link className="group block">`), reset to `lg:group-active:scale-100` so desktop clicks are unaffected. Iterated from an initial `scale-[0.97]` (too subtle, didn't read as a deliberate press) up to `0.85`.
3. **Mobile-only arrow** (`→`) appended after the heading text, wrapped in `lg:hidden` so desktop's clean look is unchanged.

### Underline-under-arrow rendering bug
Initially the arrow lived inside the same underlined element as the text, with `no-underline` applied to just the arrow's `<span>` to suppress the inherited decoration. In practice this produced a visibly separate underline segment floating under the arrow, disconnected from the line under the text — most likely caused by the arrow's smaller font size (`text-2xl` vs. the heading's `text-5xl`) creating a font-metric discontinuity in how the browser draws the decoration line across differently-sized inline boxes, which `no-underline` didn't reliably suppress.

**Fix:** restructured so the underline/decoration/hover-color classes live only on an inner `<span>` wrapping just the text, with the arrow as a plain sibling `<span>` that never had underline styling in the first place — no override needed:

```tsx
// components/home/CategoryHighlights.tsx (ResearchHighlights.tsx is identical in structure)
<h2 className="font-display text-5xl lg:text-6xl text-cream font-semibold mb-2 text-center group-active:scale-[0.85] lg:group-active:scale-100 transition-transform duration-150">
  <span className="underline decoration-cream lg:decoration-transparent decoration-1 underline-offset-8 group-hover:text-terracotta transition-colors duration-300 group-hover:decoration-terracotta transition-[text-decoration-color] duration-300">
    {content.title}
  </span><span className="lg:hidden text-2xl align-middle ml-1">→</span>
</h2>
```

Scale/press-feedback stayed on the outer `h2` so text and arrow visually scale together as one unit on tap.

### Scope note
The same hover-only discoverability issue exists on the individual card titles inside both sections (`CategoryHighlights.tsx` / `ResearchHighlights.tsx` card `h3`s use the identical `decoration-transparent` → `group-hover:decoration-terracotta` pattern) — flagged during the design discussion but intentionally left unchanged; only the two section headings were in scope for this pass.

---

## 156. Key Files Modified (Thirtieth Build)

| File | Change type |
|------|-------------|
| `app/(public)/page.tsx` | Homepage `metadata` title/description updated (SEO snippet text) |
| `components/home/OurStorySection.tsx` | "Read Our Story →" link added beneath intro paragraphs (replaces the removed button); styled with mobile-always-underlined / desktop-hover-reveal treatment |
| `components/home/HomePageClient.tsx` | Button strip emptied (trigger div kept for crossfade); foreground wrapper pointer-events architecture reworked (`pointer-events-none` on wrapper + `pointer-events-auto` on each opaque child) to fix the unclickable Our Story link |
| `components/home/CategoryHighlights.tsx` | "Collections" `h2` restructured — underline/hover classes moved to inner text `<span>`, mobile-only arrow added, always-visible underline + press-feedback scale added for mobile |
| `components/home/ResearchHighlights.tsx` | "Research" `h2` — identical treatment to CategoryHighlights above |

---

# Thirty-First Build Session — Addendum

**Date:** 2026-08-12
**Scope:** `/collections` page header removal and desktop layout overhaul (Research-style alternating split, golden-ratio text positioning), new `MobileScrollIndicator` component rolled out across catalogue/research pages, `ItemImageGallery` arrow removal + lightbox fixes + mobile swipe, `/research` index card variant without description

---

## 157. Collections Page — Header Removed (`app/(public)/collections/page.tsx`)

The top-of-page "Collections" title, "Explore our entire collection." subtext, and the divider line beneath them were removed entirely. The page now opens directly on the first category section ("Copperware").

---

## 158. Collections Page — Desktop Layout Overhaul (`components/items/CollectionItemCard.tsx`)

The desktop grid (`grid-cols-1 lg:grid-cols-2`, two items per row) was replaced with the same single-column alternating layout already used on the Research page (`ResearchItemCard.tsx`), at the client's request to make the two feel consistent.

### Structure
`CollectionItemCard` was split into two fully separate render branches — mirroring the `lg:hidden` / `hidden lg:block` pattern used elsewhere in this codebase (Hero, `ItemCard`, etc.):
- **Mobile** (`lg:hidden`): unchanged square card, image + centered title/Kashmiri title below.
- **Desktop** (`hidden lg:block`, new): 35%/65% image/text split row, direction alternates per item via a new `index` prop (`isOdd = index % 2 === 1` → `flex-row-reverse`).

`app/(public)/collections/page.tsx` was updated to pass `index` to each card and swap the container from `grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12` to `grid grid-cols-1 gap-y-12 lg:block lg:gap-y-0` (desktop becomes plain block flow so the full-width alternating rows can stack, matching Research's `flex flex-col` container).

Per explicit confirmation, the desktop text panel shows **title only** (+ Kashmiri title) — no item description, unlike Research's default card which does show one (see §165 for where these two later converged).

---

## 159. CollectionItemCard — Kashmiri Title Alignment Fix

The Kashmiri title (`dir="rtl"`) was rendering flush to the **right edge** of the 65% text panel, visually disconnected from the English title on the left — caused by the browser's RTL default text-alignment with no override. Fixed by adding `text-left` explicitly, matching the pattern already used on the individual item detail page's card (`ItemCard.tsx`, which has the identical `text-left` override on its own Kashmiri paragraph). Same fix later needed conditional handling once mirrored rows were introduced (§161).

---

## 160. CollectionItemCard — Golden-Ratio Text Positioning

The text panel's vertical alignment was changed from simple `justify-center` to a **golden-ratio split** (61.8% / 38.2%), per client design direction, using two stacked flex zones instead of a single centered block:

```tsx
<div className="w-[65%] flex flex-col px-16 bg-walnut">
  <div style={{ flexBasis: "61.8%" }} className="shrink-0 flex flex-col justify-end">
    <h3 className="...">{item.title}</h3>
  </div>
  <div style={{ flexBasis: "38.2%" }} className="shrink-0 flex flex-col justify-start">
    {item.titleKashmiri && <p className="... mt-1" dir="rtl" lang="ks">{item.titleKashmiri}</p>}
  </div>
</div>
```

- Percentage `flex-basis` resolves against the flex container's height on a column axis (unlike percentage `padding`, which is always relative to *width* — a common CSS pitfall avoided here).
- Top zone (61.8% of the stretched row height, shared with the image via `items-stretch`) holds the English title, bottom-aligned (`justify-end`) so it sits right at the golden-ratio line.
- Bottom zone (38.2%) holds the Kashmiri title, top-aligned (`justify-start`) so it begins right at the line and reads downward.
- Net effect: English title above the line, Kashmiri title below it — confirmed working as intended by the client.

---

## 161. CollectionItemCard — Mirrored Text Alignment for Right-Image Rows

On odd-indexed rows (`isOdd`, image on the right via `flex-row-reverse`), both title lines were still left-aligned within the text panel — landing them on the far side of the row, away from the image, instead of mirroring the left-image layout. Fixed by making both the English `h3` and Kashmiri `p` alignment conditional:

```tsx
className={`... ${isOdd ? "text-right" : "text-left"}`}
```

so text now hugs whichever inner edge is adjacent to the image, regardless of row direction.

**Scope note:** the identical issue exists on `components/items/ItemCard.tsx` (the individual `/category/[slug]/[itemId]` detail page component), which has the same `flex-row-reverse` alternation but a hardcoded `text-left` on its Kashmiri title — flagged during this pass but left unfixed; out of scope for this session.

---

## 162. MobileScrollIndicator — New Component (`components/collections/MobileScrollIndicator.tsx`)

A custom mobile-only scroll thumb was added, modeled on native phone gallery-app scroll indicators (fades in while scrolling, fades out when idle), after `/ui-ux-pro-max`'s CLI search tool failed in this environment (broken git symlinks for `scripts`/`data` under `.claude/skills/ui-ux-pro-max/` on this Windows setup — the loaded Quick Reference guidance was used directly instead: `duration-timing`, `opacity-threshold`, `gesture-conflicts`, `reduced-motion`).

### Behavior
- **Proportional thumb**: height reflects `viewport / documentHeight`, position reflects scroll progress — a real scrollbar thumb, not a generic indicator. `MIN_THUMB = 24px` floor so it's never invisibly thin on very long pages.
- **Fade**: appears immediately on scroll, fades fully to `opacity: 0` after 1s idle (`HIDE_DELAY`), 300ms transition, `motion-reduce:transition-none` for `prefers-reduced-motion`. Deliberately fades all the way rather than lingering at low opacity, per the `opacity-threshold` guideline.
- **Draggable**: implemented via Pointer Events (`onPointerDown` + window-level `pointermove`/`pointerup`/`pointercancel`), translating drag distance into `window.scrollTo()` proportionally to the track/content-height ratio. Dragging pauses the auto-hide timer; releasing resumes it.
- **Touch target**: separate invisible hit-area layer, sized independently from the visible bar — floor of `44px` tall (iterated from 44 → 60 → back to 44 per client feedback) × `48px` wide (`w-12`, iterated up from an initial `w-8`), centered on the thumb's current position. The *track* stays `pointer-events-none` throughout so normal page scrolling anywhere else in that screen column is unaffected; only the small moving hit-area is `pointer-events-auto` + `touch-none`.
- **Visual bar**: thin by default (`w-0.5`, 2px) and grows to `w-1.5` (6px) only while pressed (`pressed` state), `right-1` offset from the true screen edge, terracotta color at 85% opacity (client's choice over a muted stone/cream alternative).
- **Native scrollbar hidden**: only on mobile widths (`max-width: 1023px`) and only while the component is mounted, via a `<style jsx global>` block — Next.js removes this automatically on navigation, so it never leaks to other pages.
- **Track insets**: 80px top/bottom to clear the navbar and `BottomTabBar`.

### Pages it was applied to
Fully generic/self-contained (no props) — dropped into:
- `app/(public)/collections/page.tsx` (where it was designed and locked in first)
- `app/(public)/category/[slug]/page.tsx` (single dynamic route covering all 13 category listing pages)
- `app/(public)/research/page.tsx`
- `app/(public)/research/adaptive-reuse/page.tsx`
- `app/(public)/research/reinterpretation/page.tsx`
- `app/(public)/research/graphic-design/page.tsx`

---

## 163. ItemImageGallery — Arrow Removal, Lightbox Border Fix, Lightbox Thumbnails (`components/items/ItemImageGallery.tsx`)

This single component is shared by the category item detail page (`/category/[slug]/[itemId]`) and all three research item detail pages (`/research/*/[slug]`), so each change below applies uniformly across the whole catalogue and all research sections.

### Arrows removed
The left/right chevron navigation buttons were removed from both the inline main-image gallery and the full-screen lightbox popup (client's explicit choice — "both" over "inline only" when asked, accepting that the lightbox loses in-popup navigation in exchange, since it gained a thumbnail strip in the same pass — see below). Dead code cleaned up alongside: the now-unused `prev`/`next` functions and the `ChevronLeft`/`ChevronRight` imports (the `X` icon import was already unused before this change and was removed too).

### Lightbox border fix
The lightbox appeared to have a brown border framing the image. Root cause: not an actual `border` utility, but the Dialog's own `p-2` padding revealing its `bg-walnut` background around the edges. Fixed by changing the `DialogContent` className from `bg-walnut border-none p-2` to `bg-black border-none shadow-none p-0 gap-0` — image now sits flush against pure black, matching the overlay behind it.

### Lightbox thumbnail strip (new)
Since removing the lightbox's arrows left no way to navigate between images while it was open, a thumbnail strip was added inside the lightbox (below the image), reusing the exact same thumbnail markup as the main page via an extracted `thumbnails(thumbSize)` helper shared between both locations — clicking a thumbnail updates the same `activeIndex` state used by the main view.

---

## 164. ItemImageGallery — Mobile-Only Swipe-to-Navigate

Following the same request pattern as before ("investigate how the existing swipe mechanic works, apply the same mechanic here, mobile only"), the swipe-to-change-image behavior from `components/items/ImageCarousel.tsx` (used on the catalogue/research grid pages) was ported into `ItemImageGallery`, applied to **both** the main page image and the lightbox image.

### Implementation
Copied `ImageCarousel`'s exact `slideVariants`/`transition` constants and touch-delta logic (40px threshold) into `ItemImageGallery`:

```tsx
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};
const transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };
```

Both the main image and the lightbox image were split into a `hidden lg:block` static branch (completely unchanged desktop behavior — no swipe, no animation) and an `lg:hidden` branch wrapped in `AnimatePresence`/`motion.div` with `onTouchStart`/`onTouchEnd` handlers driving a shared `navigate(dir)` function. Thumbnail clicks were also updated to set the swipe `direction` (`index > activeIndex ? 1 : -1`, matching `ImageCarousel`'s `goTo`), so on mobile even a thumbnail tap now animates with the correct slide direction instead of a hard cut — harmless on desktop since that branch never reads `direction`.

Because rendering both breakpoint branches simultaneously (one hidden via CSS) means both `<Image>` instances mount in the DOM, this duplicates image requests across breakpoints — an accepted tradeoff, matching the same pattern already used elsewhere in this codebase (`HeroSection`, `CollectionItemCard`) rather than introducing a new `useMediaQuery`-based conditional-render approach.

---

## 165. Research Page — Card Variant Without Description (`components/items/ResearchItemCard.tsx`, `app/(public)/research/page.tsx`)

The client asked for the `/research` index page's cards to drop their description text and match the Collections card treatment. Since `ResearchItemCard` is shared across four pages (`/research` plus the three individual section pages), scope was confirmed before implementing: **only** the `/research` index page changes; the three section pages (`/research/adaptive-reuse`, `/research/reinterpretation`, `/research/graphic-design`) keep their current centered-title-with-description layout untouched.

### Implementation
Added a `showDescription` prop (default `true`, preserving existing behavior everywhere it isn't explicitly overridden):

```tsx
interface ResearchItemCardProps {
  item: ResearchItem;
  sectionSlug: string;
  index: number;
  showDescription?: boolean;
}
```

When `showDescription={false}` (passed only from `app/(public)/research/page.tsx`), the desktop text panel branches to the same golden-ratio structure introduced for Collections in §160 — no description, mirrored `text-right`/`text-left` alignment on alternating rows (§161's fix, ported here too) — instead of the default `justify-center` + description layout.

### Golden-ratio line-through-title adjustment
After implementing, the title sat entirely *above* the golden-ratio line (bottom-edge-aligned to it, per §160's original design). The client asked for the line to instead pass through the vertical *middle* of the title text. Fixed with a simple transform on the title itself:

```tsx
<h3 className="... translate-y-1/2 ...">{item.title}</h3>
```

`translateY(50%)` shifts the element down by half of its own rendered height — since it was previously bottom-anchored exactly at the line, this centers the text vertically across the boundary instead of sitting fully above it. Scoped only to the `showDescription={false}` branch (Collections cards were not asked to receive this adjustment and remain bottom-anchored at the line).

---

## 166. Key Files Modified (Thirty-First Build)

| File | Change type |
|------|-------------|
| `app/(public)/collections/page.tsx` | Page header (title/subtitle/divider) removed; `index` passed to cards; container switched from 2-col grid to block flow for the new alternating desktop layout |
| `components/items/CollectionItemCard.tsx` | Desktop split into alternating 35/65 layout (new `index` prop); Kashmiri title `text-left` fix; golden-ratio (61.8%/38.2%) text positioning; mirrored `text-right`/`text-left` alignment for right-image rows |
| `components/collections/MobileScrollIndicator.tsx` | **New file** — proportional, draggable, auto-fading mobile scroll thumb; native scrollbar hidden while mounted |
| `app/(public)/category/[slug]/page.tsx` | `MobileScrollIndicator` added |
| `app/(public)/research/page.tsx` | `MobileScrollIndicator` added; `ResearchItemCard` now passed `showDescription={false}` |
| `app/(public)/research/adaptive-reuse/page.tsx` | `MobileScrollIndicator` added |
| `app/(public)/research/reinterpretation/page.tsx` | `MobileScrollIndicator` added |
| `app/(public)/research/graphic-design/page.tsx` | `MobileScrollIndicator` added |
| `components/items/ItemImageGallery.tsx` | Left/right arrows removed (inline + lightbox); lightbox `p-2`/`bg-walnut` border fixed to flush black; thumbnail strip added inside lightbox; mobile-only swipe-to-navigate added to both main image and lightbox (desktop unchanged); dead `prev`/`next`/unused icon imports cleaned up |
| `components/items/ResearchItemCard.tsx` | New `showDescription` prop (default `true`); golden-ratio no-description branch added for `/research` index use; title `translate-y-1/2` so the golden-ratio line passes through its vertical center |

---

# Thirty-Second Build Session — Addendum

**Date:** 2026-08-12
**Scope:** Page-navigation loading feedback (pulsing bowl-mark overlay), horizontal-carousel scroll-position restoration on browser back navigation

---

## 167. Navigation Loading Feedback — Design Discussion

The client reported that clicking a nav link gave zero feedback until the next page abruptly appeared, leaving an "did my click register?" feeling. Per instruction, options were discussed before writing any code, grounded in `/ui-ux-pro-max`'s loaded Quick Reference (the skill's CLI search tool again hit the same broken-symlink issue as prior sessions — `scripts`/`data` under `.claude/skills/ui-ux-pro-max/` are unmaterialized git symlinks on this Windows setup).

### Two-layer feedback model
Per `tap-feedback-speed` (feedback within ~100ms of a tap) and `loading-states` (only show a spinner/progress indicator past ~300ms, to avoid flashing on fast navigations), the two concerns don't resolve to one indicator: an instant acknowledgment layer and a separate, delay-gated loader layer.

### Mechanism options presented
1. **Next.js native `loading.tsx`** — framework-native Suspense-boundary swap, automatic show/hide tied to real route-render latency, zero click-listening code. Chosen first.
2. **Custom click-intercept overlay** — shows the instant a link is clicked rather than waiting on route rendering; more code (must correctly ignore hash links, external links, new-tab clicks, back/forward) but guarantees click-tied timing.
3. Top progress bar (YouTube/GitHub-style) — named as the common alternative convention, not pursued since the client wanted a centered element.

### Visual options presented for the loader itself
Discussed generic spinner vs. text-only ("Loading...") vs. an animated version of the existing bowl logo mark (`Logo.png`, already used in navbar/hero) — client chose the animated bowl mark for on-brand consistency, then asked specifically for the animation-treatment options for that mark:
1. Scale + opacity pulse ("breathing") — **chosen**
2. Scale pulse only
3. Opacity pulse only
4. Continuous rotation (flagged as risky since the mark isn't rotationally symmetric)
5. Stroke "draw-on" shimmer (flagged as needing an SVG source, which doesn't exist — `Logo.png` is raster)

---

## 168. First Implementation — `app/(public)/loading.tsx` (superseded, see §169)

Initial implementation used Next.js's native per-route-group loading file:

```tsx
"use client";
export default function Loading() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="min-h-screen flex items-center justify-center bg-walnut">
      <motion.div
        animate={prefersReducedMotion ? { opacity: 0.8 } : { scale: [0.9, 1.05, 0.9], opacity: [0.4, 1, 0.4] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/Logo.png" alt="Loading" width={240} height={240} className="h-24 w-auto" priority />
      </motion.div>
    </div>
  );
}
```

Placed at the `(public)` route-group level so it covered every public-site navigation via one file, since most pages here use `dynamic = "force-dynamic"` and genuinely await Firestore reads — real latency for Suspense to catch.

### Why this was replaced
After seeing it, the client wanted the loading icon to appear **over the still-visible current page** (optionally dimmed) rather than on a separate blank loading screen — impossible with `loading.tsx`, since React Suspense *replaces* the segment's content rather than compositing on top of the previous page. This requires an entirely different mechanism (a persistent overlay component decoupled from route rendering), so `loading.tsx` was deleted in favor of §169's approach, after confirming with the client that having two different-looking loading mechanisms active simultaneously wasn't wanted.

---

## 169. Final Implementation — `components/layout/NavigationLoadingOverlay.tsx`

A global click-intercept overlay, mounted once in `app/(public)/layout.tsx` (alongside Navbar/Footer, so it persists across navigations rather than unmounting/remounting with page content) rather than per-page.

### Click detection
A single `document`-level click listener determines whether a click should trigger the overlay:
- Left-click only (`e.button === 0`), no modifier keys held (so ctrl/cmd/shift-click to open in a new tab is left alone)
- Target resolves to an `<a>` via `closest("a")`
- Skips `target="_blank"` and `download` links
- Same-origin only (parses `anchor.href` as a `URL`, compares `.origin`)
- Skips same-page navigations, including pure hash-only jumps (compares `pathname` + `search` against `window.location`)

### Root-cause bug: nothing appeared on click
The very first version included `if (e.defaultPrevented || e.button !== 0) return;` as an early guard, intended to skip clicks some other handler had already fully handled. In practice this broke the entire mechanism: Next.js's `<Link>` component calls `e.preventDefault()` to intercept the browser's default navigation and route client-side instead — and since the overlay's listener was registered for the *bubble* phase (fires last, after Link's own handler has already run), `e.defaultPrevented` was `true` on every single qualifying Link click by the time the overlay's handler executed, causing it to bail out immediately before ever calling `setLoading(true)`.

**Fix:** removed the `e.defaultPrevented` check, and switched the listener to the *capture* phase (`{ capture: true }`), which fires before any bubble-phase handler — including Link's own — making the ordering issue structurally impossible to hit again regardless of what other click handlers exist on the page.

### Behavior
- **Dimmed scrim**: `fixed inset-0 z-[100] bg-black/50`, sitting above the navbar (`z-50`) and everything else, fading in over 150ms — fast enough to register as an instant response (per `tap-feedback-speed`) without being a jarring hard-cut. Per client's explicit choice, the old page is dimmed rather than left fully undimmed underneath.
- **Pulsing bowl mark**: same scale (90%↔105%) + opacity (40%↔100%) breathing loop from §168's abandoned `loading.tsx`, carried over unchanged, `prefers-reduced-motion` respected.
- **Hide condition**: tracked via `usePathname()` — clears once the pathname actually changes, signaling the new page has mounted. (`useSearchParams()` was deliberately not used for this, since it requires wrapping the component in a `<Suspense>` boundary for static rendering in the App Router, and this site has no query-string-driven pages that would need it — pathname alone is sufficient here.)
- **Safety timeout**: 8s auto-hide fallback in case a navigation stalls or is cancelled without a pathname change, so the overlay can never get permanently stuck.

---

## 170. Horizontal Carousel Scroll-Position Restoration on Back Navigation

### Problem
Reported via a concrete repro: on the homepage, scroll the "Collections" horizontal carousel over, click a category card (e.g. "Shawls") to navigate to `/category/shawls`, then use the browser's back button. The page's vertical scroll position was correctly preserved, but the carousel's own horizontal scroll position reset to the start.

### Root cause
The browser's native scroll restoration only tracks the document's `scrollY`. It has no concept of restoring an arbitrary nested `overflow-x-auto` element's `scrollLeft`. Compounding this, these pages use `dynamic = "force-dynamic"`, so back-navigating to the homepage triggers a genuine fresh server fetch and component remount rather than reusing a cached React tree instance — the carousel's DOM node is a brand-new element with `scrollLeft: 0` by default, not merely a hidden/revealed existing one.

### Fix — `hooks/useScrollPositionRestore.ts` (new shared hook)
```ts
export function useScrollPositionRestore(ref: RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const stored = sessionStorage.getItem(key);
    if (stored !== null) el.scrollLeft = parseInt(stored, 10) || 0;

    let frame: number;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => sessionStorage.setItem(key, String(el.scrollLeft)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
      sessionStorage.setItem(key, String(el.scrollLeft));
    };
  }, [key]);
}
```
- **Restore** happens in `useLayoutEffect` (before paint) rather than `useEffect`, avoiding a visible snap-from-zero flash.
- **Save** happens continuously on scroll (throttled via `requestAnimationFrame`) and again on unmount, so the position is captured at the moment of navigating away regardless of exactly when the component tears down.
- `sessionStorage` chosen over `localStorage` — scroll memory should last for the browsing session, not persist permanently across browser restarts.

### Scope
Client confirmed this should apply to **both** homepage horizontal carousels, not just the Collections one from the repro — `components/home/ResearchHighlights.tsx` has the identical `scrollContainerRef`/`overflow-x-auto` structure and would have had the same bug. Wired in with distinct sessionStorage keys (`categoryHighlightsScrollLeft` / `researchHighlightsScrollLeft`) so the two carousels don't clobber each other's saved position.

---

## 171. Key Files Modified (Thirty-Second Build)

| File | Change type |
|------|-------------|
| `components/layout/NavigationLoadingOverlay.tsx` | **New file** — global click-intercept navigation loading overlay (dimmed scrim + pulsing bowl mark), replaces the abandoned `loading.tsx` approach |
| `app/(public)/layout.tsx` | `NavigationLoadingOverlay` mounted alongside Navbar/Footer |
| `app/(public)/loading.tsx` | **Deleted** — superseded by `NavigationLoadingOverlay` |
| `hooks/useScrollPositionRestore.ts` | **New file** — sessionStorage-backed horizontal scroll position save/restore hook |
| `components/home/CategoryHighlights.tsx` | `useScrollPositionRestore` wired to the horizontal carousel (`categoryHighlightsScrollLeft`) |
| `components/home/ResearchHighlights.tsx` | `useScrollPositionRestore` wired to the horizontal carousel (`researchHighlightsScrollLeft`) |

---

# Thirty-Third Build Session — Addendum

**Date:** 2026-08-12
**Scope:** New "Featured" homepage carousel — full admin-managed content type (data layer, API, admin CRUD + reorder UI, public 3D coverflow component) modeled on the existing Research Items pattern; an unrelated local-only admin login investigation; carousel visual fine-tuning

---

## 172. Featured Panel — Requirements & Template Adaptation

The client provided a third-party component-library template (a 3D "coverflow" style image carousel — center slide large and sharp, adjacent slides smaller/faded/rotated in 3D perspective via CSS `perspective`/`rotateY`, auto-advancing every 4s) along with its own AI-generated integration instructions (shadcn setup steps, a `HeroSection` component, a `Button` copy-paste, npm install list). Requirements given: no title/subtitle text (image-only carousel), square 1:1 images instead of the template's portrait ones, and a new admin panel section for the client to manage the images themselves.

### Setup findings (before writing any code)
Investigated the template's stated prerequisites against the actual project and found **none of them were needed** — `components/ui/button.tsx`, `lib/utils.ts` (`cn`), `lucide-react`, `@radix-ui/react-slot`, and `class-variance-authority` were all already present (installed for existing shadcn components like `Dialog`).

Two real problems were found and had to be designed around rather than copy-pasting the template as-is:
1. **The template's nav buttons would have rendered invisible.** Its `<Button variant="outline">` and background styling rely on shadcn's semantic color tokens (`bg-background`, `border-input`, `bg-accent`, `ring-ring`, `border-foreground/10`). Checked `app/globals.css` and confirmed this project never defined those CSS variables — only the custom brand tokens (`--color-terracotta`, `--color-walnut`, etc.) exist in the `@theme` block. Those shadcn utility classes are no-ops here. Fixed by building custom nav buttons from scratch using the project's own established arrow-button visual language (already used on the Collections/Research horizontal carousels): `bg-black/40 hover:bg-black/60 text-cream hover:text-terracotta`.
2. **Naming collision.** The template names its component `HeroSection` — this project already has a real, unrelated `components/home/HeroSection.tsx` (the scroll-jacking bowl-to-logo hero). The new component was named `FeaturedCarousel` instead.

Also stripped the template's `min-h-screen` full-viewport hero sizing — this needed to be a compact panel slotted into an existing gap on the homepage, not a new full-screen section. Per explicit client clarification mid-discussion: *"this panel should not occupy all the vertical space on the screen, take as much vertical space as the images need to comfortably display with padding above and below for immersion."*

### Design decisions confirmed before implementation
- Auto-rotate every 4s: **kept** (matches template)
- Admin reordering: **yes**, same drag-and-drop pattern as Research Items
- Background glow blobs (template had generic purple/blue): **kept, restyled** in brand colors — initially terracotta/saffron, later changed to cream (see §176)

---

## 173. Featured Panel — Backend Investigation & Data Layer

Before writing any new code, a background research pass (via a subagent) traced the *exact* existing Research Items admin CRUD + reorder implementation end to end — data layer, API routes, auth, image upload flow, admin UI, drag-and-drop library — so "Featured" could mirror it precisely rather than invent a parallel pattern. Findings confirmed:
- **Firebase Admin SDK data layer split**: a public accessor (`lib/firebase/research.ts`, with a local-fallback path when Firebase env vars aren't configured) delegating to an Admin-SDK-only module (`lib/firebase/admin-research.ts`) for actual reads/writes — never the client SDK for writes.
- **Auth**: every `/api/admin/*` route re-verifies a Firebase ID token per-request via `verifyAdminRequest()` (`lib/admin-auth.ts`), sent as `Authorization: Bearer <idToken>` from the client (no server session cookie for API calls — the `admin-session` cookie is only used by `middleware.ts` to gate page navigation to `/admin/*`).
- **Image upload**: goes through a dedicated `/api/admin/upload` route (not direct client→Storage) — browser sends `FormData` with the file + a target path, the server reads the bytes and writes via `bucket.file(path).save()` with `predefinedAcl: "publicRead"`, returning a public `storage.googleapis.com` URL that gets stored as a plain string.
- **Reorder**: `@dnd-kit/core` + `@dnd-kit/sortable` (not react-beautiful-dnd or native HTML5 DnD), with a "Save Order" button POSTing the full reordered `{id, order}[]` array to a dedicated `reorder` route, zod-validated server-side.

Given Featured content is simpler than Research (no title, description, section, or slug — just one square image per entry), the content model was deliberately simplified rather than mirrored 1:1:

```ts
// types/index.ts
export interface FeaturedItem {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}
```
Firestore collection: `featured_items`. `lib/firebase/admin-featured.ts` mirrors `admin-research.ts`'s CRUD/reorder/storage-cleanup-on-delete functions exactly, minus the section/slug-scoped queries Research needs. `lib/firebase/featured.ts` (public accessor) skips Research's hardcoded local-fallback dataset entirely — since there's no meaningful placeholder content for "Featured," it just returns `[]` when Firebase isn't configured.

---

## 174. Featured Panel — API Routes & Admin UI

**API routes** (`app/api/admin/featured/`): `route.ts` (GET list / POST create), `[id]/route.ts` (DELETE only — no PUT, since there's nothing on an existing entry to edit besides the image itself), `reorder/route.ts` (POST, zod-validated) — same `verifyAdminRequest` guard pattern as Research on every route.

**Admin UI — deliberately lighter than Research's pattern**, since a Featured entry has exactly one field (an image) and nothing else to fill in:
- **No separate `/new` or `/[id]` edit pages.** Instead, `/admin/featured` (`FeaturedClient.tsx`) doubles as both the list *and* the add flow: an "Add Image" upload control sits directly on the list page (reusing the existing shared `ImageUploadField` component in `single` mode) and immediately creates a new Firestore entry on successful upload; each existing image renders as a thumbnail with a hover "Remove" button that calls delete directly. Storage path uses an incrementing `uploadKey` state (`featured/temp-${uploadKey}-${Date.now()}`) to force a fresh path/component instance after each successful create, avoiding path collisions across sequential uploads in one session.
- `/admin/featured/reorder` (`ReorderFeaturedClient.tsx`) mirrors `ReorderResearchClient.tsx`'s dnd-kit drag list exactly, minus the section-tab filtering layer Research needs (Featured is a flat list) — each row shows just a thumbnail + "Image N" label (no title text exists to show).
- Added to `components/layout/AdminSidebar.tsx` under "Home Page" (using the `Images` lucide icon), since it's homepage-related content.

---

## 175. FeaturedCarousel — Public Component

`components/home/FeaturedCarousel.tsx` — the adapted 3D coverflow, preserving the template's core positioning math (`offset`/`pos`/`scale`/`rotateY`/`opacity`/`blur`/`zIndex` per slide) unchanged, since that's the visual mechanic the client specifically wanted, restyled around it:
- No title/subtitle — props reduced to just `images: string[]`
- Square slide boxes instead of portrait (`w-* h-*` matched pairs at every breakpoint, vs. the template's differing width/height)
- Custom nav buttons (not shadcn `Button`) per §172's finding — hidden entirely via `images.length > 1` check rather than shown disabled when there's 0-1 images
- Returns `null` when `images.length === 0`, so the whole panel stays invisible on the homepage until the client actually uploads something
- Sized to content, not full-viewport: `py-16 md:py-20` padding, showcase height fixed per breakpoint rather than `min-h-screen`

### Wiring into the homepage
Placed inside `CategoryHighlights.tsx`, between the vessel image and the "Collections" title/subtitle — the exact gap identified in the "empty space above the image" investigation earlier in this session (§157-161). Data flows `app/(public)/page.tsx` (`getFeaturedItems()` → `.map(i => i.imageUrl)`) → `HomePageClient.tsx` (new `featuredImages` prop) → `CategoryHighlights.tsx` (new `featuredImages` prop, passed to `<FeaturedCarousel />`).

---

## 176. FeaturedCarousel — Visual Fine-Tuning Pass

A rapid iteration pass once the feature was live end-to-end (upload → reorder → homepage display all verified working):

1. **Background color**: added `bg-[#0a0a0a]` to the wrapper — matches the existing near-black tone already used elsewhere on this page (the Collections horizontal scroll track), rather than a generic `bg-black`, so the panel reads as a distinct section instead of blending into the surrounding `bg-[#1a130a]`.
2. **Full-width background**: the panel was initially still nested inside `CategoryHighlights`' `max-w-6xl mx-auto px-4...` header container, so its black background was confined to that column width with the surrounding brown visible on both sides. Fixed by restructuring — split the single `max-w-6xl` + `ScrollReveal` block into three siblings: vessel image (own `max-w-6xl`/`ScrollReveal`), `FeaturedCarousel` (full-width, own `ScrollReveal`, no width constraint), title/subtitle/divider (own `max-w-6xl`/`ScrollReveal`). Matches the same "move it outside the padded wrapper" technique already used for Our Story's mobile image (§14) rather than a CSS negative-margin full-bleed hack.
3. **Spacing below the panel**: `mb-10` added to the `ScrollReveal` wrapping `FeaturedCarousel`, separating the black panel from the "Collections" title below.
4. **Desktop sizing** (`lg:` only, iterated twice on request): slide boxes `72`→`96`→`28rem` (288px → 384px → 448px); showcase container height `96`→`26rem`→`32rem` (384px → 416px → 512px). Side-slide spacing needed no separate adjustment since `translateX(45%)` is a percentage of the slide's own width, so it scales proportionally with the size increases automatically.
5. **Mobile sizing** (base/unprefixed, affecting <640px): showcase height `h-64`→`h-72` (256px→288px, left unchanged in the final image-size-only pass per client request); slide boxes iterated `48`→`56`→`64`→`270px`→`300px` (192px → 224px → 256px → 270px → 300px). At each step, `sm:` was bumped to match the new base value to avoid the image visibly *shrinking* right at the 640px breakpoint boundary (a regression that would've been introduced if base grew past the old `sm:` value without updating it). Final 300px mobile image is 12px taller than the `h-72` (288px) showcase container itself — absorbed harmlessly by the wrapper's own `py-16` padding rather than clipping, since only the outer wrapper (not the inner showcase div) has `overflow-hidden`.
6. **Glow color**: changed from the initial terracotta/saffron pair (`rgba(181,112,49)` / `rgba(212,160,23)`) to cream (`rgba(248,232,210)`) for both blobs, applied identically on mobile and desktop (the glow markup has no breakpoint-specific classes).

---

## 177. Admin Login Investigation (Local-Only, Unrelated to Featured Panel Code)

Client reported being unable to log into `/admin` on `localhost` while login worked fine on the production domain (`traamandbeyond.com`), suspecting the Featured Panel changes (not yet pushed to GitHub) were the cause.

### Investigation
Systematically ruled out every file touched this session (`git status` confirmed only `types/index.ts`, `AdminSidebar.tsx`, `lib/admin-api.ts`, `app/(public)/page.tsx`, `CategoryHighlights.tsx`, `HomePageClient.tsx`, plus new files under `app/api/admin/featured/` and `app/(admin)/admin/featured/` — none in the auth path), then read through the actual login flow (`app/(admin)/login/page.tsx`, `context/AdminAuthContext.tsx`, `middleware.ts`, `next.config.ts`'s security headers) and confirmed none of it was modified, and no CSP or header configuration was blocking Firebase's network requests.

The login page's `catch` block unconditionally showed a generic **"Invalid email or password."** message regardless of the actual error — masking the real cause. A temporary `console.error(err)` was added to `app/(admin)/login/page.tsx`'s catch block to surface it (removed again once diagnosed, per §178).

Browser DevTools Network tab showed the real signal: a request to `identitytoolkit.googleapis.com/v1/accounts:signInWithPassword` (with a well-formed, present API key) returning **400 `INVALID_LOGIN_CREDENTIALS`** — a genuine rejection from Firebase's own servers, not a missing-config or blocked-request issue. `.env.local` was confirmed by the client to have all `NEXT_PUBLIC_FIREBASE_*` values filled in.

### Root cause
Not a code or config issue at all — both the email and password fields showed Chrome's blue autofill highlighting. **Chrome saves passwords per-origin**, and `localhost:3000` is a distinct origin from `traamandbeyond.com`. A different (stale/incorrect) password had been saved for the `localhost` origin at some point, and Chrome kept autofilling that one, while the production domain had its own separately-saved correct password. Manually typing the password instead of accepting the autofill resolved it immediately.

---

## 178. Key Files Modified (Thirty-Third Build)

| File | Change type |
|------|-------------|
| `types/index.ts` | Added `FeaturedItem` interface |
| `lib/firebase/admin-featured.ts` | **New file** — Admin SDK CRUD + reorder + storage cleanup, mirrors `admin-research.ts` |
| `lib/firebase/featured.ts` | **New file** — public accessor, empty-array fallback when Firebase isn't configured |
| `app/api/admin/featured/route.ts` | **New file** — GET (list) / POST (create) |
| `app/api/admin/featured/[id]/route.ts` | **New file** — DELETE |
| `app/api/admin/featured/reorder/route.ts` | **New file** — POST, zod-validated |
| `lib/admin-api.ts` | Added `apiCreateFeaturedItem` / `apiDeleteFeaturedItem` client wrappers |
| `app/(admin)/admin/featured/page.tsx` | **New file** — list page (server component) |
| `app/(admin)/admin/featured/FeaturedClient.tsx` | **New file** — inline upload + thumbnail grid with delete, no separate add/edit pages |
| `app/(admin)/admin/featured/reorder/page.tsx` | **New file** — reorder page (server component) |
| `app/(admin)/admin/featured/reorder/ReorderFeaturedClient.tsx` | **New file** — dnd-kit drag-and-drop reorder, flat list (no section tabs) |
| `components/layout/AdminSidebar.tsx` | Added "Featured" nav link (`Images` icon) |
| `components/home/FeaturedCarousel.tsx` | **New file** — adapted 3D coverflow carousel; multiple fine-tuning passes on background color/width, spacing, responsive sizing, and glow color (see §176) |
| `app/(public)/page.tsx` | `getFeaturedItems()` fetched, `featuredImages` prop passed down |
| `components/home/HomePageClient.tsx` | `featuredImages` prop threaded through to `CategoryHighlights` |
| `components/home/CategoryHighlights.tsx` | Header split into three siblings (image / carousel / title blocks) so the carousel can be full-width; `FeaturedCarousel` wired in with `mb-10` spacing |
| `app/(admin)/login/page.tsx` | Temporary debug `console.error` added then removed during the login investigation (§177) — no net change |

---

# Thirty-Fourth Build Session — Addendum

**Date:** 2026-08-12
**Scope:** FeaturedCarousel follow-up tuning — background color reversal, further desktop size increases, and removing the opaque card frame so transparent cutout PNGs float without a visible border/shadow

---

## 179. FeaturedCarousel — Background Color Reversed to Match the Page

§176 had changed the wrapper from the surrounding section's `#1a130a` to a distinct near-black `#0a0a0a` so the panel would read as its own section. After seeing it live, the client reversed this decision — wanted it to blend with the page instead of standing apart. Changed `bg-[#0a0a0a]` → `bg-[#1a130a]`, exactly matching `CategoryHighlights`' own section background once again.

---

## 180. FeaturedCarousel — Further Desktop Size Increases

Continued the desktop-only (`lg:`) sizing iteration from §176 across four more rounds, each keeping the same ~64px margin between the slide box and its showcase container established in §176:

| Round | Slide size | Showcase height |
|-------|-----------|------------------|
| (§176 end state) | `28rem` (448px) | `32rem` (512px) |
| +1 | `32rem` (512px) | `36rem` (576px) |
| +2 ("a little more") | `34rem` (544px) | `38rem` (608px) |
| +3 ("by 4rem") | `38rem` (608px) | `42rem` (672px) |

Mobile/tablet sizing (base, `sm:`, `md:`) untouched throughout — all changes scoped to `lg:` only, per instruction each round.

---

## 181. FeaturedCarousel — Removed Opaque Card Frame for Transparent PNGs

Client's actual production images are PNGs with backgrounds removed (transparent cutouts), and reported a visible "opaque frame" around each floating object — a rounded square with a border and shadow showing through even though the image itself had no background.

### Root cause
The per-slide image wrapper had `rounded-3xl overflow-hidden border-2 border-cream-dark/20 shadow-2xl` — a card-style frame that renders regardless of the image content, since it's drawn on the *container div*, not derived from the image's actual alpha shape. Combined with `object-cover` (which fills/crops to the square bounding box), this produced a visible bordered, shadowed square card around every image — fine for opaque photography (the original test images), but wrong for the client's actual background-removed art direction, where the object itself should appear to float with nothing framing it.

### Fix
```tsx
// Before
<div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-cream-dark/20 shadow-2xl">
  <Image ... className="object-cover" />
</div>

// After
<div className="relative w-full h-full">
  <Image ... className="object-contain" />
</div>
```
Removed the rounded corners, border, `overflow-hidden`, and drop shadow entirely, and switched `object-cover` → `object-contain` so a non-square or off-center transparent PNG isn't cropped to fill the box — the isolated object now renders directly against the panel's own background with no frame of any kind.

---

## 182. Key Files Modified (Thirty-Fourth Build)

| File | Change type |
|------|-------------|
| `components/home/FeaturedCarousel.tsx` | Background reverted to `#1a130a` (matches page); desktop (`lg:`) slide/showcase sizing increased across four rounds (448px → 608px slide, 512px → 672px showcase); card frame (rounded corners, border, shadow) removed and `object-cover` → `object-contain`, so transparent cutout PNGs float without an opaque frame |

---

# Thirty-Fifth Build Session — Addendum

**Date:** 2026-08-12
**Scope:** FeaturedCarousel auto-rotate interval tuning

---

## 183. FeaturedCarousel — Auto-Rotate Interval Tuned

The `setInterval(handleNext, ...)` driving auto-rotation (originally 4000ms, the template's default kept as-is per §172's design decisions) was iterated down in a quick round of requests: 4000ms → 3000ms → 2000ms → settled at **2500ms**. Each change was a single-line edit to the interval constant in `components/home/FeaturedCarousel.tsx`; no other carousel behavior (transition duration, drag/swipe, reorder, etc.) was touched.

---

## 184. Key Files Modified (Thirty-Fifth Build)

| File | Change type |
|------|-------------|
| `components/home/FeaturedCarousel.tsx` | Auto-rotate interval changed from 4000ms to 2500ms |

---

# Thirty-Sixth Build Session — Addendum

**Date:** 2026-08-16
**Scope:** New `/stories` page — full admin-managed content type (data layer, API, admin CRUD + reorder UI) modeled on Research/Featured, plus a bespoke desktop 3-column reading layout (sticky no-scrollbar table of contents with hover spotlight preview, continuous reading column, sticky crossfading image panel) and a mobile stacked layout with a slide-out contents drawer. Extensive iterative tuning of the hover-preview interaction based on visual feedback.

---

## 185. Stories — Data Layer & Admin Backend

New content type, `StoryItem`, added to `types/index.ts`:
```ts
export interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  body: string;   // paragraphs separated by a blank line in the admin textarea
  image: string;  // single image URL
  order: number;
  createdAt: string;
}
```

Backend built by mirroring the Research/Featured pattern exactly (flat collection, no section/slug scoping since Stories — unlike Research — isn't grouped):
- `lib/firebase/admin-stories.ts` (**new**) — Admin SDK CRUD against a new `stories` Firestore collection: `adminGetAllStories()` (orderBy `order` asc), `adminCreateStory()`, `adminUpdateStory()`, `adminReorderStories()` (batch write), `adminDeleteStory()` (delete doc + best-effort Storage cleanup at `stories/${id}/`).
- `lib/firebase/stories.ts` (**new**) — public accessor; `getAllStories()` returns `[]` when Firebase isn't configured, otherwise dynamic-imports `admin-stories.ts` (server-components-only, same rationale as `featured.ts`).
- `app/api/admin/stories/route.ts` (GET/POST), `app/api/admin/stories/[id]/route.ts` (PUT/DELETE), `app/api/admin/stories/reorder/route.ts` (POST, zod-validated) — all `verifyAdminRequest`-guarded, identical shape to the Research/Featured API routes.
- `lib/admin-api.ts` — added `apiCreateStory`, `apiUpdateStory`, `apiDeleteStory` client wrappers (reorder POSTs directly from the reorder client component, matching the existing Featured/Research precedent rather than being wrapped here).

---

## 186. Stories — Admin UI

Mirrors the Research admin section (list + dedicated new/edit form pages + reorder page), not the lighter inline-only Featured pattern, since a story has enough fields (heading, sub-heading, long body, image, order) to warrant a real form:

- `components/layout/AdminSidebar.tsx` — "Stories" nav link added (between Research and Enquiries), `NotebookText` icon.
- `app/(admin)/admin/stories/page.tsx` + `StoriesClient.tsx` — list page (`force-dynamic`) with a table (thumbnail / heading / sub-heading / Edit / Delete), "Reorder Stories" and "Add Story" buttons.
- `app/(admin)/admin/stories/DeleteStoryButton.tsx` — confirm + delete, mirrors `DeleteResearchItemButton.tsx`.
- `app/(admin)/admin/stories/new/page.tsx` and `[id]/page.tsx` — render `<StoryForm>` / `<StoryForm existing={...}>`.
- `components/forms/StoryForm.tsx` (**new**) — react-hook-form + zod (same `as any` casts for Zod v4/hookform v5 as `ResearchItemForm.tsx`/`CategoryForm.tsx`): Heading `Input`, Sub-heading `Input`, Story Body `Textarea` (`rows={16}`, helper text "Separate paragraphs with a blank line."), Display Order `Input`, single-image `ImageUploadField` (`single` prop, same pattern as `FeaturedClient.tsx`).
- `app/(admin)/admin/stories/reorder/page.tsx` + `ReorderStoriesClient.tsx` — dnd-kit flat drag list (thumbnail + title per row), mirrors `ReorderFeaturedClient.tsx` structurally but shows the story's actual title (Featured items have no title field to show).

---

## 187. Stories — Public Page Architecture

`app/(public)/stories/page.tsx` converted from the "Coming soon." placeholder to an async server component: `getAllStories()` → passed into a new client orchestrator. `force-dynamic`, matching the other Firestore-backed public pages.

New directory `components/stories/`:

### `StoryBlock.tsx`
Ports the About page's `TextBlock` scroll-linked mechanics (`components/about/OurStoryTimeline.tsx`) verbatim: a ref + two `useInView` calls — `isCentered` (`margin: "-45% 0px -45% 0px"`) drives the active index, `isNearTop` (`margin: "0px 0px -90% 0px"`) drives the image-swap index, with the same `scrollDirRef` up/down tracking so the image-swap trigger point is identical scrolling in either direction. Registers itself into a parent-held `blockRefs` array via a ref-registration callback (rather than DOM-id lookups) so the TOC and mobile drawer can `scrollIntoView()` directly. Content order: heading → subtitle → `lg:hidden` inline image → body paragraphs (`body.split(/\n{2,}/)`).

Unlike the About page, **no sticky-background spacer-div choreography is needed** — because on desktop the image lives in its own real grid column rather than as a full-bleed layer behind the text, so `StoryBlock` is just a plain document-flow block. This also means **only one copy of `StoryBlock` is ever rendered** (not duplicated per breakpoint) — the surrounding container is a CSS Grid at `lg:` and plain block flow below it, so the same list of blocks naturally reads as "TOC | main | image panel" on desktop and a plain single column (image inline per story) on mobile. An earlier draft rendered two separate `StoryBlock` trees gated by `lg:hidden`/`hidden lg:grid` (matching the `HeroSection`/`CollectionItemCard` breakpoint-duplication convention used elsewhere in the codebase) — this was reworked before shipping once it became clear that pattern would double up every story's `useInView` hooks and, more importantly, silently break click-to-scroll on mobile (the always-mounted, always-`display:none`-at-mobile-width desktop copy would win the `blockRefs` registration race and leave the visible mobile blocks unreachable).

### `StoriesTOC.tsx` (desktop only, `hidden lg:block`)
Sticky (`top-24 h-[calc(100vh-7rem)]`), internally-scrolling (`overflow-y-auto`, scrollbar hidden via the site's established `[&::-webkit-scrollbar]:hidden` + `scrollbarWidth:"none"` convention), rows = organic dot (same SVG as the About page timeline) + heading, `onMouseEnter`/`onMouseLeave` driving a `hoveredIndex` lifted to the parent (`StoriesPageClient`) so it can also drive the page-wide blur scrim. Click → `scrollIntoView`.

### `StoriesImagePanel.tsx` (desktop only, `hidden lg:block`, right column)
Sticky column, `relative aspect-square` stack of `<Image fill>` per story crossfading via `opacity` + `transition-opacity duration-1000`, keyed off the shared `imageIndex` — same technique as the About page's sticky background stack, just confined to a real column instead of full-bleed.

### `StoriesMobileDrawer.tsx` (mobile only, `lg:hidden`)
Fixed top-right button opens a panel that scale-grows from the top-right corner (`transformOrigin: "top right"`, `scale: 0.3 → 1`) over a `backdrop-blur-md` scrim, heading-only rows staggering in (`staggerChildren: 0.04`) via Framer Motion `variants`. Tap a heading → `scrollIntoView` + close.

### `StoriesPageClient.tsx` (top-level orchestrator)
Owns `activeIndex`, `imageIndex`, `hoveredIndex`, `drawerOpen`, `scrollDirRef`, `blockRefs`. Desktop container is `lg:grid` (TOC | main | image panel, each its own explicit grid track); mobile is plain block flow with `StoriesMobileDrawer` + the single shared `StoryBlock` list.

---

## 188. Stories — Hover-Preview Interaction: Iterative Fixes

The left TOC's hover behavior (title shifts right, subtitle reveals beneath it, a thumbnail appears, rest of the page blurs) went through several rounds of visual-feedback-driven fixes after initial implementation.

### Bug 1 — floating thumbnail invisible (Tailwind/Framer Motion transform conflict)
First implementation positioned the hover thumbnail as a `motion.div` combining a Tailwind transform utility class (`-translate-y-1/2`, for vertical centering) with Framer-Motion-animated `x`/`scale` props on the *same element*. Framer Motion writes its own inline `transform` style when animating `x`/`scale`, which completely overwrites whatever `transform` a CSS class had set — so the element lost its `translateY(-50%)` centering and rendered off-position (effectively invisible in the visible viewport area). **Fix:** split positioning from animation onto two nested elements — a static, non-animated outer wrapper carries the Tailwind positioning classes; an inner `motion.div` with no transform-utility classes handles the opacity/scale animation.

### Bug 2 — `AnimatePresence` unmounted before it could play the exit animation
While fixing Bug 1, the conditional (`hoveredStory?.image &&`) was briefly moved to wrap the *entire* positioning wrapper (including `<AnimatePresence>` itself), which meant `AnimatePresence` unmounted at the same instant as its child — it never got the chance to run the fade/scale-out. **Fix:** keep the wrapper (and `AnimatePresence`) permanently mounted; only the `motion.div` child inside it is conditional.

### Redesign — floating overlay → inline slot between dot and heading
After Bugs 1–2 were fixed, the thumbnail *did* appear, but positioned as a large panel floating well beyond the TOC column's right edge (per an earlier design-question answer that had been miscommunicated/misinterpreted). Client clarified the actual intent: the dot stays fixed in place, and the thumbnail should appear **in the space between the dot and the heading**, growing as the heading text itself shifts right — not off to the side over the middle column. Reworked into a `motion.div` "slot" living directly in the row's flex layout (between the dot and the text block), animating both `width` and `height` from `0` up to a target size, holding the `<Image>` inside via `AnimatePresence`. Iterated 56px → 104px → 128px → 220px in successive rounds as the surrounding column widths grew (see §190) and the previous size read as "too small to make out."

### Bug 3 — permanent row-height bug ("headings far apart")
The thumbnail slot's *height* was left as a static Tailwind class (`h-[104px]`) rather than being animated like its width, so every row — hovered or not — permanently reserved 104px of vertical space, spreading all headings apart even at rest. **Fix:** animate `height` alongside `width` (both `0 → target` via Framer Motion `animate`), so unhovered rows collapse back to their natural (text-only) height and only grow — smoothly pushing subsequent headings down via the existing `layout` props already on each row — when actually hovered.

### Font-size on hover — added, then reverted, then re-added inverted
1. First pass: static heading size unchanged, size *increases* on hover (`1rem → 1.375rem`, animated via Framer Motion `fontSize`, since mixing Tailwind's discrete `text-*` classes with a smooth transition isn't possible without animating the actual style property).
2. Client asked to undo this entirely — reverted title/subtitle back to plain static Tailwind size classes (`text-sm lg:text-base` / `text-xs lg:text-sm`), no font-size animation at all.
3. Final ask (this session's last change): invert it — headings are **larger at rest** and *shrink* on hover, ending at the size they'd been at previously. Re-implemented as `animate={{ fontSize: isHovered ? "1rem" : "1.25rem" }}` — static size (1.25rem/20px) is now the resting state, dropping to 1rem/16px (the pre-existing static size) on hover.

---

## 189. Stories — True Page-Centering of the Story Body

### Problem
Once the TOC and image-panel columns were widened (see §190), the reading column's own `max-w-2xl mx-auto` text block — centered *within `main`'s grid track* — visually drifted off the true center of the page, because the TOC and image-panel column widths are unequal. A block centered within an off-center track is itself off-center relative to the whole page.

### First (rejected) approach — full-viewport-centering, independent of the grid
Considered making the text block ignore its grid track entirely and center on the full page width via an absolutely/fixed-positioned overlay. Rejected before implementing: at the narrower end of the `lg:` breakpoint range (~1024–1150px), a text block centered on the *full* container width would mathematically overlap both side columns by 100px+ (the reserved TOC+image-panel+gaps width alone approaches the total viewport width at that size) — a real, not hypothetical, collision risk.

### Shipped approach — precise, bounded compensating offset
Derived algebraically that the exact horizontal offset needed to move a track-centered block to the *true page center* is `(imagePanelWidth − TOCWidth) / 2` — and, notably, this is independent of the grid gap size (the two gaps cancel out symmetrically in the derivation) and independent of the main track's own (viewport-dependent) width. Implemented in `StoryBlock.tsx`:
```tsx
<div className="lg:flex lg:justify-center">
  <div className="max-w-2xl w-full mx-auto lg:mx-0 lg:ml-[30px] text-left space-y-6">
```
`justify-center` centers the block within `main`'s track first; the explicit `ml-[…]` then nudges it right by the derived offset. Because the block's own `max-w-2xl` cap already prevents it from ever exceeding the track's width, this stays bounded to a small, known worst-case (the offset amount itself, ~30–90px across the iterations below) rather than the 100px+ risk of the rejected full-viewport approach — a deliberate, explained trade-off, not an oversight.

The literal pixel value had to be recalculated twice as the column widths themselves were tuned (§190): 70px (lg) / 90px (xl) at TOC=300/320·image=440/500, then 30px (both breakpoints, values happened to converge) once TOC was widened to 380/440.

---

## 190. Stories — Column Width Iterations

Several rounds of width/spacing tuning on the desktop 3-column layout, driven by visual feedback:

| Element | Iteration |
|---------|-----------|
| Outer container padding | `max-w-[1600px] mx-auto lg:px-8` (symmetric, large empty side margins on wide screens) → `max-w-[2400px] mx-auto lg:px-6` (effectively full-width on typical screens, `mx-auto` only engages on ultra-wide monitors) |
| TOC ↔ main ↔ image-panel layout | Nested `grid[TOC, 1fr] > flex(main, imagePanel)` → restructured to a **true 3-column CSS grid** (`grid-cols-[TOC_1fr_imagePanel]`) once the flex-nesting was identified as the root cause of §189's centering drift — a flex-based `main`+`imagePanel` sub-layout meant widening the image panel silently ate into `main`'s flex-basis asymmetrically |
| TOC column width | 288px (original, fixed) → 280px → **300px (lg) / 320px (xl)** → **380px (lg) / 440px (xl)** (final — client explicitly asked for more room so the hover thumbnail could grow larger) |
| Image panel column width | 384px (`w-96`, original) → 460/560px → 440/500px (dialed back slightly when the wider version threw off body centering) → confirmed final at 440px (lg) / 500px (xl) |
| Blur scrim spanning main+imagePanel | Implemented via CSS Grid's line-based placement on an absolutely-positioned grid item — `style={{ gridColumn: "2 / 4" }}` on the scrim `motion.div`, so it visually covers exactly the "main + image panel" area regardless of their individual widths, without needing a wrapping flex/relative container of its own |
| Hover thumbnail size | 56px → 104px → 128px → **220px** (final, sized to use the TOC column's widened room) |

---

## 191. Key Files Modified (Thirty-Sixth Build)

| File | Change type |
|------|-------------|
| `types/index.ts` | `StoryItem` interface added |
| `lib/firebase/admin-stories.ts` | **New file** — Admin SDK CRUD + reorder + storage cleanup for the `stories` collection |
| `lib/firebase/stories.ts` | **New file** — public accessor, `[]` fallback when Firebase isn't configured |
| `app/api/admin/stories/route.ts` | **New file** — GET (list) / POST (create) |
| `app/api/admin/stories/[id]/route.ts` | **New file** — PUT (update) / DELETE |
| `app/api/admin/stories/reorder/route.ts` | **New file** — POST, zod-validated |
| `lib/admin-api.ts` | Added `apiCreateStory`, `apiUpdateStory`, `apiDeleteStory` |
| `components/layout/AdminSidebar.tsx` | "Stories" nav link added (`NotebookText` icon) |
| `app/(admin)/admin/stories/page.tsx`, `StoriesClient.tsx`, `DeleteStoryButton.tsx`, `new/page.tsx`, `[id]/page.tsx`, `reorder/page.tsx`, `reorder/ReorderStoriesClient.tsx` | **New files** — admin list/table, create/edit, drag-and-drop reorder |
| `components/forms/StoryForm.tsx` | **New file** — heading, sub-heading, body textarea, order, single-image upload |
| `components/stories/StoryBlock.tsx` | **New file** — shared per-story block (scroll-linked active/image-index state, mobile-only inline image, page-centering offset) |
| `components/stories/StoriesTOC.tsx` | **New file** — sticky no-scrollbar contents list; hover: inline-slot thumbnail (width+height animate together), subtitle reveal, inverted static/hover font-size, sibling dimming |
| `components/stories/StoriesImagePanel.tsx` | **New file** — sticky crossfading image column |
| `components/stories/StoriesMobileDrawer.tsx` | **New file** — top-right button, corner-grow contents drawer with staggered heading list |
| `components/stories/StoriesPageClient.tsx` | **New file** — top-level orchestrator; desktop 3-column CSS grid, mobile block flow, grid-spanning blur scrim |
| `app/(public)/stories/page.tsx` | Placeholder "Coming soon." page replaced with async `getAllStories()` fetch + `StoriesPageClient` |

---

# Thirty-Seventh Build Session — Addendum

**Date:** 2026-08-17
**Scope:** Two post-ship fixes on the `/stories` page from live visual review — the mobile contents drawer didn't match the intended desktop-style unboxed look, and TOC/drawer navigation left the wrong story partially visible depending on scroll direction

---

## 192. StoriesMobileDrawer — Removed Box/Card Chrome

Live review flagged that the mobile "Contents" drawer had drifted from what was actually agreed for mobile (§ Thirty-Sixth Build, mobile spec): it had grown a background panel (`bg-[#1a130a] border border-white/10 rounded-sm shadow-2xl`) with its own header bar (a "Contents" title + separate close `X` button), making it read as a distinct modal card rather than the desktop `StoriesTOC.tsx` list (unboxed, dot + heading only, floating directly over the page) simply hidden until the button is pressed.

### Fix (`components/stories/StoriesMobileDrawer.tsx`)
- Removed all box styling — no background, border, shadow, or header bar/title.
- Rows now use the identical `OrganicDot` + heading treatment as the desktop TOC (same SVG, same active/inactive color logic — terracotta for the current story, cream for the rest).
- The trigger button itself now toggles between a `List` icon (closed) and an `X` icon (open) and handles both opening and closing — no separate close control needed inside the list.
- Kept everything that was already correct: grows from the top-right corner (`transformOrigin: "top right"`, scale 0.3→1), headings stagger in one after another (`staggerChildren`), backdrop blur behind it, tap a heading to scroll to it and close.

---

## 193. Story Navigation — Direction-Aware Scroll Target (Navbar Hide-on-Scroll Interaction)

### Symptom (reported via screenshots)
Clicking a TOC/drawer heading to jump to an earlier story now scrolled correctly, but clicking one to jump to a *later* story left the tail end of the *previous* story's paragraph text visible in a sliver above the new story's heading.

### Root cause
`components/layout/Navbar.tsx` hides itself (`-translate-y-full`) while the page is scrolling down and reappears while scrolling up (`hooks in Navbar.tsx:38-52`). The two earlier navigation fixes in this session (see § Thirty-Sixth Build, §189/§193 — the `scroll-mt-24` CSS fix that made jumping to the *first* story work) assumed a constant navbar height needed clearing, via `scrollIntoView()` + a static `scroll-margin-top`. That's only correct for upward jumps, where the navbar reappears and genuinely needs ~96px of clearance. For downward jumps, the navbar ends up auto-hidden at the destination (0px needed) — so the static 96px clearance was reserving space for a navbar that wasn't actually there, stopping the scroll short and revealing the previous story's trailing text in that gap.

### Fix (`components/stories/StoriesPageClient.tsx`)
Replaced the `scrollIntoView()` + CSS `scroll-margin-top` approach (which can't be direction-aware) with a manually computed scroll target in `navigate()`:
```ts
const navigate = useCallback((index: number) => {
  const el = blockRefs.current[index];
  if (!el) return;

  const currentY = window.scrollY;
  const targetTop = el.getBoundingClientRect().top + currentY;
  const scrollingUp = targetTop < currentY;
  const NAVBAR_CLEARANCE = 96;

  window.scrollTo({
    top: Math.max(0, targetTop - (scrollingUp ? NAVBAR_CLEARANCE : 0)),
    behavior: "smooth",
  });
}, []);
```
Direction is determined by comparing the target's document position to the current scroll position; the 96px navbar-clearance offset is only applied when scrolling upward (where the navbar will genuinely reappear), matching `Navbar.tsx`'s own hide/show logic. The now-unused `scroll-mt-24` class was removed from `components/stories/StoryBlock.tsx` (it only affected native `scrollIntoView()`, which is no longer called here).

Same `navigate()` function is shared by both `StoriesTOC.tsx` (desktop) and `StoriesMobileDrawer.tsx` (mobile), so the fix covers both.

---

## 194. Key Files Modified (Thirty-Seventh Build)

| File | Change type |
|------|-------------|
| `components/stories/StoriesMobileDrawer.tsx` | Box/card chrome (background, border, shadow, header bar, separate close button) removed; rows now match `StoriesTOC.tsx`'s unboxed dot+heading style; trigger button doubles as open/close toggle |
| `components/stories/StoriesPageClient.tsx` | `navigate()` rewritten from `scrollIntoView()` to a manually computed, direction-aware `window.scrollTo()` — navbar clearance only applied when scrolling upward |
| `components/stories/StoryBlock.tsx` | Removed now-unused `scroll-mt-24` class |

---

# Thirty-Eighth Build Session — Addendum

**Date:** 2026-08-18
**Scope:** Image-loading-performance investigation only — root cause identified, options discussed and evaluated, no code changed. Client explicitly asked to explore rather than implement.

---

## 195. Image Load Performance — Root Cause & Options (No Changes Made)

### Root cause
`next.config.ts`'s `images.unoptimized: true` (set in the Twenty-Third Build, §125, to avoid Vercel's Image Optimization API usage quota) means every `<Image>` on the site — hero, carousels, catalogue, research, stories — serves the original uploaded file as-is: no automatic resizing, no format conversion (WebP/AVIF), no responsive `srcset` shrinking for mobile viewports. Since the site's Storage now holds substantially more images than at the time that flag was set (the Stories feature alone added a new image-per-item content type, on top of the pre-existing Items/Research/Featured catalogues), the client confirmed re-enabling Vercel's optimizer would likely blow the free-tier quota again — ruling out the simplest fix.

### Options discussed, ranked by effort
1. **Compress at upload time, server-side** (`app/api/admin/upload/route.ts`, using `sharp` to resize + convert to WebP once per upload) — cheapest to run (happens once, not per page-view), keeps `unoptimized: true`, avoids Vercel cost entirely. Since `/api/admin/upload` is the single shared endpoint behind every admin form's `ImageUploadField`, one change would cover Items, Categories, Research, Featured, and Stories at once. Only affects images uploaded *after* the change, unless paired with a backfill.
2. **Backfill existing images** — a one-time migration script walking every image URL referenced across Firestore, downloading, compressing, and re-uploading in place. Fixes the current backlog immediately but is riskier (touches live production URLs) and more work than option 1 alone.
3. **Client-side compression before upload** (in the browser, before the file is sent) — same end result as option 1, additionally saves upload bandwidth, but is less predictable than doing it server-side (depends on the admin's browser).
4. **Move image hosting off raw Firebase Storage** to a service with its own free-tier on-the-fly optimizer (e.g. Cloudinary, ImageKit) — sidesteps Vercel's quota entirely, but is a materially bigger architectural change (new dependency, new account, migration of existing URLs).
5. **Re-enable Vercel's optimizer selectively** (only for the highest-traffic images, e.g. hero/catalogue thumbnails, leaving lower-traffic galleries like research detail pages served raw) — reduces quota exposure without eliminating it, and is fiddly to keep consistent long-term.

### JPEG/PNG → WebP visual-quality question
Also discussed and clarified (no implementation): lossy WebP at ~quality 80–85 is visually indistinguishable from source JPEGs at the same or smaller file size (WebP's compression is more efficient than JPEG's at equivalent quality) — a concern only if quality were pushed much lower or an image were re-compressed lossy multiple times. PNGs need a content-based split: photographic PNGs (product/craft photos) can go lossy WebP same as JPEGs, but any PNGs actually relying on transparency (a handful of logo/UI assets, not catalogue photography) should use WebP's *lossless* mode instead to avoid visibly damaging edges — smaller gains than lossy, but zero quality loss.

### Decision / status
**Deferred at the client's explicit request** ("I don't want to do anything right now, I only want to explore options, don't change anything"). Recommended next step when ready: option 1 (server-side compression on new uploads via `sharp`) as the initial low-risk change, with option 2 (backfill) as a deliberate, separately-scoped follow-up once option 1 is proven out.

No files were modified this session.

---

# Thirty-Ninth Build Session — Addendum

**Date:** 2026-08-19
**Scope:** Follow-through on the Thirty-Eighth Build's deferred WebP plan — server-side upload compression, a full backfill + cleanup of the existing 200-image catalogue, a client-side pre-compression fix for a live Vercel upload bug the client had been hitting, and a new drag-to-reorder-images feature inside the Items/Research admin forms

---

## 196. WebP Compression at Upload Time (`app/api/admin/upload/route.ts`)

Implemented option 1 from §195's plan. Added `sharp` as a dependency. Every upload — regardless of admin form, since all of them share this one endpoint via `ImageUploadField.tsx` → `uploadFile()` — is now resized and re-encoded before it's written to Storage:

```ts
const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

buffer = await sharp(originalBuffer)
  .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
  .webp({ quality: WEBP_QUALITY })
  .toBuffer();
```

The stored path always ends in `.webp` regardless of the uploaded file's original extension (`path.replace(/\.[^./]+$/, "") + ".webp"`) — no caller assumes a particular extension, they just use whatever URL the route returns, so this is a safe, silent change from the admin's perspective. Non-image files and corrupt images now fail with a clean 400 instead of being blindly accepted or crashing.

**Verified against real files before shipping:** a 2.5MB JPEG → 0.29MB (88% smaller), a 3.97MB PNG → 0.35MB (91% smaller), both correctly resized/re-encoded. Confirmed the route's production bundle stayed tiny (195B), meaning `sharp`'s native binary was correctly treated as an external server package by Next's bundler rather than broken by it.

---

## 197. Backfill Script for the Existing Catalogue (`scripts/backfill-images.ts`)

New CLI script (`npm run backfill-images -- [--dry-run] [--limit=N]`), following the same `tsx` + `dotenv` convention as the existing `scripts/seed.ts`. Re-encodes every pre-existing image (items, categories, research_items, featured_items, stories) to WebP and repoints the relevant Firestore field — without ever touching or deleting the original, which is uploaded to a new `-optimized.webp` path alongside it. Resumable: progress is persisted to `scripts/backfill-images-log.json` (gitignored) after every image, so a crash or interruption can just be re-run.

### A real bug caught during dry-run testing
The first dry-run persisted fake `"done"` log entries to disk. Had that gone unnoticed, a subsequent *real* run would have trusted the log, skipped the actual upload, and still repointed Firestore at a file that was never written — silent broken images. Fixed by making dry runs fully side-effect-free (the in-memory log is still used so the dry run's own Firestore-preview step reports correctly, but it's never written to disk):
```ts
if (!DRY_RUN) saveLog(log);
```
Verified the fix by re-running the dry run and confirming no log file was written, then proved the real path end-to-end on a single image (uploaded, confirmed live via direct HTTP request, confirmed the original was untouched) before scaling up.

### Full run results
Run in batches (`--limit=50` a few times, plus one larger batch that ran long enough to continue in the background) against the live production Firestore/Storage: **200 of 200 images migrated, 0 failures.** Confirmed complete with a final `--dry-run` pass showing "0 to process, 200 already WebP."

---

## 198. Original Image Cleanup Script (`scripts/cleanup-original-images.ts`)

New CLI script (`npm run cleanup-original-images -- [--dry-run] [--limit=N]`) — the deliberately separate, genuinely irreversible step deferred from §195's original plan. Deletes the pre-WebP originals the backfill left behind, but only ever considers files recorded in the backfill's own log, and re-verifies against a **fresh** live Firestore read before deleting anything:
- only deletes if the original URL is confirmed **not** referenced anywhere anymore, **and**
- the WebP replacement is confirmed referenced somewhere (proves the repoint actually took effect) —

if either check fails (e.g. an item was edited or deleted after the backfill ran), the original is left alone rather than guessed at.

### Staged rollout, at the client's request
Rather than running the full deletion in one shot, this was done in two steps per the client's ask: first `--limit=2` for real, with the exact old/new URLs reported back so the client could verify directly (confirmed via direct HTTP requests that the two originals now 404/403 while their WebP replacements still serve 200, then confirmed the corresponding live page still rendered correctly with the original genuinely gone, not just unused). Only after that explicit confirmation was the remaining 198 run.

**Final result:** 200 of 200 originals deleted, 0 failures, **~383.6MB freed** from Storage.

---

## 199. `.next` Build Cache Corruption — Twice (Lesson Learned)

Running a full `npm run build` (production build) while a `npm run dev` server was still active in the background corrupted the dev server's client bundle **twice** in this session — both times manifesting as "no images are loading" on `localhost:3000` even though the server-rendered HTML had correct `<img src>` tags and the image URLs themselves were independently confirmed reachable. Root cause: `next dev` and `next build` both write to the same `.next/` directory; running them concurrently is a known way to corrupt whichever one is mid-flight, and since several image components on this site (`ImageCarousel`, galleries) rely on client-side React/Framer Motion state to actually reveal/position each image, a broken client bundle leaves the *data* correct but the *rendering* broken — a confusing failure mode since it looks like a data or network issue rather than a stale-cache one.

**Fix, both times:** kill the process on port 3000, `rm -rf .next`, restart `npm run dev` clean.

**Going forward:** check `netstat` for a listener on port 3000 before running `npm run build` as a verification step during a session where a dev server might already be running, and prefer letting an already-running dev server's Fast Refresh pick up a change rather than running a separate production build alongside it when the change doesn't specifically need build-time verification (e.g. confirming a native-module bundle size, which was the actual reason `npm run build` was used at all).

---

## 200. Upload Payload Size Bug — Vercel's 4.5MB Serverless Function Limit

### Symptom
Client reported "some images are unable to be uploaded" — reproduced with a specific 4.48MB JPEG (`Catalogue/Shawls/New Items/Shawl2A.jpg.jpeg`) that uploaded fine locally but failed on `https://traamandbeyond.com/admin/items/...` with `FUNCTION_PAYLOAD_TOO_LARGE` visible in the Network tab's response body.

### Root cause
Vercel Serverless Functions enforce a hard **4.5MB limit on the incoming request body**, at the platform level, before any application code runs. The file is 4.48MB raw, but the browser sends it as `multipart/form-data` (file + the `path` field + boundaries/headers), which pushes the actual request body just over that line. `next dev`'s local server has no such cap, which is exactly why it worked locally and failed only in production, and why it only affected some images (roughly those over ~4.3MB raw) rather than all of them. The server-side `sharp` compression added in §196 doesn't help here — it runs *after* the file reaches the server, and this file never got that far; Vercel rejects the request before the route handler executes.

### Fix — client-side pre-compression (`lib/image-compress.ts`, new file)
A browser-side compression pass was added, using `createImageBitmap` (with `imageOrientation: "from-image"` explicitly set, to guarantee correct EXIF-based rotation regardless of browser default behavior) + `<canvas>`, wired into `uploadFile()` in `lib/admin-api.ts` so every admin upload goes through it before the network request:

```ts
const MAX_DIMENSION = 3000;
const JPEG_QUALITY = 0.9;
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;
```

Deliberately conservative settings (larger max dimension and higher quality than the server's own 2000px/WebP-82 pass) — its only job is reliably clearing Vercel's limit, not doing the "real" compression, which the unchanged server-side `sharp` pipeline still owns. Runs on *every* upload rather than only as a fail-safe for oversized files (a deliberate choice, confirmed with the client): keeps one consistent code path instead of two, and speeds up every upload's transfer time, not just the ones that would otherwise hard-fail. Never throws — falls back silently to the original file if compression fails for any reason, so it can't itself become a new point of failure. Files already under 1.5MB skip the pass entirely as needless work.

Also improved: `uploadFile()` now surfaces a specific message for a still-oversized file (HTTP 413) instead of a generic string, and `ImageUploadField.tsx`'s catch block now displays the actual thrown error message instead of a hardcoded "Upload failed. Please try again."

**Verified:** ran the exact failing file through a `sharp`-based simulation of the two-stage pipeline (not identical to the browser's canvas encoder, but the same ballpark) — 4.48MB original → 1.46MB after the simulated client pass (well clear of the 4.5MB limit) → 0.72MB after the unchanged server WebP pass. Client then confirmed the actual fix end-to-end through the real admin UI with the real file, both locally and, after deploying, on the live site.

---

## 201. Drag-to-Reorder Images Within an Item (`components/forms/ImageUploadField.tsx`)

New client request: in the Items admin form, be able to reorder an item's multiple images so the order determines display order (first image = cover/primary image shown first in carousels and grids) — previously `ImageUploadField` only ever appended new uploads to the end of the array with no way to reorder, only remove.

### Implementation
Added `@dnd-kit` drag-and-drop (same library/pattern as every other reorder feature on this site — Items list, Research list, Featured, Stories) to the component's multi-image mode:
- Each thumbnail gets a dedicated grip handle (top-left, visible on hover) carrying the `{...attributes} {...listeners}` — kept deliberately separate from the existing remove (×) button so dragging and removing can't conflict, matching the same "dedicated handle, not the whole row" pattern used in `ReorderFeaturedClient.tsx`/`ReorderResearchClient.tsx`/etc.
- `rectSortingStrategy` (not `verticalListSortingStrategy`, which every *other* reorder UI on this site uses) — this grid wraps across multiple rows via `flex-wrap`, not a single vertical column, so the rect-based strategy is the correct one here specifically.
- The first thumbnail gets a small terracotta "Cover" badge so it's visually unambiguous which image is primary.
- Reordering only updates the form's local `images` state (same as adding/removing already did) — persisted to Firestore on save, same as before.

### Scope decision (not explicitly asked, low-risk)
Applied to the shared `ImageUploadField` component's multi-image mode generally, rather than special-casing it to only the Items form — Research items also support multiple images and benefit identically. Single-image fields (Categories, Featured, Stories) are unaffected since there's nothing to reorder with 0–1 images.

---

## 202. Key Files Modified (Thirty-Ninth Build)

| File | Change type |
|------|-------------|
| `app/api/admin/upload/route.ts` | Every upload now resized (max 2000px) and re-encoded to WebP (quality 82) via `sharp` before being written to Storage; non-image/corrupt files now rejected with a clean 400 |
| `package.json` | `sharp` dependency added; `backfill-images` and `cleanup-original-images` npm scripts added |
| `scripts/backfill-images.ts` | **New file** — resumable migration script, converts existing catalogue images to WebP and repoints Firestore, originals left untouched |
| `scripts/cleanup-original-images.ts` | **New file** — deletes originals only after re-verifying against a fresh Firestore read that the WebP replacement is live and the original is unreferenced |
| `.gitignore` | `scripts/backfill-images-log.json` (run-specific, not meant to be committed) added |
| `lib/image-compress.ts` | **New file** — browser-side pre-upload resize/compress (max 3000px, JPEG quality 0.9) to keep every admin upload under Vercel's 4.5MB serverless function payload limit |
| `lib/admin-api.ts` | `uploadFile()` now runs every file through `compressImageForUpload()` before sending; clearer error message on a still-oversized (413) upload |
| `components/forms/ImageUploadField.tsx` | Real error messages surfaced instead of a hardcoded string; multi-image mode now supports drag-to-reorder via `@dnd-kit` with a dedicated grip handle per thumbnail and a "Cover" badge on the first image |

---

# Fortieth Build Session — Addendum

**Date:** 2026-08-19
**Scope:** Mobile-only expandable "Read full story" pattern for the `/stories` page body text, plus a scroll-position bug found and fixed during that work

---

## 203. Stories — Mobile "Read Full Story" Expand/Collapse (`components/stories/StoryBlock.tsx`)

New client request: on mobile only (desktop untouched), each story's body should default to a short preview instead of the full ~800-1000 words, with a way to expand and re-collapse it — no new boxes/cards, purely expandable text matching the page's existing unboxed look. `/ui-ux-pro-max` was invoked per instruction; its CLI search tool hit the same broken-symlink issue documented repeatedly earlier in this project (§155, §162, §167) — the loaded Quick Reference guidance was used directly instead, specifically `truncation-strategy` (ellipsis + expand, not just clipping), `touch-target-size`, `duration-timing`/`exit-faster-than-enter`, and `aria-expanded` for the disclosure-widget pattern.

### Implementation
- Desktop (`hidden lg:block`): body renders exactly as before, byte-for-byte unchanged — a second, parallel rendering of the same `paragraphs` data (cheap, text-only duplication — no hooks or refs are duplicated, following the same `lg:hidden`/`hidden lg:block` split already used for the mobile-only inline image in this component).
- Mobile (`lg:hidden`): defaults to the first 14 words of the first paragraph + "…" + an inline underlined **"Read full story →"** trigger. Tapping it plays a Framer Motion height/opacity expand (`height: 0 → "auto"`, 300ms) to the full body. Collapsing back works two ways — a **"See less"** link at the end of the full text, or a subtle **"×"** button that appears top-right only once expanded (kept as a sibling of the height-animating container, not a descendant of it, specifically so it isn't clipped by that container's `overflow-hidden` while its height is still small early in the expand animation) — both call the same collapse handler.
- `AnimatePresence` is kept permanently mounted with only its direct children swapped — the same lesson already learned once this session with the TOC hover-preview image (§ Thirty-Sixth Build, §188): conditionally mounting `AnimatePresence` itself alongside its child silently breaks exit animations.

---

## 204. Scroll-Position Bug on Collapse — Root Cause & Fix

### Symptom
Collapsing an expanded story (via "See less") left the page scrolled to roughly the bottom of the site (near the footer) instead of back at that story.

### First attempt (insufficient)
Reused the direction-aware scroll helper already built for TOC navigation (§ Thirty-Seventh Build, §193) — extracted it into a shared `components/stories/scrollToElement.ts` (previously duplicated inline in `StoriesPageClient.tsx`'s `navigate()`) and called it synchronously inside the collapse click handler, right after `setExpanded(false)`. This did not fix it.

### Root cause
The scroll target was computed correctly (the block's own top edge doesn't move when its content collapses, only what's below it shifts up) — but the *scroll animation* and the *collapse's exit animation* then ran concurrently, racing each other: `window.scrollTo({ behavior: "smooth" })` animates toward a fixed absolute document coordinate over several hundred milliseconds, while at the same time Framer Motion's `AnimatePresence` exit animation is shrinking the document's total scrollable height. A smooth-scroll target computed against the pre-collapse (taller) document can overshoot once the actual scrollable range shrinks out from under it mid-animation — landing the page near whatever is now at the bottom of the newly-short document instead of at the intended story.

### Fix
Deferred the scroll correction to `AnimatePresence`'s `onExitComplete` callback — which fires only once the collapsing content's exit animation has actually finished and the DOM is stable at its final (short) height — instead of running it synchronously in the click handler:
```tsx
const pendingCollapseScrollRef = useRef(false);

function handleCollapse() {
  pendingCollapseScrollRef.current = true;
  setExpanded(false);
}

function handleCollapseExitComplete() {
  if (pendingCollapseScrollRef.current) {
    pendingCollapseScrollRef.current = false;
    if (ref.current) scrollToElement(ref.current);
  }
}
```
`onExitComplete` is attached to the `AnimatePresence` wrapping the preview/full-body swap; since both collapse triggers ("See less" and "×") go through the same `handleCollapse` → state change → exit animation → `onExitComplete` path, the fix covers both uniformly. No animation is racing another anymore — the scroll only ever starts once the layout it's targeting is already final.

---

## 205. Key Files Modified (Fortieth Build)

| File | Change type |
|------|-------------|
| `components/stories/StoryBlock.tsx` | Mobile-only expandable story body (14-word preview + "Read full story →" / "See less" / "×"); desktop rendering unchanged; scroll-position-on-collapse bug fixed via `onExitComplete` |
| `components/stories/scrollToElement.ts` | **New file** — direction-aware, navbar-clearance-aware scroll helper extracted from `StoriesPageClient.tsx`'s `navigate()` so both TOC navigation and story-collapse re-anchoring share one implementation |
| `components/stories/StoriesPageClient.tsx` | `navigate()` simplified to call the extracted `scrollToElement()` helper |
