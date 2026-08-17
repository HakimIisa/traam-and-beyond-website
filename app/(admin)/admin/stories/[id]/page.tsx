import { notFound } from "next/navigation";
import { adminGetAllStories } from "@/lib/firebase/admin-stories";
import StoryForm from "@/components/forms/StoryForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;
  const items = await adminGetAllStories();
  const item = items.find((i) => i.id === id);
  if (!item) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Edit Story</h1>
      <p className="text-stone text-sm mb-8">Update &ldquo;{item.title}&rdquo;.</p>
      <StoryForm existing={item} />
    </div>
  );
}
