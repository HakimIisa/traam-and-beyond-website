import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories, getCategoryBySlug } from "@/lib/firebase/categories";
import { getItemsByCategory } from "@/lib/firebase/items";
import ItemGrid from "@/components/items/ItemGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `Browse our collection of Kashmiri ${category.name.toLowerCase()} items.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, items] = await Promise.all([
    getCategoryBySlug(slug),
    getItemsByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-walnut mb-2">
          {category.name}
        </h1>
        <p className="text-stone">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <ItemGrid
        items={items}
        emptyMessage={`No ${category.name.toLowerCase()} items yet. Check back soon.`}
      />
    </div>
  );
}
