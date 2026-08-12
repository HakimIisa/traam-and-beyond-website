"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SAFETY_TIMEOUT = 8000; // ms — auto-hide if a navigation never actually completes

export default function NavigationLoadingOverlay() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Hide once the route has actually changed and the new page has mounted
  useEffect(() => {
    setLoading(false);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const samePath = url.pathname === window.location.pathname;
      const sameSearch = url.search === window.location.search;
      if (samePath && sameSearch) return; // same page, incl. a pure hash-only jump

      setLoading(true);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => setLoading(false), SAFETY_TIMEOUT);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        >
          <motion.div
            animate={
              prefersReducedMotion
                ? { opacity: 0.8 }
                : { scale: [0.9, 1.05, 0.9], opacity: [0.4, 1, 0.4] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src="/Logo.png"
              alt="Loading"
              width={240}
              height={240}
              className="h-24 w-auto"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
