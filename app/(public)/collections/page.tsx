import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/firebase/categories";
import { getItemsByCategory } from "@/lib/firebase/items";
import CollectionItemCard from "@/components/items/CollectionItemCard";
import { CATEGORY_DESCRIPTIONS } from "@/lib/category-descriptions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our entire collection of Kashmiri handcrafted items.",
};

export default async function CollectionsPage() {
  const categories = await getAllCategories();

  const categoryItems = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      items: await getItemsByCategory(cat.slug),
    }))
  );

  const populated = categoryItems.filter(({ items }) => items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Page header */}
      <div className="mb-16">
        <h1 className="font-display text-3xl lg:text-6xl text-cream mb-4">
          Collections
        </h1>
        <p className="text-stone text-sm lg:text-base leading-relaxed mb-8">
          Explore our entire collection.
        </p>
        <div className="border-t border-white/10" />
      </div>

      {/* Category sections */}
      {populated.map(({ category, items }) => {
        const description =
          category.description || CATEGORY_DESCRIPTIONS[category.slug];
        return (
          <section key={category.id} className="mb-24">
            <div className="mb-10">
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-terracotta transition-colors duration-200 inline-block"
              >
                <h2 className="font-display text-3xl lg:text-5xl text-cream mb-4">
                  {category.name}
                </h2>
              </Link>
              {description && (
                <p className="text-stone text-sm lg:text-base leading-relaxed text-justify mb-8">
                  {description}
                </p>
              )}
              <div className="border-t border-white/10" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
              {items.map((item) => (
                <CollectionItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
