import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Developer — Traam and Beyond",
  description: "Hakim Iisa — Co-Founder of SEER, developer of Traam and Beyond.",
};

export default function DeveloperPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

      {/* Profile */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">
        <div className="relative w-56 h-56 sm:w-80 sm:h-80 shrink-0 rounded-full overflow-hidden border border-cream/20">
          <Image
            src="/DeveloperImage.jpeg"
            alt="Hakim Iisa"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left flex flex-col justify-center sm:pt-10">
          <h1 className="font-display text-3xl sm:text-5xl text-cream mb-1">
            Hakim Iisa
          </h1>
          <p className="text-terracotta text-sm tracking-widest uppercase mb-1">
            Director — SEER
          </p>
          <p className="text-stone text-sm">Developer · Traam and Beyond</p>
        </div>
      </div>

      <div className="border-t border-white/10 mb-10" />

      {/* Contact & Social */}
      <div className="flex flex-col gap-5">
        <a
          href="mailto:hakimohdiisa@gmail.com"
          className="flex items-center gap-4 group"
        >
          <Mail size={18} className="text-terracotta shrink-0" />
          <span className="text-stone text-sm group-hover:text-cream transition-colors duration-200">
            hakimohdiisa@gmail.com
          </span>
        </a>

        <a
          href="https://www.linkedin.com/in/mohammad-iisa-hakim-099863362"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-terracotta shrink-0">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
          </svg>
          <span className="text-stone text-sm group-hover:text-cream transition-colors duration-200">
            linkedin.com/in/mohammad-iisa-hakim-099863362
          </span>
        </a>

        <a
          href="https://www.instagram.com/hakim_essa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta shrink-0">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          <span className="text-stone text-sm group-hover:text-cream transition-colors duration-200">
            @hakim_essa
          </span>
        </a>

        <a
          href="https://www.instagram.com/seerarchitects/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta shrink-0">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          <span className="text-stone text-sm group-hover:text-cream transition-colors duration-200">
            @seerarchitects
          </span>
        </a>
      </div>

    </div>
  );
}
