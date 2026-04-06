# UI/UX Upgrade TWO — "The Spotlit Gallery" (Mobile-First Dark Theme)

**Status:** Planned, not yet implemented  
**Date:** April 2026  
**Builds on:** `docs/UI-UX-Upgrade-ONE.md` (original concept, now superseded by this document)

---

## Overview

The goal is to transform the site from a warm cream/walnut catalog into a high-end dark gallery experience — like walking through a museum. Mobile users are the primary audience. The upgrade covers:

1. New dark color palette (from a reference brand board)
2. Cormorant Garant (serif display) + Raleway (sans-serif) fonts replacing Helvetica
3. Auto-hiding Navbar (desktop) + auto-hiding Bottom Tab Bar (mobile) — both scroll-aware
4. Full-width portrait category cards on mobile, alternating 50/50 on desktop
5. Framer Motion scroll-reveal animations site-wide
6. Admin panel stays light/white (no dark theme bleed)

---

## User's Design Decisions (Confirmed)

| Decision | Choice |
|---|---|
| Heading font | **Cormorant Garant** (Google Fonts, free) |
| Body font | **Raleway** (Google Fonts, free — from reference image) |
| Mobile navigation | **Bottom tab bar** (replaces hamburger drawer) |
| Scroll animations | **Framer Motion** (`npm install framer-motion`) |
| Admin panel theme | **Keep light** (white/neutral, no dark) |

---

## New Color Palette

From the reference brand image. **Same CSS token names are kept** so all existing Tailwind classes automatically inherit new colors.

| CSS Token | New Hex | Role |
|---|---|---|
| `--color-walnut` | `#20180C` | Page background (darkest — was primary text) |
| `--color-walnut-light` | `#5F4B2B` | Card / section backgrounds (Coffee) |
| `--color-cream` | `#F8E8D2` | Primary text on dark; light surfaces |
| `--color-cream-dark` | `#2A1E0F` | Dividers, card borders in dark context |
| `--color-terracotta` | `#B57031` | Primary accent (buttons, links, active states) |
| `--color-terracotta-light` | `#CA9A56` | Hover state for terracotta |
| `--color-terracotta-dark` | `#8F5620` | Pressed / darker variant |
| `--color-saffron` | `#D4A017` | Keep unchanged — hero tagline accent |
| `--color-stone` | `#A68F67` | Muted / secondary text (Latte) |
| `--color-stone-light` | `#C4A882` | Lighter muted text |

**Body defaults (flip from light to dark):**
```css
body {
  background-color: var(--color-walnut);  /* #20180C */
  color: var(--color-cream);              /* #F8E8D2 */
}
```

---

## Current State of Key Files

### `app/globals.css` (current — to be fully replaced)
```css
@import "tailwindcss";

@theme {
  --color-terracotta: #C25B3F;
  --color-terracotta-light: #D4735A;
  --color-terracotta-dark: #A0432A;
  --color-walnut: #3D2B1F;
  --color-walnut-light: #5C4033;
  --color-saffron: #D4A017;
  --color-saffron-light: #E8B830;
  --color-cream: #FAF6F0;
  --color-cream-dark: #F0E8DC;
  --color-stone: #8B7355;
  --color-stone-light: #A8916E;
  --font-sans: var(--font-helvetica), Helvetica, Arial, sans-serif;
}

@layer base {
  * { border-color: var(--color-cream-dark); }
  body {
    background-color: var(--color-cream);
    color: var(--color-walnut);
  }
}
```

### `app/layout.tsx` (current — font setup to be extended)
```tsx
import localFont from "next/font/local";
const helvetica = localFont({
  src: [
    { path: "../fonts/helvetica-255/Helvetica.ttf", weight: "400", style: "normal" },
    { path: "../fonts/helvetica-255/Helvetica-Oblique.ttf", weight: "400", style: "italic" },
    { path: "../fonts/helvetica-255/Helvetica-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/helvetica-255/Helvetica-BoldOblique.ttf", weight: "700", style: "italic" },
    { path: "../fonts/helvetica-255/helvetica-light-587ebe5a59211.ttf", weight: "300", style: "normal" },
  ],
  variable: "--font-helvetica",
  display: "swap",
});
// <html className={helvetica.variable}>
```

---

## Full Implementation Plan — File by File

### Step 1 — Install dependency
```bash
npm install framer-motion
```
Restart dev server after install.

---

### Step 2 — `app/layout.tsx`
Add Cormorant Garant and Raleway via `next/font/google`. Keep local Helvetica as CSS fallback.

```tsx
import { Cormorant_Garant, Raleway } from "next/font/google";

const cormorantGarant = Cormorant_Garant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-raleway",
  display: "swap",
});

// Apply all three variables on <html>:
// className={`${helvetica.variable} ${cormorantGarant.variable} ${raleway.variable}`}
```

---

### Step 3 — `app/globals.css` (full rewrite)
```css
@import "tailwindcss";

@theme {
  /* New dark gallery palette */
  --color-terracotta: #B57031;
  --color-terracotta-light: #CA9A56;
  --color-terracotta-dark: #8F5620;
  --color-walnut: #20180C;
  --color-walnut-light: #5F4B2B;
  --color-saffron: #D4A017;
  --color-saffron-light: #E8B830;
  --color-cream: #F8E8D2;
  --color-cream-dark: #2A1E0F;
  --color-stone: #A68F67;
  --color-stone-light: #C4A882;

  /* Fonts */
  --font-sans: var(--font-raleway), Helvetica, Arial, sans-serif;
  --font-display: var(--font-cormorant), Georgia, serif;
}

@layer base {
  * {
    border-color: var(--color-cream-dark);
  }

  body {
    background-color: var(--color-walnut);
    color: var(--color-cream);
  }

  h1, h2, h3 {
    font-family: var(--font-display);
  }

  /* Admin panel override — applied via wrapper div in admin layout */
  .light-theme {
    background-color: #ffffff;
    color: #111111;
  }
  .light-theme h1,
  .light-theme h2,
  .light-theme h3 {
    font-family: var(--font-sans);
  }
}
```

---

### Step 4 — `app/(admin)/layout.tsx`
Wrap admin children in the `.light-theme` class to prevent dark body from bleeding into admin views. No admin component files need changes.

Find the existing layout wrapper and add:
```tsx
<div className="light-theme min-h-screen">
  {/* existing admin layout content */}
</div>
```

---

### Step 5 — `components/layout/Navbar.tsx` (auto-hide + transparent)

**Current state:** Client component with Collections dropdown, search, mobile hamburger sheet.

**Changes needed:**
- Add scroll direction tracking with `useEffect`:
  ```tsx
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > lastScrollY.current && y > 60) setHidden(true);
      else if (y < lastScrollY.current) setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  ```
- Apply to nav element:
  ```tsx
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${hidden ? "-translate-y-full" : "translate-y-0"}
    ${scrolled ? "bg-walnut/90 backdrop-blur-sm border-b border-cream-dark/10" : "bg-transparent"}
  `}>
  ```
- On mobile (`< lg`): **remove the hamburger button entirely**. Show only the logo/brand name. The Sheet import and mobile menu JSX can be deleted from this component.
- On desktop (`lg+`): existing full nav (Collections dropdown, About, Contact, Search) stays unchanged.

---

### Step 6 — `components/layout/BottomTabBar.tsx` (NEW FILE)

Create this file. It handles all mobile navigation.

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Search, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Category } from "@/types";

interface BottomTabBarProps {
  categories: Category[];
}

export default function BottomTabBar({ categories }: BottomTabBarProps) {
  const pathname = usePathname();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 60) setHidden(true);
      else if (y < lastScrollY.current) setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isCollections = pathname.startsWith("/category");

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "#collections", icon: Package, label: "Collections", isSpecial: true },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/contact", icon: Mail, label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          bg-walnut/90 backdrop-blur-sm border-t border-cream-dark/20
          transition-transform duration-300
          ${hidden ? "translate-y-full" : "translate-y-0"}
        `}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) =>
            tab.isSpecial ? (
              <button
                key={tab.label}
                onClick={() => setCollectionsOpen(true)}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  isCollections ? "text-terracotta" : "text-stone"
                }`}
              >
                <tab.icon size={22} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            ) : (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  isActive(tab.href) ? "text-terracotta" : "text-stone"
                }`}
              >
                <tab.icon size={22} />
                <span className="text-[10px]">{tab.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Collections bottom sheet */}
      <Sheet open={collectionsOpen} onOpenChange={setCollectionsOpen}>
        <SheetContent side="bottom" className="bg-walnut border-cream-dark/20 rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-cream font-display text-2xl">Collections</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 mt-4 pb-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setCollectionsOpen(false)}
                className="py-3 px-2 text-cream text-lg border-b border-cream-dark/15 hover:text-terracotta transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

### Step 7 — `app/(public)/layout.tsx`
The public layout already fetches categories for the Navbar. Pass them to BottomTabBar too.

```tsx
import BottomTabBar from "@/components/layout/BottomTabBar";

// In the JSX, alongside <Navbar>:
<BottomTabBar categories={categories} />

// Add bottom padding to main content so it doesn't hide behind the tab bar:
<main className="pb-20 lg:pb-0">
  {children}
</main>
```

---

### Step 8 — `components/ScrollReveal.tsx` (NEW FILE)

```tsx
"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

### Step 9 — `components/home/HeroSection.tsx`

**Current state:** Dark walnut background, dot pattern, saffron tagline, cream headline. Already mostly right for dark theme.

**Changes needed:**
- Ensure background is `bg-walnut` (now `#20180C` — matches page bg, create seamless entry)
- Headline: add `font-display` class for Cormorant Garant
- Make headline significantly larger on mobile: `text-5xl sm:text-6xl lg:text-8xl`
- CTA button: full-width on mobile (`w-full sm:w-auto`), keep `bg-terracotta` 
- Wrap headline in a `motion.h1` with a mount animation (scale from 0.96 + fade):
  ```tsx
  import { motion } from "framer-motion";
  // On headline:
  <motion.h1
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="font-display text-5xl sm:text-6xl lg:text-8xl font-semibold text-cream"
  >
    {hero.headline}
  </motion.h1>
  ```

---

### Step 10 — `components/home/CategoryHighlights.tsx`

**Current state:** Horizontal rows with `sm:flex-row` and `w-56` image thumbnails.

**Full redesign — two layouts:**

**Mobile (default, all screens < lg):**
```tsx
// Each category = full-width stacked card
<ScrollReveal key={cat.id} delay={index * 0.1}>
  <Link href={`/category/${cat.slug}`}>
    <div className="relative w-full aspect-[4/5] overflow-hidden">
      <Image src={cat.coverImage} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
    <div className="pt-5 pb-10">
      <h3 className="font-display text-3xl text-cream mb-2">{cat.name}</h3>
      <p className="text-stone text-sm leading-relaxed">{cat.description}</p>
      <span className="text-terracotta text-sm mt-3 inline-flex items-center gap-2">
        Explore Collection <ArrowRight size={14} />
      </span>
    </div>
  </Link>
</ScrollReveal>
// Thin divider between cards:
<div className="border-b border-cream-dark/20" />
```

**Desktop (lg+) — alternating 50/50 split:**
```tsx
// Apply on lg: breakpoint using Tailwind
// even index: image left, text right
// odd index: image right, text left (use lg:flex-row-reverse)
<div className={`hidden lg:flex items-stretch h-[65vh] ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
  <div className="relative w-1/2 overflow-hidden">
    <Image src={cat.coverImage} fill className="object-cover" />
  </div>
  <div className="w-1/2 flex flex-col justify-center px-16">
    <h3 className="font-display text-6xl text-cream mb-4">{cat.name}</h3>
    <p className="text-stone leading-relaxed mb-6">{cat.description}</p>
    <Link href={`/category/${cat.slug}`} className="text-terracotta inline-flex items-center gap-2">
      Explore Collection <ArrowRight size={16} />
    </Link>
  </div>
</div>
```

**Key:** Mobile cards use `<div className="lg:hidden">` wrapper, desktop cards use `<div className="hidden lg:flex">` — both rendered in the same loop.

---

### Step 11 — `components/items/ItemCard.tsx`

**Current state:** `hover:bg-cream-dark/40`, `text-walnut` headings, `text-stone` description.

**Changes:**
- `hover:bg-walnut-light/60` (was `hover:bg-cream-dark/40`)
- `text-walnut` on title → `text-cream`
- `group-hover:text-terracotta` → unchanged (still terracotta on hover)
- Image container bg: `bg-walnut-light` (was `bg-cream-dark`)
- **Mobile layout change:** Always full-width image on top (remove `sm:flex-row`). On mobile the image should be `aspect-[4/3]` full width, with text below. Keep `sm:flex-row` side-by-side only on `sm` and up — or make it always stacked. Decision: keep `sm:flex-row` for tablet+, always stacked on mobile (< sm).

---

### Step 12 — `components/items/ItemGrid.tsx`

Change `divide-cream-dark` → `divide-cream-dark/20` for a subtler divider on dark background.

---

### Step 13 — `app/(public)/about/page.tsx`

**Changes:**
- `text-walnut` headings → `text-cream`
- `bg-cream-dark` craft cards → `bg-walnut-light`
- `text-stone` → unchanged (latte reads fine on dark)
- Wrap each paragraph and craft grid in `<ScrollReveal delay={...}>` with staggered delays
- Enquiry box: `bg-walnut-light` (was `bg-cream-dark`)

---

### Step 14 — `components/layout/Footer.tsx`

**Current state:** `bg-walnut text-cream/70` — already dark. With new palette, `walnut` is now `#20180C` so the footer and page background will be the same color.

**Fix:** Add a top border to visually separate footer from page:
```tsx
<footer className="bg-walnut border-t border-cream-dark/20 text-cream/70 mt-20">
```

Or give the footer a slightly lighter bg: `bg-walnut-light` (`#5F4B2B`) for contrast against the page.

---

## Scroll Animation Rollout Summary

| Location | Animation | Notes |
|---|---|---|
| Hero headline | Mount: scale 0.96→1 + fade | Triggers on page load, not scroll |
| Home intro section | `ScrollReveal` | Single block |
| Category cards (home) | `ScrollReveal delay={index * 0.1}` | Staggered per card |
| Home enquiry section | `ScrollReveal` | Single block |
| About — paragraphs | `ScrollReveal delay={index * 0.15}` | Each paragraph |
| About — craft cards | `ScrollReveal delay={index * 0.1}` | Each craft card |
| Item list (ItemCard) | `ScrollReveal delay={index * 0.08}` | Applied in ItemGrid loop |

---

## Mobile Padding / Safe Area

Add to `app/(public)/layout.tsx` main wrapper:
```tsx
<main className="pb-20 lg:pb-0">
```

Bottom tab bar itself:
```tsx
style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
```
This handles iPhone notch/home indicator safe areas.

---

## Admin Panel Protection

- `.light-theme` class in `globals.css` resets background to white and text to dark
- Applied via a wrapper `<div className="light-theme min-h-screen">` in `app/(admin)/layout.tsx`
- **No admin component files need to be touched**
- AdminSidebar, ItemForm, CategoryForm, EnquiryPage — all stay as-is

---

## New Files to Create

| File | Purpose |
|---|---|
| `components/layout/BottomTabBar.tsx` | Mobile bottom navigation with auto-hide |
| `components/ScrollReveal.tsx` | Framer Motion scroll-reveal wrapper |

---

## Files to Modify

| File | What Changes |
|---|---|
| `app/globals.css` | Full color token rewrite, dark body, heading font, `.light-theme` class |
| `app/layout.tsx` | Add Cormorant Garant + Raleway Google Fonts |
| `app/(public)/layout.tsx` | Add `<BottomTabBar>`, add `pb-20 lg:pb-0` to main |
| `app/(admin)/layout.tsx` | Wrap content in `<div className="light-theme">` |
| `components/layout/Navbar.tsx` | Auto-hide scroll, transparent top, remove mobile hamburger |
| `components/home/HeroSection.tsx` | Larger mobile heading, Cormorant font, mount animation |
| `components/home/CategoryHighlights.tsx` | Full redesign: portrait mobile, 50/50 desktop |
| `components/items/ItemCard.tsx` | Dark color updates, mobile layout tweak |
| `components/items/ItemGrid.tsx` | Divider color update |
| `app/(public)/about/page.tsx` | Dark colors, ScrollReveal wrapping |
| `components/layout/Footer.tsx` | Add border-top divider |

---

## Manual Steps After Implementation

1. **Restart dev server** after `npm install framer-motion` and font changes
2. **Check admin panel** — log in to `/admin`, verify all forms/tables remain legible on white background
3. **Check category cover images** — they will now display at 4:5 portrait ratio on mobile and 65vh on desktop; low-res images may look blurry and need re-uploading via the admin panel
4. **Test on real mobile device** — especially:
   - Bottom tab bar auto-hide on scroll
   - Collections bottom sheet
   - Hero heading scale and Cormorant Garant rendering
   - iPhone safe area padding (no content behind home indicator)
5. **Check Tailwind class clashes** — any hardcoded `bg-white`, `text-black`, or `bg-gray-*` outside the admin panel will need to be updated
