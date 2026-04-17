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
              Curated Kashmiri handcrafted items — copper, silver, jade,
              papier-mâché, and more.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-cream font-medium text-sm mb-1">Explore</p>
            <Link href="/about" className="text-sm hover:text-cream transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm hover:text-cream transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-cream/10 text-xs text-center">
          © {new Date().getFullYear()} Traam and Beyond. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
