"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import OurStoryTimeline from "@/components/about/OurStoryTimeline";
import CraftHeritageTimeline from "@/components/about/CraftHeritageTimeline";

export default function AboutPageClient() {
  const ourStoryRef = useRef<HTMLDivElement>(null);
  const craftHeritageRef = useRef<HTMLDivElement>(null);

  // Each section's indicator is visible only while that section is in the viewport
  const ourStoryVisible = useInView(ourStoryRef);
  const craftHeritageVisible = useInView(craftHeritageRef);

  return (
    <div>
      <section id="introduction" className="relative z-10" ref={ourStoryRef}>
        <OurStoryTimeline visible={ourStoryVisible && !craftHeritageVisible} />
      </section>

      <section id="craft-heritage" className="relative z-10" ref={craftHeritageRef}>
        <CraftHeritageTimeline visible={craftHeritageVisible} />
      </section>
    </div>
  );
}
