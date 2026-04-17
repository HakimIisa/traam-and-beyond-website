import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getItemById } from "@/lib/firebase/items";
import ItemImageGallery from "@/components/items/ItemImageGallery";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string; itemId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { itemId } = await params;
  const item = await getItemById(itemId);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description.slice(0, 160),
    openGraph: item.images[0] ? { images: [item.images[0]] } : undefined,
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug, itemId } = await params;
  const item = await getItemById(itemId);

  if (!item || item.categorySlug !== slug) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-stone mb-8">
        <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/category/${slug}`} className="hover:text-terracotta transition-colors capitalize">
          {item.categoryName}
        </Link>
        <ChevronRight size={14} />
        <span className="text-cream line-clamp-1">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <ItemImageGallery images={item.images} title={item.title} />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge
              variant="outline"
              className="border-stone/30 text-stone font-normal mb-3"
            >
              {item.categoryName}
            </Badge>
            <h1 className="text-4xl font-semibold text-[#FAF6F0] mb-3">
              {item.title}
            </h1>
          </div>

          <p className="text-[#FAF6F0] leading-relaxed whitespace-pre-line text-justify">{item.description}</p>

          <p className="text-2xl font-medium text-terracotta">
            {formatPrice(item.price, item.notForSale)}
          </p>

          {item.dimensions && (
            <div>
              <p className="text-sm font-medium text-cream mb-1">Dimensions</p>
              <p className="text-sm text-stone">{item.dimensions}</p>
            </div>
          )}

          {/* Enquiry form */}
          <div className="bg-cream-dark rounded-sm p-6 mt-2">
            <h2 className="text-lg font-semibold text-cream mb-4">
              Enquire About This Item
            </h2>
            <EnquiryForm
              type="item-specific"
              itemId={item.id}
              itemTitle={item.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
