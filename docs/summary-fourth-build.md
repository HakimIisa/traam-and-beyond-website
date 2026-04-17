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
