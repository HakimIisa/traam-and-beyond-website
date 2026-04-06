"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Search, Info, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Category } from "@/types";

interface BottomTabBarProps {
  categories: Category[];
}

export default function BottomTabBar({ categories }: BottomTabBarProps) {
  const pathname = usePathname();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 60) setHidden(true);
      else if (y < lastScrollY.current) setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isCollections = pathname.startsWith("/category");

  return (
    <>
      <nav
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          bg-walnut/90 backdrop-blur-sm border-t border-cream-dark/20
          transition-transform duration-300
          ${hidden ? "translate-y-full" : "translate-y-0"}
        `}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive("/") ? "text-terracotta" : "text-stone"
            }`}
          >
            <Home size={20} />
            <span className="text-[10px]">Home</span>
          </Link>

          <button
            onClick={() => setCollectionsOpen(true)}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isCollections ? "text-terracotta" : "text-stone"
            }`}
          >
            <Package size={20} />
            <span className="text-[10px]">Collections</span>
          </button>

          <Link
            href="/search"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive("/search") ? "text-terracotta" : "text-stone"
            }`}
          >
            <Search size={20} />
            <span className="text-[10px]">Search</span>
          </Link>

          <Link
            href="/about"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive("/about") ? "text-terracotta" : "text-stone"
            }`}
          >
            <Info size={20} />
            <span className="text-[10px]">About</span>
          </Link>

          <Link
            href="/contact"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              isActive("/contact") ? "text-terracotta" : "text-stone"
            }`}
          >
            <Mail size={20} />
            <span className="text-[10px]">Contact</span>
          </Link>
        </div>
      </nav>

      {/* Collections bottom sheet */}
      <Sheet open={collectionsOpen} onOpenChange={setCollectionsOpen}>
        <SheetContent side="bottom" className="bg-walnut border-cream-dark/20 rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-cream font-display text-2xl">Collections</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 mt-4 pb-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setCollectionsOpen(false)}
                className="py-3 px-2 text-cream text-lg border-b border-cream-dark/15 hover:text-terracotta transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
