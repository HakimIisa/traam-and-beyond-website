import { adminGetAllResearchItems } from "@/lib/firebase/admin-research";
import ReorderResearchClient from "./ReorderResearchClient";

export const dynamic = "force-dynamic";

export default async function ReorderResearchPage() {
  const items = await adminGetAllResearchItems();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-walnut">Reorder Research</h1>
        <p className="text-stone text-sm mt-1">
          Drag items to set the display order on the website. Select a section to reorder.
        </p>
      </div>
      <ReorderResearchClient items={items} />
    </div>
  );
}
