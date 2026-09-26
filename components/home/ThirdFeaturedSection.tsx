import Image from "next/image";

// StoriesCovermain2.png is a 2480×2480 canvas with transparent padding around the
// shrine (measured: the shrine occupies a 967×1714 box starting at 749,535). The
// wrapper below is cut to exactly that box and the full canvas is offset/scaled inside
// it, so it's the visible shrine — not the padded file — that ends up centered in the
// panel.
const CANVAS = 2480;
const SHRINE = { left: 749, top: 535, width: 967, height: 1714 };

export default function ThirdFeaturedSection() {
  return (
    <div className="relative h-full w-full bg-[#AD6F3B] flex flex-col items-center justify-center">
      {/* Text — same formatting/colors as the Collections↔Research panel (FeaturedSection.tsx) */}
      <div className="mb-2 text-center px-6 lg:px-16">
        <p className="text-[#0a0a0a] text-base font-bold leading-snug">
          國志曰：國地本龍池也。
        </p>
        <p className="text-[#0a0a0a] text-base mt-1 leading-snug">
          Guó zhì yuē: guó dì běn lóng chí yě.
        </p>
        <p className="text-[#FAF6F0] text-base mt-2 leading-relaxed max-w-xl">
          &ldquo;The history of the country (Kashmir) says:
          <br />
          This country was once a dragon lake.&rdquo;
        </p>
        <p className="text-[#FAF6F0] text-xs lg:text-sm mt-1">
          Xuanzang, The Great Tang Records on the Western Regions, Book III, 7th century.
        </p>
      </div>

      <div
        className="relative h-[min(80vw,70vh)] lg:h-[70vh] overflow-hidden"
        style={{ aspectRatio: `${SHRINE.width} / ${SHRINE.height}` }}
      >
        <Image
          src="/StoriesCovermain2.png"
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
