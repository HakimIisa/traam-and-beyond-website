# Our Story Timeline Implementation

**Date:** April 21, 2026
**Scope:** Replaced the static "Our Story" section on the About page with an immersive, scroll-driven timeline layout.

---

## 1. Content Extraction & Data Formatting
- Originally received a Word document (`public/AboutOurStoryContent.docx`) containing 5 eras of the brand's history.
- Extracted and mapped the text natively into a `STORIES` array.
- Segregated `era` (e.g. "February 2004"), `shortEra` (e.g., "2004" for the UI tracker), and contextual `location` strings.
- Added a logic handler in the UI mapping block that finds `**...**` markdown-style syntax strings and specifically formats them to render as bold, isolated final-thought paragraphs.

## 2. The "Hidden Swap" Architecture
To achieve the user's request of swapping images transparently while scrolling—preventing jarring crossfades mid-view—we implemented the following z-indexed split architecture:

- **Layer 1: The Sticky Background Engine (`z-[1]`)**
  - Handled via `components/about/OurStoryTimeline.tsx`.
  - Used `sticky top-0 h-screen overflow-hidden bg-black` to lock the background in place relative only to the timeline component itself. This safely scoped the black background and prevented it from bleeding over the fixed hero designs on the rest of `app/(public)/about/page.tsx`.
  - All images are rendered using Next.js `<Image>` with `fill` and `object-contain`. Since images natively have a black background, framing them inside the `bg-black` container seamlessly allows their "natural 1:1 proportions" to center gracefully on all devices without awkwardly stretching.
  - Image paths mapped cleanly: `Story 1.jpg.jpeg`, `Story 2.jpg.jpeg`, `Story 3.jpg.jpeg`, `Story 4.jpg.jpeg`.

- **Layer 2: The Scrollable Foreground (`z-[2]`)**
  - Text panels were heavily padded (`min-h-[75vh]`) with opaque `bg-[#1a130a]` colors to match the website's dark aesthetic.
  - Using `framer-motion`'s `useInView` hook attached to each block (with a `-45% 0px -45% 0px` margin trigger), the layout precisely tracks which text block is actively crossing the screen's vertical dead center.
  - Upon crossing, the `activeIndex` state updates, telling the Background Engine beneath it to swap the active image's `opacity`. Because the swapping occurs securely *behind* the opaque `<TextBlock />`, the user never sees it change.
  - A `<div className="w-full aspect-square lg:h-[85vh] bg-transparent" />` spacer follows each text block, acting as the transparent "window" that eventually scrolls into view to cleanly reveal the perfectly loaded image lying in wait.

## 3. The Organic SVG Timeline Indicator
The user requested a vintage-themed visual tracker for the timeline that wasn't perfectly straight, matching the archaic tone of the project.

- Rendered `TimelineIndicator`, firmly attached on the right-hand side (`fixed right-4 lg:right-10 top-1/2 -translate-y-1/2 z-[50]`).
- **Organic Dots:** Created an SVG `<path>` component mimicking a hand-drawn, irregular blotch (`OrganicDot`), which geometrically expands, glows `terracotta`, and displays its corresponding short Era year string seamlessly upon activation.
- **The Rough Line:** Created `OrganicLine`. Bypassing complex scroll spy path mapping, we leveraged an incredibly lightweight math trick using SVG `feTurbulence` (fractal noise) and `feDisplacementMap`. This SVG-level filter is dynamically attached to an otherwise perfectly straight vertically-dashed element `line`. The result is a brilliantly organic, roughly-drawn vintage wavy line that binds the dots smoothly behind the scenes.

## 4. Component Restoration & Safety Fixes
- Initially prototyped inside `components/home/OurStorySection.tsx` by mistake. This code block was completely reverted back to its original layout to preserve Home Page fidelity.
- Pushed the entire timeline layout correctly into its own component tree `components/about/OurStoryTimeline.tsx`, placing it inside `<section id="introduction">` on the About Page.
- By using `-mt-[100vh]` on the foreground layer to force it functionally upward overlapping the nested `sticky` background, the immersive experience was flawlessly separated from the DOM hierarchy.
