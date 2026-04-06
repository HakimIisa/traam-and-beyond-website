# Summary — Second Build Session

**Date:** 2026-04-06
**Scope:** UI/UX upgrade — dark gallery aesthetic, scroll animations, mobile navigation, font system, layout redesign

---

## 1. Tooling & Infrastructure

### Ruflo MCP Server
- Registered `ruflo` as a local MCP server in Claude Code via `claude mcp add ruflo -- npx -y ruflo@latest mcp start`
- Initialized in project with `npx ruflo@latest init`, creating `.claude/` infrastructure:
  - 30 skills, 10 commands, 98 agents, `.mcp.json`, `.claude-flow/` runtime
  - 7 hook types enabled in `.claude/settings.json`

### ui-ux-pro-max Skill
- Installed from `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
- CLI: `npm install -g uipro-cli && uipro init --ai claude`
- Adds `/ui-ux-pro-max` slash command with 161 design rules, 67 UI styles, 161 palettes, 57 font pairings
- Lives in `.claude/skills/ui-ux-pro-max/`

### framer-motion
- `npm install framer-motion` — used for all scroll and mount animations

---

## 2. Design System Changes (`app/globals.css`, `app/layout.tsx`)

### Dark Gallery Palette
Replaced the original cream/light theme with a dark walnut-based palette:

| Token | Old | New |
|-------|-----|-----|
| `--color-walnut` | `#3D2B1F` | `#20180C` (near-black) |
| `--color-cream` | `#FAF6F0` | `#F8E8D2` |
| `--color-cream-dark` | `#F0E8DC` | `#2A1E0F` (dark divider) |
| `--color-terracotta` | `#C25B3F` | `#B57031` (warmer gold-brown) |
| `--color-stone` | `#8B7355` | `#A68F67` |

`body` now defaults to `background: walnut, color: cream`.

### Font System
Added two Google Fonts alongside the existing local Helvetica:
- **Cormorant** (`--font-display`) — serif, used for all `h1/h2/h3` headings via CSS `@layer base`
- **Raleway** (`--font-sans`) — replaces Helvetica as the default sans-serif for body text

Both loaded via `next/font/google` in `app/layout.tsx` and injected as CSS variables on `<html>`.

### Admin Light Theme Override
Added `.light-theme` CSS class in `globals.css`:
```css
.light-theme { background-color: #ffffff; color: #111111; }
.light-theme h1, .light-theme h2, .light-theme h3 { font-family: var(--font-sans); }
```
Applied in `app/(admin)/layout.tsx` so the admin panel stays white/light regardless of the dark body default.

---

## 3. New Components

### `components/ScrollReveal.tsx`
Framer Motion wrapper for scroll-triggered reveals. Used on the About page and section headings.
```tsx
initial={{ opacity: 0, scale: 0.8 }}
whileInView={{ opacity: 1, scale: 1 }}
viewport={{ once: false, margin: "-60px" }}
transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
```
`once: false` means animation reverses when scrolling back up.

### `components/layout/BottomTabBar.tsx`
Mobile-only fixed bottom navigation bar (hidden on `lg+`). Features:
- **5 tabs:** Home, Collections, Search, About, Contact
- **Collections** opens a bottom sheet (`Sheet` from shadcn/ui) listing all categories
- **Auto-hide on scroll down**, reappears on scroll up (same pattern as Navbar)
- `safe-area-inset-bottom` padding for iPhone notch support
- Active tab highlighted in terracotta

---

## 4. Layout Changes

### `app/(public)/layout.tsx`
- Added `<BottomTabBar categories={categories} />` after Footer
- Added `pb-20 lg:pb-0` to `<main>` so content isn't hidden behind the mobile tab bar

### `app/(admin)/layout.tsx`
- Wrapped shell and loading state in `.light-theme bg-white` to prevent dark theme bleed into admin

---

## 5. Navbar Redesign (`components/layout/Navbar.tsx`)

**Removed:**
- Mobile hamburger menu + Sheet drawer (replaced entirely by BottomTabBar)

**Added:**
- **Auto-hide on scroll down**, reappears on scroll up (`useEffect` + `lastScrollY` ref)
- **Transparent → frosted glass** transition: starts transparent, becomes `bg-walnut/90 backdrop-blur-sm` once scrolled past 20px
- **Fixed positioning** (was `sticky`) so it overlays the hero image
- Colors updated to dark theme: `text-cream` logo, `text-stone` links, terracotta active state
- Dropdown panel updated to `bg-walnut` with `border-cream-dark/20`

---

## 6. Footer (`components/layout/Footer.tsx`)
- Changed from `bg-walnut` to `bg-walnut-light` 
- Added `border-t border-cream-dark/20` — subtle top divider separating footer from page body

---

## 7. Hero Section (`components/home/HeroSection.tsx`)

Converted to `"use client"` for Framer Motion.

**Changes:**
- Headline uses `font-display` (Cormorant) — grew to `text-8xl` on desktop
- Staggered mount animations on all 4 elements (tagline → headline → subtext → CTA button):
  - Each uses `initial/animate` (not `whileInView`) since it's above the fold
  - Delays: `0s, 0.1s, 0.25s, 0.4s`
- CTA button is `w-full` on mobile, auto-width on `sm+`

---

## 8. Category Highlights — Full Redesign (`components/home/CategoryHighlights.tsx`)

Converted to `"use client"` for Framer Motion.

**Desktop layout (lg+):**
- Alternating `35% image | 65% text` panels (previously a compact list)
- Image: `w-[35%] aspect-square` — always 1:1 ratio
- Text panel: `w-[65%] px-16 bg-walnut`, heading `text-6xl font-display`
- Odd-indexed cards flip to `flex-row-reverse` (image on right)
- `group-hover:text-terracotta` on heading, `group-hover:gap-4` on arrow

**Mobile layout:**
- Full-width `aspect-square` image (no cropping)
- Text block below with `px-4 pt-5 pb-10`
- `border-b border-cream-dark/20` divider between cards

**Scroll animation:**
- Framer Motion `staggerChildren: 1.0s`
- Image animates first (`scale 0.8→1, opacity 0→1, duration 1.2s`)
- Text follows 1 second later with identical animation
- `once: false` — reverses on scroll up

---

## 9. Item Cards — Full Redesign (`components/items/ItemCard.tsx`, `components/items/ItemGrid.tsx`)

ItemCard completely rewritten to **match CategoryHighlights exactly**:

**Desktop (lg+):**
- Same `35% image | 65% text` alternating layout
- Requires `index: number` prop for alternating direction
- `group-hover:text-terracotta` on title
- Enquire button uses `onClick` with `e.preventDefault()` to avoid Link navigation conflict
- Same Framer Motion stagger animation (image first, text 1s later)

**Mobile:**
- Full-width `aspect-square` image
- Text below, `border-b` divider between items

**ItemGrid:**
- Removed `divide-y` wrapper (dividers now handled per-card)
- Passes `index` to each `<ItemCard>`

All images enforce `aspect-square` — consistent with the project rule that all uploaded images are 1:1 ratio.

---

## 10. About Page (`app/(public)/about/page.tsx`)
- `h1` uses `font-display text-cream`
- Craft cards: `bg-walnut-light` (was `bg-cream-dark`)
- Enquiry box: `bg-walnut-light`
- All text blocks and headings wrapped in `<ScrollReveal>` with staggered delays

---

## 11. Animation Iterations Log

The stagger delay and scale were tuned across several iterations:

| Setting | Value tried | Final |
|---------|-------------|-------|
| `staggerChildren` | 0.15 → 1.5 → 1.0 → 0.75 → 0.5 → 1.0 | **1.0s** |
| `scale` (initial) | 0.96 → 0.9 → 0.8 | **0.8** |
| `duration` | 0.65 → 1.2 | **1.2s** |
| Animation style | slide-up (y:28) → scale+fade → subtle y:10 → scale+fade | **scale+fade** |
| `once` | true → false | **false** (reverses on scroll up) |

---

## 12. Key Files Modified

| File | Change type |
|------|-------------|
| `app/layout.tsx` | Fonts added |
| `app/globals.css` | Full rewrite — dark palette, font tokens, .light-theme |
| `app/(public)/layout.tsx` | BottomTabBar added, pb-20 on main |
| `app/(admin)/layout.tsx` | light-theme wrapper |
| `components/layout/Navbar.tsx` | Full rewrite — auto-hide, transparent scroll, no hamburger |
| `components/layout/Footer.tsx` | bg + border-t |
| `components/layout/BottomTabBar.tsx` | **New file** |
| `components/ScrollReveal.tsx` | **New file** |
| `components/home/HeroSection.tsx` | Font + mount animations |
| `components/home/CategoryHighlights.tsx` | Full rewrite — 35/65 layout, animations |
| `components/items/ItemCard.tsx` | Full rewrite — matches CategoryHighlights |
| `components/items/ItemGrid.tsx` | Passes index, removes divide-y |
| `app/(public)/about/page.tsx` | Dark colors + ScrollReveal |
