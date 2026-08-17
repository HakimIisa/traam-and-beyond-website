import StoryForm from "@/components/forms/StoryForm";

export default function NewStoryPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-walnut mb-2">Add Story</h1>
      <p className="text-stone text-sm mb-8">Add a new craft story.</p>
      <StoryForm />
    </div>
  );
}
