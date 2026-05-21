import Image from "next/image";

export default function FeaturedSection() {
  return (
    <div className="relative h-full w-full bg-[#3f4d42]">

      {/* Mobile: centered; Desktop: pinned to bottom */}
      <div className="absolute inset-0 lg:inset-auto lg:bottom-0 lg:left-0 lg:right-0 flex flex-col items-center justify-center lg:justify-end text-center px-6 lg:px-16">

        {/* Text — sits immediately above image */}
        <div className="mb-2">
          <p className="text-[#0a0a0a] text-sm sm:text-lg lg:text-xl font-bold leading-snug">
            कश्मीरा हि महाभागा देशानामुत्तमोत्तमा ।
          </p>
          <p className="text-[#0a0a0a] text-xs sm:text-base lg:text-lg mt-1 leading-snug">
            Kaśmīrā hi mahābhāgā deśānām uttamottamā.
          </p>
          <p className="text-[#D4A017] text-xs sm:text-base lg:text-lg mt-2 leading-relaxed italic max-w-xl">
            Kashmir is greatly fortunate, the finest among lands.
          </p>
        </div>

        {/* Image — correct aspect ratio (2480×2034), no letterboxing */}
        <div className="relative w-full max-w-[min(90vw,80vh)] aspect-[2480/2034]">
          <Image
            src="/FeaturedPannelImage1.jpeg"
            alt="Kashmir"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}
