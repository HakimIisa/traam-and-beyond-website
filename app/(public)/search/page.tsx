import type { Metadata } from "next";
import { searchItems } from "@/lib/firebase/items";
import ItemGrid from "@/components/items/ItemGrid";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : "Search",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const items = query ? await searchItems(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-walnut mb-2">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="text-stone">
            {items.length} {items.length === 1 ? "result" : "results"} found
          </p>
        )}
      </div>

      {query ? (
        <ItemGrid
          items={items}
          emptyMessage={`No items found for "${query}". Try a different search term.`}
        />
      ) : (
        <p className="text-stone">Enter a search term in the navigation bar to find items.</p>
      )}
    </div>
  );
}
