import type { Category, Item } from "@/types";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "copper",
    name: "Copper Ware",
    slug: "copper",
    order: 1,
    coverImage: "https://picsum.photos/seed/copper-craft/600/600",
    description: "Traam — the Kashmiri word for copper — is the soul of this collection. Hand-hammered by khar artisans whose craft spans generations, each copper piece carries the warmth of the valley's ancient metalworking tradition.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "papier-mache",
    name: "Papier-mâché",
    slug: "papier-mache",
    order: 2,
    coverImage: "https://picsum.photos/seed/papier-mache-art/600/600",
    description: "Layers of pulped newspaper are shaped, lacquered, and hand-painted over weeks by karigars in Srinagar. The result is richly coloured boxes, vases, and decorative pieces adorned with floral and geometric motifs.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "silver",
    name: "Silverware",
    slug: "silver",
    order: 3,
    coverImage: "https://picsum.photos/seed/silver-jewellery/600/600",
    description: "Kashmiri silverwork is celebrated for its intricate filigree and repousse techniques. Every ring, box, and ornament is shaped by zarnigar (silversmith) families who have practised this art for centuries.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "enamelware",
    name: "Enamelware",
    slug: "enamelware",
    order: 4,
    coverImage: "https://picsum.photos/seed/enamelware-kashmir/600/600",
    description: "Kashmiri enamelware, known as meenakari, features vibrant colours fired onto metal surfaces. Artisans in Srinagar create intricate floral and geometric patterns using age-old techniques passed down through generations.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "terracotta",
    name: "Terracotta",
    slug: "terracotta",
    order: 5,
    coverImage: "https://picsum.photos/seed/terracotta-jewel/600/600",
    description: "Hand-shaped from natural clay and painted with geometric patterns in earthy pigments, Kashmiri terracotta jewellery is lightweight, wearable art. Each bead and pendant is individually crafted and sun-dried.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sculptures",
    name: "Sculptures",
    slug: "sculptures",
    order: 6,
    coverImage: "https://picsum.photos/seed/stone-sculpture/600/600",
    description: "Stone and wood sculptures from Kashmir reflect the valley's rich artistic heritage. Carved from walnut wood and local stones, these sculptures depict scenes from nature, mythology, and everyday Kashmiri life.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jade",
    name: "Green Serpentine",
    slug: "jade",
    order: 7,
    coverImage: "https://picsum.photos/seed/jade-stone/600/600",
    description: "Jade carving in Kashmir flourished under Mughal patronage and remains one of the valley's most refined crafts. Each piece is carved from a single block of stone, revealing the natural translucency and depth of the material.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "coins",
    name: "Coins",
    slug: "coins",
    order: 8,
    coverImage: "https://picsum.photos/seed/ancient-coins/600/600",
    description: "A rare collection of coins minted across the dynasties that shaped Kashmir — Mughal, Sikh, and Dogra. Each coin is a tangible fragment of history, authenticated and sourced from trusted numismatic families.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "shawls",
    name: "Shawls",
    slug: "shawls",
    order: 9,
    coverImage: "https://picsum.photos/seed/kashmir-shawl/600/600",
    description: "The Kashmiri shawl is among the world's most celebrated textiles. From the warmth of pashmina to the intricate kani weave, each shawl represents months of painstaking handwork by skilled weavers of the valley.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jewellery",
    name: "Jewellery",
    slug: "jewellery",
    order: 10,
    coverImage: "https://picsum.photos/seed/kashmir-jewellery/600/600",
    description: "Kashmiri jewellery is renowned for its intricate designs inspired by the valley's natural beauty. From traditional kundan work to delicate silver filigree, each piece tells a story of the artisan's skill and heritage.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "carpets",
    name: "Carpets",
    slug: "carpets",
    order: 11,
    coverImage: "https://picsum.photos/seed/kashmir-carpet/600/600",
    description: "Hand-knotted Kashmiri carpets are prized worldwide for their extraordinary craftsmanship. Using pure wool and silk on traditional looms, artisans create intricate patterns inspired by Persian and Mughal designs.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "willow-wicker",
    name: "Willow Wicker",
    slug: "willow-wicker",
    order: 12,
    coverImage: "https://picsum.photos/seed/wicker-basket/600/600",
    description: "Kashmir's willow wicker craft produces beautiful baskets, furniture, and decorative items woven from pliable willow branches. This ancient craft remains a vital cottage industry in the villages of the valley.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "woodwork",
    name: "Woodwork",
    slug: "woodwork",
    order: 13,
    coverImage: "https://picsum.photos/seed/wood-carving/600/600",
    description: "Kashmiri walnut wood carving is world-famous for its intricate patterns and deep relief work. Master craftsmen carve furniture, screens, and decorative panels with floral, arabesque, and chinar leaf motifs.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "brass-ware",
    name: "Brass Ware",
    slug: "brass-ware",
    order: 14,
    coverImage: "https://picsum.photos/seed/brass-ware/600/600",
    description: "Kashmiri brass craftsmanship combines functional elegance with decorative artistry. Hand-beaten and engraved by skilled smiths, brass items range from traditional samovars to ornate decorative pieces.",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_ITEMS: Item[] = [
  // Copper
  {
    id: "copper-tray-01",
    title: "Hand-Hammered Copper Serving Tray",
    description:
      "A stunning hand-hammered copper serving tray crafted by master khar (coppersmith) artisans in Srinagar. Each indentation is struck by hand, creating a unique texture that catches light beautifully. Ideal as a decorative centrepiece or functional serving piece.",
    price: 4500,
    notForSale: false,
    dimensions: "45cm × 30cm × 3cm",
    categoryId: "copper",
    categorySlug: "copper",
    categoryName: "Copper",
    images: [
      "https://picsum.photos/seed/copper-tray-1/600/600",
      "https://picsum.photos/seed/copper-tray-2/600/600",
      "https://picsum.photos/seed/copper-tray-3/600/600",
    ],
    searchTokens: ["hand", "hammered", "copper", "serving", "tray", "kashmiri", "khar"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "copper-samovar-01",
    title: "Antique Copper Samovar",
    description:
      "A rare antique copper samovar (kanger in Kashmiri tradition) with intricate engraved floral motifs. Sourced from a family of coppersmiths whose craft spans four generations. A true collector's piece that embodies the warmth of Kashmiri hospitality.",
    price: null,
    notForSale: false,
    dimensions: "35cm height × 20cm diameter",
    categoryId: "copper",
    categorySlug: "copper",
    categoryName: "Copper",
    images: [
      "https://picsum.photos/seed/samovar-1/600/600",
      "https://picsum.photos/seed/samovar-2/600/600",
    ],
    searchTokens: ["antique", "copper", "samovar", "engraved", "floral", "kashmiri"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "copper-bowl-01",
    title: "Copper Ablution Bowl",
    description:
      "Traditional hand-beaten copper bowl used for ablution and decorative purposes. Features a classic flared rim and a polished interior. A timeless piece of Kashmiri metalwork.",
    price: 2200,
    notForSale: false,
    dimensions: "22cm diameter × 10cm height",
    categoryId: "copper",
    categorySlug: "copper",
    categoryName: "Copper",
    images: ["https://picsum.photos/seed/copper-bowl/600/600"],
    searchTokens: ["copper", "ablution", "bowl", "hand", "beaten", "kashmiri"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "copper-wall-art-01",
    title: "Engraved Copper Wall Panel",
    description:
      "A large engraved copper wall panel depicting the iconic chinar leaf — the symbol of Kashmir. Hand-engraved by artisans using traditional punches and chisels. Comes ready to hang.",
    price: 8500,
    notForSale: false,
    dimensions: "60cm × 40cm",
    categoryId: "copper",
    categorySlug: "copper",
    categoryName: "Copper",
    images: [
      "https://picsum.photos/seed/copper-panel/600/600",
      "https://picsum.photos/seed/copper-panel-2/600/600",
    ],
    searchTokens: ["engraved", "copper", "wall", "panel", "chinar", "kashmiri", "art"],
    createdAt: new Date().toISOString(),
  },

  // Silver
  {
    id: "silver-ring-01",
    title: "Sterling Silver Filigree Ring",
    description:
      "Delicate sterling silver filigree ring crafted using the traditional zarnigar (silversmith) technique. The intricate woven wire pattern is characteristic of Kashmiri silverwork and takes several hours to complete by hand.",
    price: 1800,
    notForSale: false,
    dimensions: "Available in sizes 6–10",
    categoryId: "silver",
    categorySlug: "silver",
    categoryName: "Silver",
    images: ["https://picsum.photos/seed/silver-ring/600/600"],
    searchTokens: ["sterling", "silver", "filigree", "ring", "kashmiri", "zarnigar"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "silver-box-01",
    title: "Repousse Silver Jewellery Box",
    description:
      "A beautifully crafted silver jewellery box featuring repousse (raised relief) work depicting hunting scenes from Mughal-era manuscripts. Lined with velvet interior. A cherished gift and heirloom piece.",
    price: 12000,
    notForSale: false,
    dimensions: "15cm × 10cm × 7cm",
    categoryId: "silver",
    categorySlug: "silver",
    categoryName: "Silver",
    images: [
      "https://picsum.photos/seed/silver-box-1/600/600",
      "https://picsum.photos/seed/silver-box-2/600/600",
    ],
    searchTokens: ["silver", "repousse", "jewellery", "box", "mughal", "kashmiri", "velvet"],
    createdAt: new Date().toISOString(),
  },

  // Jade
  {
    id: "jade-figurine-01",
    title: "Carved Jade Deer Figurine",
    description:
      "A finely carved green jade deer figurine, hand-crafted by Kashmiri gem cutters trained in the tradition of Mughal court craftsmanship. The smooth surface reveals the natural translucency of the stone.",
    price: null,
    notForSale: true,
    dimensions: "12cm × 8cm",
    categoryId: "jade",
    categorySlug: "jade",
    categoryName: "Jade",
    images: ["https://picsum.photos/seed/jade-deer/600/600"],
    searchTokens: ["jade", "carved", "deer", "figurine", "green", "kashmiri", "mughal"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "jade-bowl-01",
    title: "Nephrite Jade Decorative Bowl",
    description:
      "A stunning nephrite jade bowl hand-carved from a single block of stone. The rich green colour with natural veining makes each bowl entirely unique. A centrepiece of Kashmiri lapidary art.",
    price: 35000,
    notForSale: false,
    dimensions: "18cm diameter × 6cm height",
    categoryId: "jade",
    categorySlug: "jade",
    categoryName: "Jade",
    images: [
      "https://picsum.photos/seed/jade-bowl-1/600/600",
      "https://picsum.photos/seed/jade-bowl-2/600/600",
    ],
    searchTokens: ["nephrite", "jade", "bowl", "carved", "stone", "kashmiri", "lapidary"],
    createdAt: new Date().toISOString(),
  },

  // Papier-mâché
  {
    id: "pm-box-01",
    title: "Papier-mâché Lacquered Box — Chinar Motif",
    description:
      "A classic Kashmiri papier-mâché box hand-painted with the iconic chinar leaf pattern in rich reds, golds, and greens on a black lacquered background. Made by karigars from the papier-mâché artisan families of Srinagar.",
    price: 3200,
    notForSale: false,
    dimensions: "20cm × 14cm × 8cm",
    categoryId: "papier-mache",
    categorySlug: "papier-mache",
    categoryName: "Papier-mâché",
    images: [
      "https://picsum.photos/seed/pm-box-1/600/600",
      "https://picsum.photos/seed/pm-box-2/600/600",
    ],
    searchTokens: ["papier", "mache", "lacquered", "box", "chinar", "kashmiri", "painted"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "pm-vase-01",
    title: "Hand-Painted Papier-mâché Vase",
    description:
      "An elegant papier-mâché vase painted with intricate floral and bird motifs using natural pigments. The base is formed from layers of newspaper pulp and then painted and lacquered over weeks by hand. Each piece is completely one-of-a-kind.",
    price: 2800,
    notForSale: false,
    dimensions: "28cm height × 12cm diameter",
    categoryId: "papier-mache",
    categorySlug: "papier-mache",
    categoryName: "Papier-mâché",
    images: ["https://picsum.photos/seed/pm-vase/600/600"],
    searchTokens: ["papier", "mache", "vase", "painted", "floral", "bird", "kashmiri"],
    createdAt: new Date().toISOString(),
  },

  // Terracotta
  {
    id: "terra-necklace-01",
    title: "Terracotta Bead Necklace",
    description:
      "A handcrafted terracotta bead necklace with hand-painted geometric patterns in earthy reds, whites, and blacks. Each bead is individually shaped, sun-dried, and painted. Lightweight and striking.",
    price: 950,
    notForSale: false,
    dimensions: "48cm length",
    categoryId: "terracotta",
    categorySlug: "terracotta",
    categoryName: "Terracotta Jewellery",
    images: ["https://picsum.photos/seed/terra-necklace/600/600"],
    searchTokens: ["terracotta", "bead", "necklace", "handcrafted", "painted", "geometric"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "terra-earrings-01",
    title: "Terracotta Jhumka Earrings",
    description:
      "Traditional jhumka (bell-shaped) terracotta earrings with intricate carved detailing and a glossy glaze finish. These earrings fuse Kashmiri craft with pan-Indian jewellery tradition.",
    price: 650,
    notForSale: false,
    dimensions: "4cm drop length",
    categoryId: "terracotta",
    categorySlug: "terracotta",
    categoryName: "Terracotta Jewellery",
    images: ["https://picsum.photos/seed/terra-earrings/600/600"],
    searchTokens: ["terracotta", "jhumka", "earrings", "kashmiri", "glazed", "traditional"],
    createdAt: new Date().toISOString(),
  },

  // Coins
  {
    id: "coin-dogra-01",
    title: "Dogra Dynasty Silver Coin — Maharaja Ranbir Singh",
    description:
      "A rare silver coin minted during the reign of Maharaja Ranbir Singh (1857–1885) of the Dogra dynasty of Jammu & Kashmir. In excellent circulated condition with clear die strike. Comes with an authentication card.",
    price: null,
    notForSale: false,
    dimensions: "25mm diameter, 11g",
    categoryId: "coins",
    categorySlug: "coins",
    categoryName: "Coins",
    images: [
      "https://picsum.photos/seed/dogra-coin-1/600/600",
      "https://picsum.photos/seed/dogra-coin-2/600/600",
    ],
    searchTokens: ["dogra", "silver", "coin", "maharaja", "ranbir", "singh", "kashmir", "dynasty", "antique"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "coin-mughal-01",
    title: "Mughal Empire Copper Dam — Akbar Period",
    description:
      "A well-preserved copper dam coin from the reign of Emperor Akbar (1556–1605), minted at the Kashmir mint. Features Arabic script and geometric patterns characteristic of the period.",
    price: 6500,
    notForSale: false,
    dimensions: "20mm diameter, 20g",
    categoryId: "coins",
    categorySlug: "coins",
    categoryName: "Coins",
    images: ["https://picsum.photos/seed/mughal-coin/600/600"],
    searchTokens: ["mughal", "copper", "dam", "akbar", "coin", "kashmir", "mint", "antique", "arabic"],
    createdAt: new Date().toISOString(),
  },
];

export function getMockItemsByCategory(categorySlug: string): Item[] {
  return MOCK_ITEMS.filter((item) => item.categorySlug === categorySlug);
}

export function getMockItemById(id: string): Item | null {
  return MOCK_ITEMS.find((item) => item.id === id) ?? null;
}

export function searchMockItems(query: string): Item[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return MOCK_ITEMS.filter((item) =>
    tokens.some((t) => item.searchTokens.some((st) => st.includes(t)))
  );
}
