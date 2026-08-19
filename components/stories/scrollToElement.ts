// The site navbar (components/layout/Navbar.tsx) hides itself while scrolling
// down and reappears while scrolling up, so the clearance needed at a scroll
// destination isn't constant: landing below where you started ends with the
// navbar hidden (0px to clear), landing above ends with it visible again
// (~navbar height to clear). A plain scrollIntoView()/scroll-margin-top can't
// be direction-aware, so the target position is computed manually here.
//
// Shared by StoriesPageClient.tsx (TOC/drawer navigation) and StoryBlock.tsx
// (re-anchoring scroll when a story collapses back down, so the page doesn't
// end up pointing at whatever used to be far below the now-shorter content).
export function scrollToElement(el: HTMLElement) {
  const currentY = window.scrollY;
  const targetTop = el.getBoundingClientRect().top + currentY;
  const scrollingUp = targetTop < currentY;
  const NAVBAR_CLEARANCE = 96;

  window.scrollTo({
    top: Math.max(0, targetTop - (scrollingUp ? NAVBAR_CLEARANCE : 0)),
    behavior: "smooth",
  });
}
