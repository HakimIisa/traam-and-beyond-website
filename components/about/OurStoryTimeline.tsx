"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";

const STORIES = [
  {
    era: "February 2004",
    shortEra: "2004",
    location: "Jawaharnagar, Srinagar",
    text: [
      "It was an evening like any other. During a casual stroll in my neighbourhood with mummy, we passed by this shop selling Kashmiri copperware, locally called “Traam”. My eyes fell upon an antique bowl with hand engraved and enamelled floral rim, it's patina worn off, just sitting there on a shelf among its fresh counterparts. Someone had once taken the time to craft it, while someone else, after years of use, had sold it by weight, in exchange for something new, a practice not uncommon even today.",
      "I couldn't look away. Mummy noticed, and got me that for 300 Indian rupees. She had no way of knowing, and nor did I, that she had brought me not just a bowl, but inspired the beginning of something beautiful and meaningful. That bowl still sits with me today. The first masterpiece. The one from where it all started."
    ],
    image: "/aboutImages/Story 1.jpg.jpeg"
  },
  {
    era: "March 2010",
    shortEra: "2010",
    location: "Jawaharnagar, Srinagar",
    text: [
      "Dadi, my dear grandmother, gave me a small papier-mâché box, delicate and worn, with a beautiful miniature painted on a soft pastel green background. I had seen it all my life, tucked away carefully in her steel chest that she kept under the bed, always wondering about its story. “My grandfather made it. Take care of it, it’s very dear to me”, she said smiling, before putting it in my hands."
    ],
    image: "/aboutImages/Story 2.jpg.jpeg"
  },
  {
    era: "July 2017",
    shortEra: "2017",
    location: "Munawarabad, Srinagar",
    text: [
      "Babi, my dear maternal grandmother, showed me a papier-mâché table lamp from her father. The surface was adorned with chinar leaf motifs, each one traced in real gold that caught the light and shimmered softly. She told me about his handicraft business by the name of “M. Qasim and Sons”. This lamp was the only physical memory she had kept of her father’s handicraft empire. Weeks later, after having some small repairs done, she placed the lamp in my care. There was no ceremony, just a quiet, deliberate gesture of trust. Now it sits with me, its surface glittering, as though the gold holds onto light the way memory holds onto time."
    ],
    image: "/aboutImages/Story 3.jpg.jpeg"
  },
  {
    era: "June 2018",
    shortEra: "2018",
    location: "Pampore, Pulwama",
    text: [
      "I bought a samovar, and not just any samovar, but the most beautiful one I had ever seen. Light as a feather, the hand carving on it is unbelievably intricate, every detail telling a story of patience and craft. I couldn’t stop running my fingers over the motifs, almost in disbelief that it’s now part of my collection.",
      "What makes it even more special is that I bought it with my first salary. There’s something deeply satisfying about that, like this piece carries not just artistry, but a memory of a beginning."
    ],
    image: "/aboutImages/Story 4.jpg.jpeg"
  },
  {
    era: "Present day",
    shortEra: "Present",
    location: "Milan, Italy",
    text: [
      "Looking back, I think the fondness was always there, quietly building, long before that evening stroll in Srinagar. Growing up in a cultural context full of arts and crafts, I was unknowingly getting sensitized to the colours, the motifs and the patience embedded in every hand-made Kashmiri craft. Learning about them was my solace and collecting them became my way of holding on to my cultural heritage.",
      "It followed me through architecture school, where I found myself endlessly drawn to the way Kashmiri vernacular buildings and local handicrafts were never really separate things, but the same story, told in different forms. That understanding has quietly shaped much of my local work aimed at incorporating tractional handicrafts into contemporary architectural practices as a means to their revival.",
      "But I won't pretend it hasn't been painful to grasp that so many crafts are already gone. The ones that remain are often shadows of what they once were. That is what really motivates me to document these masterpieces across different mediums, with an idea of creating a repository, not just of the objects, but their stories, as evidence of a legacy worth remembering, for the new generation to see, and hopefully be inspired from, just as I was!",
      "Many of the pieces in this collection have made their way back to Kashmir from Europe and America, returned home, where they belong!",
      "**This space exists in the hope that someone, somewhere, stops the way I did, in front of something they cannot look away from, and gather the courage to pursue.**"
    ],
    image: null
  }
];

function OrganicDot({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" className={`transition-all duration-700 ease-out drop-shadow-md ${active ? "text-terracotta scale-125 fill-current" : "text-stone/30 fill-current scale-75"}`}>
      <path d="M6.2 0.8 C8.5 0.5 11 2 11.2 5 C11.5 8 9.5 11 6.5 11.2 C3.5 11.5 0.5 9.5 0.8 6 C1 3 3.5 1.5 6.2 0.8 Z" />
    </svg>
  );
}

function OrganicLine() {
  return (
    <svg className="absolute inset-x-0 w-full h-full -z-10 pointer-events-none pb-[12px]" preserveAspectRatio="none">
      <defs>
        <filter id="roughpaper">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <line x1="50%" y1="20px" x2="50%" y2="calc(100% - 20px)" stroke="currentColor" className="text-stone/30" strokeWidth="1.5" strokeDasharray="3 5" filter="url(#roughpaper)" />
    </svg>
  );
}

function TimelineIndicator({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 z-[50] flex-col items-center">
      <div className="relative flex flex-col space-y-10 lg:space-y-14 py-2">
        <OrganicLine />
        {STORIES.map((story, i) => (
          <div key={i} className="relative flex items-center justify-center group h-4">
            <OrganicDot active={activeIndex === i} />
            <div className={`absolute right-full mr-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeIndex === i ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-2'}`}>
              <span className="text-xs lg:text-sm whitespace-nowrap text-terracotta font-serif tracking-widest uppercase">
                {story.shortEra}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextBlock({ story, index, setActiveIndex, setImageIndex }: { story: typeof STORIES[0], index: number, setActiveIndex: (i: number) => void, setImageIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // Timeline indicator: fires when panel is at viewport center
  const isCentered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  // Image swap: fires when panel is in upper portion (previous transparent window is already off-screen)
  const isNearTop = useInView(ref, { margin: "-20% 0px -70% 0px" });

  useEffect(() => {
    if (isCentered) setActiveIndex(index);
  }, [isCentered, index, setActiveIndex]);

  useEffect(() => {
    if (isNearTop) setImageIndex(index);
  }, [isNearTop, index, setImageIndex]);

  return (
    <div ref={ref} className="bg-[#1a130a] w-full py-28 lg:py-40 px-6 lg:px-20 min-h-[75vh] flex flex-col justify-center items-center relative z-10">
      <div className="max-w-2xl w-full mx-auto text-center space-y-6">
        <h3 className="font-display text-4xl lg:text-5xl text-cream mb-2">{story.era}</h3>
        <p className="text-terracotta text-sm uppercase tracking-widest font-semibold mb-8">{story.location}</p>
        
        <div className="space-y-6">
          {story.text.map((paragraph: string, i: number) => {
            const isBold = paragraph.startsWith("**") && paragraph.endsWith("**");
            if (isBold) {
              return (
                <p key={i} className="text-cream text-lg lg:text-xl font-bold leading-relaxed pt-10 border-t border-white/5 mt-10">
                  {paragraph.replace(/\*\*/g, "")}
                </p>
              );
            }
            return (
              <p key={i} className="text-[#DAC4A1] text-base lg:text-lg leading-relaxed text-justify lg:text-center">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function OurStoryTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);   // drives timeline indicator
  const [imageIndex, setImageIndex] = useState(0);     // drives background image swap

  return (
    <div className="relative w-full bg-[#1a130a]">
      <TimelineIndicator activeIndex={activeIndex} />

      {/* Sticky background layer */}
      <div className="sticky top-0 h-screen w-full z-[1] bg-[#0a0a0a] flex items-center justify-center pointer-events-none overflow-hidden">
        {STORIES.map((story, i) => {
          if (!story.image) return null;
          return (
            <Image
              key={i}
              src={story.image}
              alt={story.era}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`object-contain transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                imageIndex === i ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      {/* Foreground pulled up to overlap the sticky background */}
      <div className="relative z-[2] w-full flex flex-col -mt-[100vh]">
        {/* "Our Story" title — opaque, sits at very top, does not affect sticky container position */}
        <div className="bg-[#1a130a] w-full pt-24 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-5xl sm:text-6xl text-cream">Our Story</h2>
          </div>
        </div>
        {STORIES.map((story, i) => (
          <div key={i} className="w-full">
            <TextBlock story={story} index={i} setActiveIndex={setActiveIndex} setImageIndex={setImageIndex} />
            {story.image && (
              <div className="w-full aspect-square lg:h-[85vh] bg-transparent pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
