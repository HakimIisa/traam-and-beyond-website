# Our Story Timeline: Original Idea & Implementation Plan

## The Original Idea
The client requested a complete overhaul of the "Our Story" section on the About page to act as an interactive, scroll-driven visual timeline. The core creative mechanisms requested were:
- Breaking the story narrative down into discrete, sequential "eras" (e.g. February 2004, March 2010... Present day).
- Introducing a 1:1 image for each era that highlights the Kashmiri craft associated with that section in the timeline.
- Establishing an immersive parallax layout: 
  - Each text chunk acts as a completely opaque scrolling panel.
  - Between each text panel sits an explicitly transparent "window" (1:1 on mobile viewports, wide vertically-constrained gap on desktop).
  - A fixed plane sits securely behind the scrolling items and holds the images.
- **The Visual Magic:** The images in the background plane must dynamically swap exactly as the text blocks scroll over them. By the time a new gap slides into view, the background image has seamlessly transitioned completely out of sight.
- **Timeline Progress Tracker:** A visually-interesting right-aligned vertical line and dotted indicator tracking the user's progress through the eras.

---

## The Implementation Plan
To bring this idea to life without causing jarring crossfade transitions or overlapping DOM clipping issues globally on the site, the following architectural plan was devised to execute the vision seamlessly:

### 1. Data Structuring
Parse the provided `AboutOurStoryContent.docx` and map the descriptive text, era dates, and geography strictly into a clean `STORIES` array payload. This drives a cleanly mapped React component, efficiently mitigating the need to hardcode each era into its own fragile markup block.

### 2. The 2-Layer "Hidden Swap" Architecture
A component with a split Z-index axis separates the static transitioning background from the scrollable reading narrative.
* **The Background Layer (`z-[1]`):** A deeply scoped `sticky top-0 h-screen bg-black` container locks itself dynamically to the element's overall bounding height. It holds perfectly centered, absolutely stacked Next.js `<Image>` tags mapping safely to their natural 1:1 ratios. Opacity transitions trigger smoothly powered by a shared `activeIndex` variable.
* **The Foreground Layer (`z-[2]`):** By applying `-mt-[100vh]` CSS to the scroll parent, the foreground elegantly pulls itself over the sticky background underneath. The scroll map iterates alternating intensely-padded TextBlocks with pure transparent void Windows.
* **Intersection Observers:** When an opaque `<TextBlock>` slides past the exact vertical center of the viewport (detected seamlessly via `framer-motion`'s `useInView` hook targeting `-45%` vertical margins), it flags the `activeIndex`. This instantly triggers the background image transition natively—completely out of the user's visual sightline.

### 3. Layout Dimensions & Adjustments
* **Mobile Viewing:** Requires a strictly `1:1` viewing gallery window, trivially achieved via an `aspect-square` tailwind declaration across the void component.
* **Desktop Viewing:** Desktop uses highly immersive cinematic spacing, artificially mapped through `h-[85vh]` to limit unnecessary vertical sprawl while still cleanly capturing the squared image assets natively.

### 4. Custom SVG Organic Tracking Theme
An `feTurbulence` SVG overlay filter was mapped to manipulate a standard vertically-dashed baseline coordinate. This creates an instantly "drawn", rustic squiggly line perfectly mimicking imperfect handcrafted themes to honor the Kashmiri antiquities discussed in the section, avoiding a rigid, corporate timeline feel perfectly.
