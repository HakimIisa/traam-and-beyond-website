import { notFound } from "next/navigation";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import CategoryForm from "@/components/forms/CategoryForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const categories = await adminGetAllCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Edit Category</h1>
      <p className="text-stone text-sm mb-8">Update &ldquo;{category.name}&rdquo;.</p>
      <CategoryForm existing={category} />
    </div>
  );
}
