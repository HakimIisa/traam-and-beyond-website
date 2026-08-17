import { adminGetAllStories } from "@/lib/firebase/admin-stories";
import ReorderStoriesClient from "./ReorderStoriesClient";

export const dynamic = "force-dynamic";

export default async function ReorderStoriesPage() {
  const items = await adminGetAllStories();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-walnut">Reorder Stories</h1>
        <p className="text-stone text-sm mt-1">
          Drag stories to set the reading order on the website.
        </p>
      </div>
      <ReorderStoriesClient items={items} />
    </div>
  );
}
