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

---

---

# Summary — Third Build Session

**Date:** 2026-04-13
**Scope:** Client-requested content and navigation changes — hamburger menu, hero background image, About page content, whitespace fixes, category seeding, upload reliability

---

## 1. `whitespace-pre-line` — CMS Text Rendering Fix

Admin textareas preserve line breaks in the database, but HTML collapses whitespace by default. Added `whitespace-pre-line` Tailwind class to all public-facing CMS-rendered text fields so newlines in the admin panel appear as paragraph breaks on the site.

**Files changed:**
- `components/home/HeroSection.tsx` — hero subtext paragraph
- `components/home/CategoryHighlights.tsx` — category description paragraphs
- `components/items/ItemCard.tsx` — item description (mobile + desktop)
- `app/(public)/category/[slug]/[itemId]/page.tsx` — item detail description

---

## 2. Navbar — Full Hamburger Menu Redesign (`components/layout/Navbar.tsx`)

The top Navbar and BottomTabBar were replaced with a single full-screen hamburger menu that works across all screen sizes.

**Removed:**
- `components/layout/BottomTabBar.tsx` (no longer rendered)
- `pb-20 lg:pb-0` from `<main>` in `app/(public)/layout.tsx`
- Category fetching and `categories` prop from the navbar
- Mobile hamburger sheet drawer from previous design

**Added:**
- `Menu` / `X` icon (lucide) top-right — toggles a full-screen overlay
- Full-screen `AnimatePresence` overlay with `bg-walnut` and fade animation
- Body scroll locked (`document.body.style.overflow = "hidden"`) when menu is open
- Hardcoded `CRAFTS` array with 14 categories, each linking to `/category/[slug]`

**Menu structure:**
```
Home
About ──► Introduction  /  Craft Heritage of Kashmir
Crafts ──► (2-col mobile / 3-col sm+, 14 subcategories)
Stories
Buy from the Artisans
Contact
```

**CRAFTS array (slugs match Firestore document IDs exactly):**
```tsx
const CRAFTS = [
  { label: "Copper Ware",      slug: "copper-ware" },
  { label: "Papier Mache",     slug: "papier-mch" },   // slugify strips â/é
  { label: "Silverware",       slug: "silver-ware" },
  { label: "Enamelware",       slug: "enamel-ware" },
  { label: "Terracotta",       slug: "terracotta" },
  { label: "Sculptures",       slug: "sculptures" },
  { label: "Green Serpentine", slug: "green-serpentine" },
  { label: "Coins",            slug: "coins" },
  { label: "Shawls",           slug: "shawls" },
  { label: "Jewellery",        slug: "jewellery" },
  { label: "Carpets",          slug: "carpets" },
  { label: "Willow Wicker",    slug: "willow-wicker" },
  { label: "Woodwork",         slug: "wood-work" },
  { label: "Brass Ware",       slug: "brass-ware" },
];
```

**About anchor sub-links:**
- `/about#introduction`
- `/about#craft-heritage`

Auto-hide on scroll and transparent→frosted glass transition were retained from the previous design.

---

## 3. New Placeholder Pages

| File | Route | Content |
|------|-------|---------|
| `app/(public)/stories/page.tsx` | `/stories` | ScrollReveal heading, "Content coming soon." |
| `app/(public)/buy-from-artisans/page.tsx` | `/buy-from-artisans` | ScrollReveal heading, "Content coming soon." |

---

## 4. Home Page — Removed Intro Section (`app/(public)/page.tsx`)

Removed the centred text block below the hero ("Traam and Beyond brings you...") at client request. The hero now flows directly into the category highlights section.

---

## 5. Hero Section — Full-Bleed Background Image (`components/home/HeroSection.tsx`)

Replaced the plain dark walnut background + dot pattern with a positioned vessel photograph.

**Implementation:**
- `min-h-screen` for full viewport height
- `<Image src="/hero-vessel.png" fill priority>` in a `w-[48%]` left-aligned container
- `opacity-40` on the image container
- `object-contain object-[center_20%]` on mobile / `object-left-bottom` on desktop
- Dot pattern overlay removed entirely
- Left-to-right darkening gradient overlay: `bg-gradient-to-r from-black/20 to-black`

```tsx
<div className="absolute inset-y-0 left-0 w-full lg:w-[48%] opacity-40">
  <Image src="/hero-vessel.png" fill priority
    className="object-contain object-[center_20%] lg:object-left-bottom" sizes="48vw" />
</div>
<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black" />
```

**Image file:** `public/hero-vessel.png` (client-provided, previously `hero-bg(2)-Photoroom.png` — renamed to fix Next.js parentheses issue)

---

## 6. Category Highlights — Darker Background (`components/home/CategoryHighlights.tsx`)

Section background and text panel changed from `bg-walnut` (`#20180C`) to `bg-[#1a130a]` (20% darker) for stronger contrast against the hero gradient.

---

## 7. About Page — Real Content + Image + Gradient (`app/(public)/about/page.tsx`)

### Content
Replaced the placeholder with real client-authored text across 5 paragraphs describing the founder's personal journey collecting Kashmiri handicrafts.

### Image Layout
- **Desktop:** `float-right ml-10 mb-6 w-[380px]` — text wraps around the image
- **Mobile:** Separate `<Image>` instance between paragraph 1 and 2, `max-w-xs mx-auto`
- Two `<Image>` tags used (one `hidden lg:block`, one `lg:hidden`) to achieve different placements without JavaScript
- Image file: `public/about-vessel.png` (client-provided; explicit `width={600} height={800}` props, not `fill`, to avoid zero-height rendering)

### Gradient
Same left-to-right darkening effect as the hero section — applied as a `fixed` overlay so it covers the full viewport regardless of page scroll position:
```tsx
<div className="fixed inset-0 bg-gradient-to-r from-transparent to-black/80 pointer-events-none z-0" />
```

---

## 8. Category Seeding System (Admin)

Added tooling to bulk-create/rename categories in Firestore from a predefined master list.

### `app/api/admin/seed-categories/route.ts`
Admin-auth protected POST endpoint:
- Renames existing documents: `copper` → `copper-ware`, `silver` → `silver-ware`, `jade` → `green-serpentine`
- Creates 8 new categories if not already in Firestore: Enamelware, Sculptures, Shawls, Jewellery, Carpets, Willow Wicker, Woodwork, Brass Ware

**Key fix:** Firebase Admin SDK `DocumentSnapshot.exists` is a **property**, not a method. Using `snap.exists()` causes a Vercel build error — must be `snap.exists`.

### `app/(admin)/admin/categories/SeedCategoriesButton.tsx`
Client component with a "Seed All Crafts" button, calls `apiSeedCategories()`, shows loading/success/error state.

### `app/(admin)/admin/categories/page.tsx`
SeedCategoriesButton added next to the "Add Category" button.

### `lib/admin-api.ts`
Added `apiSeedCategories()` function.

### `lib/mock-data.ts`
Updated mock data to match new category names and added 8 new entries with placeholder images and descriptions.

---

## 9. Upload Reliability Fix (`app/api/admin/upload/route.ts`)

**Problem:** Intermittent upload failures where images would sometimes not become publicly accessible.

**Root cause:** The previous implementation called `fileRef.save()` followed by a separate `fileRef.makePublic()`. These are two independent API calls — the second could silently fail under network pressure, leaving the file private.

**Fix:** Replaced with a single `save()` call using `predefinedAcl: "publicRead"`, making the file public atomically at write time:
```ts
await fileRef.save(buffer, {
  metadata: { contentType: file.type },
  predefinedAcl: "publicRead",
});
```

---

## 10. Key Files Modified (Third Build)

| File | Change type |
|------|-------------|
| `components/layout/Navbar.tsx` | Full rewrite — hamburger menu, full-screen overlay, 14-craft submenu |
| `components/layout/BottomTabBar.tsx` | **Removed** (no longer used) |
| `app/(public)/layout.tsx` | Removed BottomTabBar, removed pb-20 |
| `app/(public)/page.tsx` | Removed intro text section |
| `app/(public)/stories/page.tsx` | **New file** — placeholder |
| `app/(public)/buy-from-artisans/page.tsx` | **New file** — placeholder |
| `app/(public)/about/page.tsx` | Real content, vessel image, fixed gradient overlay |
| `components/home/HeroSection.tsx` | Full-bleed bg image, gradient, removed dot pattern |
| `components/home/CategoryHighlights.tsx` | Darker bg, whitespace-pre-line |
| `components/items/ItemCard.tsx` | whitespace-pre-line on descriptions |
| `app/(public)/category/[slug]/[itemId]/page.tsx` | whitespace-pre-line on description |
| `app/api/admin/upload/route.ts` | predefinedAcl fix for upload reliability |
| `app/api/admin/seed-categories/route.ts` | **New file** — bulk category seeding endpoint |
| `app/(admin)/admin/categories/SeedCategoriesButton.tsx` | **New file** — admin UI button |
| `app/(admin)/admin/categories/page.tsx` | Added SeedCategoriesButton |
| `lib/admin-api.ts` | Added apiSeedCategories() |
| `lib/mock-data.ts` | Updated category names + 8 new entries |
| `public/hero-vessel.png` | Client-provided hero background image |
| `public/about-vessel.png` | Client-provided about page vessel image |
