import ItemCard from "./ItemCard";
import type { Item } from "@/types";

interface ItemGridProps {
  items: Item[];
  emptyMessage?: string;
}

export default function ItemGrid({
  items,
  emptyMessage = "No items found.",
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-stone">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
