import { notFound } from "next/navigation";
import { adminGetAllItems } from "@/lib/firebase/admin-items";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import ItemForm from "@/components/forms/ItemForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: Props) {
  const { id } = await params;
  const [items, categories] = await Promise.all([
    adminGetAllItems(),
    adminGetAllCategories(),
  ]);

  const item = items.find((i) => i.id === id);
  if (!item) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Edit Item</h1>
      <p className="text-stone text-sm mb-8 line-clamp-1">{item.title}</p>
      <ItemForm existing={item} categories={categories} />
    </div>
  );
}
