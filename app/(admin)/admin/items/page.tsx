import Link from "next/link";
import { Plus } from "lucide-react";
import { adminGetAllItems } from "@/lib/firebase/admin-items";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import ItemsClient from "./ItemsClient";

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
        <Link
          href="/admin/items/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-cream text-sm rounded-sm hover:bg-terracotta-dark transition-colors"
        >
          <Plus size={16} /> Add Item
        </Link>
      </div>

      <ItemsClient items={items} categories={categories} />
    </div>
  );
}
