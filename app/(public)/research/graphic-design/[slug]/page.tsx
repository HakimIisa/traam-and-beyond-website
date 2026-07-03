import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getResearchItemBySlug } from "@/lib/firebase/research";
import ItemImageGallery from "@/components/items/ItemImageGallery";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getResearchItemBySlug("graphic-design", slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description.slice(0, 160),
    openGraph: item.images[0] ? { images: [item.images[0]] } : undefined,
  };
}

export default async function GraphicDesignItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getResearchItemBySlug("graphic-design", slug);

  if (!item) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-1 text-sm text-stone mb-8 flex-wrap">
        <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/research" className="hover:text-terracotta transition-colors">Research</Link>
        <ChevronRight size={14} />
        <Link href="/research/graphic-design" className="hover:text-terracotta transition-colors">Graphic Design</Link>
        <ChevronRight size={14} />
        <span className="text-cream">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <ItemImageGallery images={item.images} title={item.title} />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold text-[#FAF6F0]">{item.title}</h1>
          {item.description && (
            <p className="text-[#FAF6F0] leading-relaxed text-justify">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
