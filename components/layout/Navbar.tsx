"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  const isCategoryActive = categories.some((c) =>
    pathname.startsWith(`/category/${c.slug}`)
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled
          ? "bg-walnut/90 backdrop-blur-sm border-b border-cream-dark/10"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold text-cream tracking-wide hover:text-terracotta transition-colors"
        >
          Traam and Beyond
        </Link>

        {/* Desktop nav — hidden on mobile (BottomTabBar handles mobile) */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm text-stone hover:text-terracotta transition-colors",
              pathname === "/" && "text-terracotta font-medium"
            )}
          >
            Home
          </Link>

          {/* Categories dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setCategoriesOpen((o) => !o)}
              className={cn(
                "flex items-center gap-1 text-sm text-stone hover:text-terracotta transition-colors",
                isCategoryActive && "text-terracotta font-medium"
              )}
            >
              Collections
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", categoriesOpen && "rotate-180")}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-walnut border border-cream-dark/20 rounded-sm shadow-md py-1 z-50">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/category/${c.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 text-sm text-stone hover:text-terracotta hover:bg-walnut-light/40 transition-colors",
                      pathname.startsWith(`/category/${c.slug}`) && "text-terracotta font-medium"
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={cn(
              "text-sm text-stone hover:text-terracotta transition-colors",
              pathname === "/about" && "text-terracotta font-medium"
            )}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={cn(
              "text-sm text-stone hover:text-terracotta transition-colors",
              pathname === "/contact" && "text-terracotta font-medium"
            )}
          >
            Contact
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="text-sm border-b border-cream/40 bg-transparent outline-none w-48 pb-0.5 text-cream placeholder:text-stone"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone hover:text-cream"
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
        </div>
      </nav>
    </header>
  );
}
