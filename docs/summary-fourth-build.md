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
