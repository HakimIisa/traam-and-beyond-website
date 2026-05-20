import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/firebase/categories";
import { getItemsByCategory } from "@/lib/firebase/items";
import ItemGrid from "@/components/items/ItemGrid";

export const dynamic = "force-dynamic";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  copperware:
    "Copper in Kashmir occupies a unique position between domestic necessity and ceremonial presence, blurring the boundary between utility and art. Hand-raised from sheets of copper and subsequently engraved using fine chisels, these objects reveal a mastery of both form and surface. The engraving seen in older pieces, often covering the entire surface, draws from Persian and Mughal influences combined with local naga symbolism and is indicative of earlier workmanship, where time and labour were less constrained by market pressures.",
  "papier-mch":
    "Far removed from its utilitarian origins, Kashmiri papier-mâché evolved into a highly sophisticated decorative art renowned for its vibrant colours, lacquer finish, and detailed patterns. It is a dual-artisan tradition, divided between Saakhta Kaar, responsible for constructing the base object using layers of paper pulp by moulding, drying, smoothing, and preparing the surface, and Naqash who applies intricate surface decoration using mineral pigments and fine brushes, reflecting a deeply Persian aesthetic filtered through local sensibilities.",
  silverware:
    "Kashmiri silverwork today is in a phase of serious decline, making surviving pieces important remnants of a fading artisanal tradition of refined engraving, repousse, and filigree. With the arrival of European visitors around the 19th century, artisans began blending western forms with Kashmiri motifs, creating hybrid designs, characterized by local motifs, embodying both cultural continuity and adaptation. Most surviving objects were created for foreign markets, although there are many examples of decorative and utilitarian objects for local ritual and elite domestic life.",
  enamelware:
    "Enamelwork in Kashmir represents a confluence of metal and colour. Applied to copper, brass or silver surfaces, vitreous enamel was fused through heat, creating richly coloured, durable and jewel-like decoration in tones of turquoise, cobalt, deep red and sometimes yellow and white. Historically practiced between the late Mughal and 19th century periods, enamelwork today represents a largely extinct craft tradition. Surviving pieces are important not only as antiques but as evidence of a lost technical tradition.",
  terracotta:
    "Terracotta in Kashmir is among the region's oldest craft traditions, with earliest records from the Neolithic site of Burzahom (c. 3000–1500 BCE). Over time, the craft adapted to changing cultural context and evolved from simple pottery into religious, decorative and architectural forms. Ranging from Buddhist moulded tiles to everyday utensils and sculptures, these works reflect both handcraft and mould-based production, valued for their texture and subtle handmade variations.",
  "green-serpentine":
    "Kashmir's green serpentine, known as zahar mohar, is a stone historically associated with protective and medicinal qualities, especially the belief that it could detect or neutralize poison. Carefully carved into ritual and sometimes utilitarian objects, it held both practical and symbolic significance. Prized for its smooth texture and rich green hue, zahar mohar objects occupied a unique space between utility and belief, reflecting the intersection of craftsmanship, resource use, tradition, and enduring cultural lore in Kashmir.",
  coins:
    "Coins from Kashmir offer a concise yet profound record of its political and cultural history, evolving from early terracotta tokens to refined gold, silver and copper currencies during the Indo-Greek, Kushan, Karkota, Lohara and Shah Mir Dynasties. Mughal rule integrated Kashmir into a broader imperial economy through finely minted coinage. These successive traditions illustrate Kashmir's transition from localised exchange systems to participation in expansive economic networks, with coinage serving as a practical medium of trade and a reflection of changing regimes and artistic expression.",
  shawls:
    "Kashmiri shawls are among the most globally recognised outputs of the region. Celebrated as one of the most refined textile traditions in the world, they blend technical mastery with timeless aesthetic sensibility. Hand-spun and hand-woven from exceptionally soft and lightweight pashmina or shahtoosh wool, often with labour-intensive and intricate embroidery (Sozni) or woven patterns (kaani), they would take months or even years to complete. Historically patronised by royalty and later prized in European markets, Kashmiri shawls became symbols of luxury and cultural exchange.",
  jewellery:
    "Traditional Kashmiri jewellery is a vivid expression of the region's cultural identity, shaped by centuries of social customs, regional diversity, and artisanal skill. Crafted predominantly in silver and occasionally in gold or white metal, and set with precious or semi-precious stones, it often incorporates intricate engravings that echo the broader aesthetic vocabulary of Kashmiri crafts. The diversity in materiality stems from affordability, ensuring that adornment remained an integral part of everyday and ceremonial life. Its significance lies as much in cultural continuity as in material value.",
  carpets:
    "Kashmir's hand-knotted carpet tradition is believed to have taken root in the 15th century under the patronage of Zain-ul-Abidin, who invited skilled weavers from Persia, introducing refined weaving techniques. Over time, Kashmiri artisans adapted these techniques to local sensibilities, developing a distinctive style featuring local natural motifs alongside classical Persian patterns. Historically prized in royal courts and later in global markets, these carpets remain a testament to enduring craftsmanship and a legacy of cross-cultural artistic exchange, each representing months, sometimes years, of labour.",
  "willow-wicker":
    "Willow wicker work in Kashmir is a relatively recent yet deeply rooted craft, emerging prominently in the late 19th and early 20th centuries under the British colonial administration, which introduced organised willow cultivation for cricket bat production. Local artisans adapted the supple willow shoots to develop a thriving craft tradition, as a testament to the region's ability to transform an introduced resource into a sustainable and enduring tradition. Initially focused on simple, utilitarian objects, the craft gradually expanded in both form and function, reflecting changing market demands.",
  "wood-work":
    "Kashmiri woodwork is among the region's oldest craft traditions, with origins tracing back to early temple and domestic architecture, flourishing particularly from the medieval period onward. In rural settings, woodwork remained largely functional, while courtly and urban patronage gave rise to highly refined carving traditions, especially under Sultanate and later Mughal influence. Artisans developed intricate techniques of lattice work, panelling and relief carving of diverse motifs reflecting influences from trade along the Silk Route.",
  "brass-ware":
    "Kashmiri brassware has a long history, with its widespread use dating back to the medieval period, particularly under the Sultanate and Mughal eras when metalwork flourished alongside other crafts. Artisans produced a range of objects, from simple functional vessels to highly ornate pieces embellished with intricate engraving. Brass became especially associated with the Kashmiri Pandit community, who considered it pure and suitable for religious observances, making it an integral part of domestic and spiritual life.",
};

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
        <h1 className="font-display text-3xl lg:text-6xl text-cream mb-4">
          {category.name}
        </h1>
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
