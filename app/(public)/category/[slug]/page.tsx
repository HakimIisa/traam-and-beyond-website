import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/firebase/categories";
import { getItemsByCategory } from "@/lib/firebase/items";
import ItemGrid from "@/components/items/ItemGrid";
import { CATEGORY_DESCRIPTIONS } from "@/lib/category-descriptions";
import { CATEGORY_KASHMIRI_NAMES } from "@/lib/category-kashmiri-names";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
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

  const description = category.description || CATEGORY_DESCRIPTIONS[slug];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-baseline justify-between gap-6 mb-4">
          <h1 className="font-display text-3xl lg:text-6xl text-cream">
            {category.name}
          </h1>
          {(category.nameKashmiri || CATEGORY_KASHMIRI_NAMES[slug]) && (
            <p
              className="font-display text-3xl lg:text-6xl text-stone shrink-0"
              dir="rtl"
              lang="ks"
            >
              {category.nameKashmiri || CATEGORY_KASHMIRI_NAMES[slug]}
            </p>
          )}
        </div>
        {description && (
          <p className="text-stone text-sm lg:text-base leading-relaxed text-justify mb-8">
            {description}
          </p>
        )}
        <div className="border-t border-white/10" />
      </div>

      <ItemGrid
        items={items}
        emptyMessage={`No ${category.name.toLowerCase()} items yet. Check back soon.`}
      />
    </div>
  );
}
