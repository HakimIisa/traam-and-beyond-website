import { adminGetAllFeaturedItems } from "@/lib/firebase/admin-featured";
import ReorderFeaturedClient from "./ReorderFeaturedClient";

export const dynamic = "force-dynamic";

export default async function ReorderFeaturedPage() {
  const items = await adminGetAllFeaturedItems();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-semibold text-walnut mb-1">Reorder Featured Images</h1>
      <p className="text-stone text-sm mb-6">
        Drag to change the order they appear in the homepage carousel.
      </p>

      <ReorderFeaturedClient items={items} />
    </div>
  );
}
