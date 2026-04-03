import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import ItemForm from "@/components/forms/ItemForm";

export default async function NewItemPage() {
  const categories = await adminGetAllCategories();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Add Item</h1>
      <p className="text-stone text-sm mb-8">Add a new item to the catalogue.</p>
      <ItemForm categories={categories} />
    </div>
  );
}
