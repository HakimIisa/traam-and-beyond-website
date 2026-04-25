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
