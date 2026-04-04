"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, MessageSquare, LogOut, Home, Info } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Home Page", icon: Home, exact: false },
  { href: "/admin/about", label: "About Page", icon: Info, exact: false },
  { href: "/admin/items", label: "Items", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categories", icon: Tag, exact: false },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-56 min-h-screen bg-walnut flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-cream/10">
        <p className="text-cream font-semibold text-base leading-tight">Traam and Beyond</p>
        <p className="text-cream/40 text-xs mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors",
                active
                  ? "bg-terracotta text-cream"
                  : "text-cream/60 hover:text-cream hover:bg-cream/10"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-cream/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm text-cream/60 hover:text-cream hover:bg-cream/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
