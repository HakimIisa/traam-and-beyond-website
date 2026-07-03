import { notFound } from "next/navigation";
import { adminGetAllResearchItems } from "@/lib/firebase/admin-research";
import ResearchItemForm from "@/components/forms/ResearchItemForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditResearchItemPage({ params }: Props) {
  const { id } = await params;
  const items = await adminGetAllResearchItems();
  const item = items.find((i) => i.id === id);
  if (!item) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Edit Research Item</h1>
      <p className="text-stone text-sm mb-8">Update &ldquo;{item.title}&rdquo;.</p>
      <ResearchItemForm existing={item} />
    </div>
  );
}
