import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-walnut-light border-t border-cream-dark/20 text-cream/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="text-cream text-lg font-semibold mb-2">
              Traam and Beyond
            </p>
            <p className="text-sm max-w-xs leading-relaxed">
              Silenced crafts, Speaking again
            </p>
            <p className="text-sm leading-relaxed mt-2 whitespace-nowrap">
              Timeless Kashmiri Treasures Curated by Hakim Ali Reza
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm hover:text-cream transition-colors">About</Link>
              <Link href="/collections" className="text-sm hover:text-cream transition-colors">Our Collections</Link>
              <Link href="/research" className="text-sm hover:text-cream transition-colors">Research</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/stories" className="text-sm hover:text-cream transition-colors">Stories</Link>
              <Link href="/buy-from-artisans" className="text-sm hover:text-cream transition-colors">Buy from Artisans</Link>
              <Link href="/contact" className="text-sm hover:text-cream transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-cream/10 text-xs text-center space-y-1">
          <p>© {new Date().getFullYear()} Traam and Beyond. All rights reserved.</p>
          <Link href="/developer" className="hover:text-cream transition-colors">
            Developed by <span className="font-display text-base">Hakim Iisa</span> · Director - SEER
          </Link>
        </div>
      </div>
    </footer>
  );
}
