"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CRAFTS = [
  { label: "Copperware",        slug: "copperware" },
  { label: "Papier-mâché",     slug: "papier-mch" },
  { label: "Silverware",       slug: "silverware" },
  { label: "Enamelware",       slug: "enamelware" },
  { label: "Terracotta",       slug: "terracotta" },
  { label: "Green Serpentine", slug: "green-serpentine" },
  { label: "Coins",            slug: "coins" },
  { label: "Shawls",           slug: "shawls" },
  { label: "Jewellery",        slug: "jewellery" },
  { label: "Carpets",          slug: "carpets" },
  { label: "Willow Wicker",    slug: "willow-wicker" },
  { label: "Woodwork",         slug: "wood-work" },
  { label: "Brass Ware",       slug: "brass-ware" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > lastScrollY.current && y > 60) setHidden(true);
      else if (y < lastScrollY.current) setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          hidden ? "-translate-y-full" : "translate-y-0",
          scrolled || menuOpen
            ? "bg-walnut/95 backdrop-blur-sm border-b border-cream-dark/10"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo + site name */}
          <Link href="/" onClick={closeMenu} className="flex items-center hover:opacity-80 transition-opacity">
            <Image src="/LOGO.png" alt="Traam and Beyond logo" width={240} height={80} className="h-16 w-auto" />
            <span className="text-2xl font-semibold text-cream tracking-wide -ml-2">Traam and Beyond</span>
          </Link>

          {/* Right side: Search + Hamburger */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="text-sm border-b border-cream/40 bg-transparent outline-none w-40 sm:w-56 pb-0.5 text-cream placeholder:text-stone"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-stone hover:text-cream transition-colors"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-stone hover:text-terracotta transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-stone hover:text-terracotta transition-colors p-1"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed inset-0 z-40 bg-walnut overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-8 sm:px-12 pt-24 pb-16">
              <nav className="flex flex-col gap-10">

                {/* 1. Home */}
                <div>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="font-display text-5xl sm:text-6xl text-cream hover:text-terracotta transition-colors duration-200"
                  >
                    Home
                  </Link>
                </div>

                {/* 2. About */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className={cn(
                      "font-display text-5xl sm:text-6xl hover:text-terracotta transition-colors duration-200",
                      pathname === "/about" ? "text-terracotta" : "text-cream"
                    )}
                  >
                    About
                  </Link>
                  <div className="flex flex-col gap-1.5 pl-6 border-l border-cream-dark/30">
                    <Link
                      href="/about#introduction"
                      onClick={closeMenu}
                      className="text-stone text-lg hover:text-terracotta transition-colors duration-200"
                    >
                      Our Story
                    </Link>
                    <Link
                      href="/about#craft-heritage"
                      onClick={closeMenu}
                      className="text-stone text-lg hover:text-terracotta transition-colors duration-200"
                    >
                      Craft Heritage of Kashmir
                    </Link>
                  </div>
                </div>

                {/* 3. Crafts */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="/#collections"
                    onClick={closeMenu}
                    className="font-display text-5xl sm:text-6xl text-cream hover:text-terracotta transition-colors duration-200"
                  >
                    Our Collections
                  </Link>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1.5 pl-6 border-l border-cream-dark/30">
                    {CRAFTS.map((craft) => (
                      <Link
                        key={craft.slug}
                        href={`/category/${craft.slug}`}
                        onClick={closeMenu}
                        className={cn(
                          "text-lg hover:text-terracotta transition-colors duration-200",
                          pathname.startsWith(`/category/${craft.slug}`)
                            ? "text-terracotta"
                            : "text-stone"
                        )}
                      >
                        {craft.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 4. Research */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="/research"
                    onClick={closeMenu}
                    className={cn(
                      "font-display text-5xl sm:text-6xl hover:text-terracotta transition-colors duration-200",
                      pathname.startsWith("/research") ? "text-terracotta" : "text-cream"
                    )}
                  >
                    Research
                  </Link>
                  <div className="flex flex-row flex-wrap gap-x-8 gap-y-1.5 pl-6 border-l border-cream-dark/30">
                    <Link
                      href="/research/adaptive-reuse"
                      onClick={closeMenu}
                      className={cn(
                        "text-lg hover:text-terracotta transition-colors duration-200",
                        pathname === "/research/adaptive-reuse" ? "text-terracotta" : "text-stone"
                      )}
                    >
                      Adaptive Reuse
                    </Link>
                    <Link
                      href="/research/reinterpretation"
                      onClick={closeMenu}
                      className={cn(
                        "text-lg hover:text-terracotta transition-colors duration-200",
                        pathname === "/research/reinterpretation" ? "text-terracotta" : "text-stone"
                      )}
                    >
                      Reinterpretation
                    </Link>
                    <Link
                      href="/research/graphic-design"
                      onClick={closeMenu}
                      className={cn(
                        "text-lg hover:text-terracotta transition-colors duration-200",
                        pathname === "/research/graphic-design" ? "text-terracotta" : "text-stone"
                      )}
                    >
                      Graphic Design
                    </Link>
                  </div>
                </div>

                {/* 5. Stories */}
                <div>
                  <Link
                    href="/stories"
                    onClick={closeMenu}
                    className={cn(
                      "font-display text-5xl sm:text-6xl hover:text-terracotta transition-colors duration-200",
                      pathname === "/stories" ? "text-terracotta" : "text-cream"
                    )}
                  >
                    Stories
                  </Link>
                </div>

                {/* 5. Buy from the Artisans */}
                <div>
                  <Link
                    href="/buy-from-artisans"
                    onClick={closeMenu}
                    className={cn(
                      "font-display text-5xl sm:text-6xl hover:text-terracotta transition-colors duration-200",
                      pathname === "/buy-from-artisans" ? "text-terracotta" : "text-cream"
                    )}
                  >
                    Buy from the Artisans
                  </Link>
                </div>

                {/* 6. Contact */}
                <div>
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className={cn(
                      "font-display text-5xl sm:text-6xl hover:text-terracotta transition-colors duration-200",
                      pathname === "/contact" ? "text-terracotta" : "text-cream"
                    )}
                  >
                    Contact
                  </Link>
                </div>

              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
