import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

// Existing categories to rename (doc id → new name)
const RENAMES: Record<string, string> = {
  copper:   "Copper Ware",
  silver:   "Silverware",
  jade:     "Green Serpentine",
};

// New categories to create if they don't already exist
const NEW_CATEGORIES = [
  {
    id: "enamel-ware",
    name: "Enamelware",
    slug: "enamel-ware",
    order: 4,
    coverImage: "https://picsum.photos/seed/enamelware-kashmir/600/600",
    description: "Kashmiri enamelware, known as meenakari, features vibrant colours fired onto metal surfaces. Artisans in Srinagar create intricate floral and geometric patterns using age-old techniques passed down through generations.",
  },
  {
    id: "sculptures",
    name: "Sculptures",
    slug: "sculptures",
    order: 6,
    coverImage: "https://picsum.photos/seed/stone-sculpture/600/600",
    description: "Stone and wood sculptures from Kashmir reflect the valley's rich artistic heritage. Carved from walnut wood and local stones, these sculptures depict scenes from nature, mythology, and everyday Kashmiri life.",
  },
  {
    id: "shawls",
    name: "Shawls",
    slug: "shawls",
    order: 9,
    coverImage: "https://picsum.photos/seed/kashmir-shawl/600/600",
    description: "The Kashmiri shawl is among the world's most celebrated textiles. From the warmth of pashmina to the intricate kani weave, each shawl represents months of painstaking handwork by skilled weavers of the valley.",
  },
  {
    id: "jewellery",
    name: "Jewellery",
    slug: "jewellery",
    order: 10,
    coverImage: "https://picsum.photos/seed/kashmir-jewellery/600/600",
    description: "Kashmiri jewellery is renowned for its intricate designs inspired by the valley's natural beauty. From traditional kundan work to delicate silver filigree, each piece tells a story of the artisan's skill and heritage.",
  },
  {
    id: "carpets",
    name: "Carpets",
    slug: "carpets",
    order: 11,
    coverImage: "https://picsum.photos/seed/kashmir-carpet/600/600",
    description: "Hand-knotted Kashmiri carpets are prized worldwide for their extraordinary craftsmanship. Using pure wool and silk on traditional looms, artisans create intricate patterns inspired by Persian and Mughal designs.",
  },
  {
    id: "willow-wicker",
    name: "Willow Wicker",
    slug: "willow-wicker",
    order: 12,
    coverImage: "https://picsum.photos/seed/wicker-basket/600/600",
    description: "Kashmir's willow wicker craft produces beautiful baskets, furniture, and decorative items woven from pliable willow branches. This ancient craft remains a vital cottage industry in the villages of the valley.",
  },
  {
    id: "wood-work",
    name: "Woodwork",
    slug: "wood-work",
    order: 13,
    coverImage: "https://picsum.photos/seed/wood-carving/600/600",
    description: "Kashmiri walnut wood carving is world-famous for its intricate patterns and deep relief work. Master craftsmen carve furniture, screens, and decorative panels with floral, arabesque, and chinar leaf motifs.",
  },
  {
    id: "brass-ware",
    name: "Brass Ware",
    slug: "brass-ware",
    order: 14,
    coverImage: "https://picsum.photos/seed/brass-ware/600/600",
    description: "Kashmiri brass craftsmanship combines functional elegance with decorative artistry. Hand-beaten and engraved by skilled smiths, brass items range from traditional samovars to ornate decorative pieces.",
  },
];

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: { renamed: string[]; created: string[]; skipped: string[] } = {
    renamed: [],
    created: [],
    skipped: [],
  };

  // 1. Rename existing categories
  for (const [id, newName] of Object.entries(RENAMES)) {
    const ref = adminDb.collection("categories").doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update({ name: newName });
      results.renamed.push(`${id} → "${newName}"`);
    } else {
      results.skipped.push(`rename ${id} (not found)`);
    }
  }

  // 2. Create missing categories
  for (const cat of NEW_CATEGORIES) {
    const ref = adminDb.collection("categories").doc(cat.id);
    const snap = await ref.get();
    if (snap.exists) {
      results.skipped.push(`${cat.id} (already exists)`);
    } else {
      await ref.set({
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        coverImage: cat.coverImage,
        description: cat.description,
        createdAt: Timestamp.now(),
      });
      results.created.push(cat.id);
    }
  }

  return NextResponse.json(results);
}
