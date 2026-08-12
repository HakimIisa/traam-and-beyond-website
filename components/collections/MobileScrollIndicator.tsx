"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRACK_INSET = 80; // px reserved top/bottom — clears navbar and bottom tab bar
const MIN_THUMB = 24; // px — visual bar stays graspable/visible even on very long pages
const MIN_HIT_AREA = 44; // px — meets the 44x44 minimum touch target, even when the visual bar is thinner
const HIDE_DELAY = 1000; // ms of no scroll before fading out

export default function MobileScrollIndicator() {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [thumb, setThumb] = useState({ height: MIN_THUMB, top: 0 });
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);

  const computeGeometry = useCallback(() => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const trackHeight = window.innerHeight - TRACK_INSET * 2;
    const thumbHeight = Math.max(MIN_THUMB, (window.innerHeight / doc.scrollHeight) * trackHeight);
    return { scrollable, trackHeight, thumbHeight };
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (!isDraggingRef.current) setVisible(false);
    }, HIDE_DELAY);
  }, []);

  useEffect(() => {
    const updateFromScroll = () => {
      const { scrollable, trackHeight, thumbHeight } = computeGeometry();
      if (scrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      const thumbTop = progress * (trackHeight - thumbHeight);

      setThumb({ height: thumbHeight, top: thumbTop });
      setVisible(true);
      if (!isDraggingRef.current) scheduleHide();
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [computeGeometry, scheduleHide]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { scrollable, trackHeight, thumbHeight } = computeGeometry();
    if (scrollable <= 0) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    isDraggingRef.current = true;
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisible(true);
    setPressed(true);

    const startY = e.clientY;
    const startScrollY = window.scrollY;
    const usableTrack = trackHeight - thumbHeight;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const scrollDelta = usableTrack > 0 ? (deltaY / usableTrack) * scrollable : 0;
      window.scrollTo({ top: startScrollY + scrollDelta });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setPressed(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      scheduleHide();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const hitAreaHeight = Math.max(MIN_HIT_AREA, thumb.height);
  const hitAreaTop = thumb.top - (hitAreaHeight - thumb.height) / 2;

  return (
    <>
      {/* Hide the native mobile scrollbar while this page is mounted, so only the custom thumb shows */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          html {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          html::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
      {/* Track: pointer-events-none so it never blocks normal page scrolling except exactly on the thumb's hit area below */}
      <div
        className="lg:hidden fixed right-0 w-12 pointer-events-none z-40"
        style={{ top: TRACK_INSET, bottom: TRACK_INSET }}
        aria-hidden="true"
      >
        {/* Hit area: wider/taller than the visual bar to meet and exceed the 44x44 touch target minimum */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute right-0 w-12 pointer-events-auto touch-none cursor-grab active:cursor-grabbing"
          style={{ height: hitAreaHeight, top: hitAreaTop }}
        >
          <div
            className={`absolute right-1 top-0 bottom-0 rounded-full bg-terracotta transition-all duration-200 ease-out motion-reduce:transition-none ${
              pressed ? "w-1.5" : "w-0.5"
            }`}
            style={{ opacity: visible ? 0.85 : 0 }}
          />
        </div>
      </div>
    </>
  );
}
