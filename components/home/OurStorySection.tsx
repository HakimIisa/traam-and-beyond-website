import Image from "next/image";
import type { AboutContent } from "@/types/about-content";

interface OurStorySectionProps {
  content: AboutContent["introduction"];
}

const MOBILE_P1 =
  "In 2004, my mother bought me a copper bowl for three hundred Indian rupees in Srinagar. She had no way of knowing, and nor did I, that she had brought me not just a bowl, but inspired the beginning of something beautiful and meaningful……";

const MOBILE_P2 =
  "This is a space for the handcrafted Kashmiri masterpieces, left behind or forgotten, their stories fading away quietly, and our legacy worth remembering";

export default function OurStorySection({ content }: OurStorySectionProps) {
  return (
    <>
      {/* ── ALL SCREENS: fixed background plane ── */}
      <div className="fixed inset-0 z-[1] bg-[#FAF6F0] flex flex-col items-center justify-center">
        <div className="w-full max-w-lg mx-auto flex flex-col">

          <Image
            src="/OurStory1.png"
            alt="Kashmiri craft detail"
            width={2480}
            height={1752}
            className="w-full h-auto"
            sizes="(min-width: 1024px) 512px, 100vw"
          />

          <div className="px-6 py-5 text-center space-y-3">
            <p className="text-[#1a130a] text-base leading-relaxed">{MOBILE_P1}</p>
            <p className="text-[#D4A017] text-base leading-relaxed font-semibold">{MOBILE_P2}</p>
          </div>

          <Image
            src="/OurStory2.png"
            alt="Kashmiri craft detail"
            width={2480}
            height={1745}
            className="w-full h-auto"
            sizes="(min-width: 1024px) 512px, 100vw"
          />

        </div>
      </div>
    </>
  );
}
