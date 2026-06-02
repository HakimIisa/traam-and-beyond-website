import Link from "next/link";
import { Plus, ArrowUpDown } from "lucide-react";
import { adminGetAllItems } from "@/lib/firebase/admin-items";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import ItemsClient from "./ItemsClient";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const [items, categories] = await Promise.all([
    adminGetAllItems(),
    adminGetAllCategories(),
  ]);

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-walnut">Items</h1>
          <p className="text-stone text-sm mt-1">{items.length} items in catalogue</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/items/reorder"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors"
          >
            <ArrowUpDown size={16} /> Reorder Items
          </Link>
          <Link
            href="/admin/items/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-cream text-sm rounded-sm hover:bg-terracotta-dark transition-colors"
          >
            <Plus size={16} /> Add Item
          </Link>
        </div>
      </div>

      <ItemsClient items={items} categories={categories} />
    </div>
  );
}
