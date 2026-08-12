"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Persists an element's horizontal scroll position to sessionStorage and restores it
 * on remount — for horizontally-scrollable strips whose scrollLeft the browser's native
 * back/forward scroll restoration doesn't track (it only restores document scrollY).
 */
export function useScrollPositionRestore(
  ref: RefObject<HTMLElement | null>,
  key: string
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const stored = sessionStorage.getItem(key);
    if (stored !== null) {
      el.scrollLeft = parseInt(stored, 10) || 0;
    }

    let frame: number;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        sessionStorage.setItem(key, String(el.scrollLeft));
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
      sessionStorage.setItem(key, String(el.scrollLeft));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
