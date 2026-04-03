import Link from "next/link";
import { Package, Tag, MessageSquare, Plus } from "lucide-react";
import { adminGetAllItems } from "@/lib/firebase/admin-items";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import { getUnreadEnquiryCount, getAllEnquiries } from "@/lib/firebase/enquiries";

export default async function AdminDashboard() {
  const [items, categories, unreadCount, allEnquiries] = await Promise.all([
    adminGetAllItems(),
    adminGetAllCategories(),
    getUnreadEnquiryCount(),
    getAllEnquiries(),
  ]);

  const stats = [
    {
      label: "Total Items",
      value: items.length,
      icon: Package,
      href: "/admin/items",
      color: "bg-terracotta/10 text-terracotta",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Tag,
      href: "/admin/categories",
      color: "bg-saffron/10 text-saffron",
    },
    {
      label: "Unread Enquiries",
      value: unreadCount,
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: unreadCount > 0 ? "bg-red-50 text-red-600" : "bg-stone/10 text-stone",
    },
    {
      label: "Total Enquiries",
      value: allEnquiries.length,
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: "bg-stone/10 text-stone",
    },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Dashboard</h1>
      <p className="text-stone text-sm mb-8">Welcome back. Here&apos;s an overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-cream-dark rounded-sm p-5 hover:shadow-sm transition-shadow"
          >
            <div className={`inline-flex p-2 rounded-sm mb-3 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <p className="text-2xl font-semibold text-walnut">{stat.value}</p>
            <p className="text-xs text-stone mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-walnut mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/items/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-cream text-sm rounded-sm hover:bg-terracotta-dark transition-colors"
        >
          <Plus size={16} /> Add Item
        </Link>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-walnut text-cream text-sm rounded-sm hover:bg-walnut-light transition-colors"
        >
          <Plus size={16} /> Add Category
        </Link>
        <Link
          href="/admin/enquiries"
          className="flex items-center gap-2 px-4 py-2.5 border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors"
        >
          <MessageSquare size={16} /> View Enquiries
        </Link>
      </div>
    </div>
  );
}
