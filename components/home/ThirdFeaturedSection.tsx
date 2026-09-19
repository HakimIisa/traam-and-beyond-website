import Image from "next/image";

// FeaturedBackground3.png is a 2480×2480 canvas with transparent padding around the
// shrine (measured: the shrine occupies a 1056×1874 box starting at 702,370 — slightly
// below the canvas centre). The wrapper below is cut to exactly that box and the full
// canvas is offset/scaled inside it, so it's the visible shrine — not the padded file —
// that ends up centered in the panel.
const CANVAS = 2480;
const SHRINE = { left: 702, top: 370, width: 1056, height: 1874 };

export default function ThirdFeaturedSection() {
  return (
    <div className="relative h-full w-full bg-[#AD6F3B] flex items-center justify-center">
      <div
        className="relative h-[min(80vw,70vh)] lg:h-[70vh] overflow-hidden"
        style={{ aspectRatio: `${SHRINE.width} / ${SHRINE.height}` }}
      >
        <Image
          src="/FeaturedBackground3.png"
          alt="Engraved silver shrine niche holding a seated Buddha"
          width={CANVAS}
          height={CANVAS}
          className="absolute max-w-none"
          style={{
            width: `${(CANVAS / SHRINE.width) * 100}%`,
            height: `${(CANVAS / SHRINE.height) * 100}%`,
            left: `${(-SHRINE.left / SHRINE.width) * 100}%`,
            top: `${(-SHRINE.top / SHRINE.height) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
