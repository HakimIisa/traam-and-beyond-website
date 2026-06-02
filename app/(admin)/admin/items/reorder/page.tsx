import { adminGetAllItems } from "@/lib/firebase/admin-items";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import ReorderClient from "./ReorderClient";

export const dynamic = "force-dynamic";

export default async function ReorderPage() {
  const [items, categories] = await Promise.all([
    adminGetAllItems(),
    adminGetAllCategories(),
  ]);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-walnut">Reorder Items</h1>
        <p className="text-stone text-sm mt-1">
          Drag items to set the display order on the website. Select a category to reorder.
        </p>
      </div>
      <ReorderClient items={items} categories={categories} />
    </div>
  );
}
