import CategoryForm from "@/components/forms/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Add Category</h1>
      <p className="text-stone text-sm mb-8">Create a new craft category.</p>
      <CategoryForm />
    </div>
  );
}
