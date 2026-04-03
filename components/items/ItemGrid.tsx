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
    <div className="flex flex-col divide-y divide-cream-dark">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
