import ResearchItemForm from "@/components/forms/ResearchItemForm";

export default function NewResearchItemPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Add Research Item</h1>
      <p className="text-stone text-sm mb-8">Add a new item to the research section.</p>
      <ResearchItemForm />
    </div>
  );
}
