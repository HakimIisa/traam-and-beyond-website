// Ported from Bazar Jajeer's src/lib/data/craftImages.ts + the CRAFT_COPY map
// inside FeaturedCrafts.tsx, merged into one lookup. The real site pulls its
// category list from Firestore (id/sortOrder), but FeaturedCrafts.tsx only
// ever reads `category.slug`/`category.name` as a lookup key — never renders
// them — so a static list is a faithful, dependency-free substitute here.

export interface BazarCategory {
  id: string;
  slug: string;
  name: string;
}

export const BAZAR_CATEGORIES: BazarCategory[] = [
  { id: "copper_ware", slug: "copper_ware", name: "Copper Ware" },
  { id: "papier_mache", slug: "papier_mache", name: "Papier Mache" },
  { id: "silverware", slug: "silverware", name: "Silverware" },
  { id: "enamelware", slug: "enamelware", name: "Enamelware" },
  { id: "terracotta", slug: "terracotta", name: "Terracotta" },
  { id: "green_serpentine", slug: "green_serpentine", name: "Green Serpentine" },
  { id: "coins", slug: "coins", name: "Coins" },
  { id: "shawls", slug: "shawls", name: "Shawls" },
  { id: "jewellery", slug: "jewellery", name: "Jewellery" },
  { id: "carpets", slug: "carpets", name: "Carpets" },
  { id: "willow_wicker", slug: "willow_wicker", name: "Willow Wicker" },
  { id: "woodwork", slug: "woodwork", name: "Woodwork" },
  { id: "brassware", slug: "brassware", name: "Brassware" },
];

type Size = "xl" | "lg" | "md" | "sm";
type Align = "top" | "center" | "bottom";
type TextPos = "left" | "right";

export interface CraftItem {
  title: string;
  line: string;
  size: Size;
  align: Align;
  textPos: TextPos;
  rotate: number;
  image: string;
  alt: string;
  aspect: number;
}

export const CRAFT_ITEMS: Record<string, CraftItem> = {
  copper_ware: {
    title: "Hammered by Hand",
    line: "Copper, raised and etched by hand.",
    size: "lg",
    align: "center",
    textPos: "right",
    rotate: 0,
    image: "/BazarJajeer/categories/copper_ware.webp",
    alt: "Engraved Kashmiri copper ewer and footed tray",
    aspect: 1.08,
  },
  papier_mache: {
    title: "Painted in Layers",
    line: "Paper pulp, painted in Persian detail.",
    size: "md",
    align: "top",
    textPos: "left",
    rotate: -2,
    image: "/BazarJajeer/categories/papier_mache.webp",
    alt: "Papier-mâché bowl with hand-painted red and gold floral pattern",
    aspect: 1.01,
  },
  silverware: {
    title: "Etched in Silver",
    line: "Repoussé and filigree, fading and fine.",
    size: "lg",
    align: "bottom",
    textPos: "right",
    rotate: 0,
    image: "/BazarJajeer/categories/silverware.webp",
    alt: "Tall engraved silver vessel with domed lid",
    aspect: 0.54,
  },
  enamelware: {
    title: "Fired in Colour",
    line: "Enamel fired in turquoise and cobalt.",
    size: "sm",
    align: "top",
    textPos: "left",
    rotate: 3,
    image: "/BazarJajeer/categories/enamelware.webp",
    alt: "Blue and gold enamelled brass cup with ornate handle",
    aspect: 1.56,
  },
  terracotta: {
    title: "Earth, Shaped",
    line: "Clay shaped since the Neolithic age.",
    size: "md",
    align: "bottom",
    textPos: "right",
    rotate: 0,
    image: "/BazarJajeer/categories/terracotta.webp",
    alt: "Carved terracotta multi-spout lamp",
    aspect: 1.01,
  },
  green_serpentine: {
    title: "Carved in Stone",
    line: "Zahar mohar stone, carved for ritual.",
    size: "sm",
    align: "top",
    textPos: "left",
    rotate: -3,
    image: "/BazarJajeer/categories/green_serpentine.webp",
    alt: "Green serpentine stone vase with a silver filigree lid",
    aspect: 0.51,
  },
  coins: {
    title: "Kept Through Centuries",
    line: "Terracotta tokens, turned to gold.",
    size: "sm",
    align: "bottom",
    textPos: "right",
    rotate: 0,
    image: "/BazarJajeer/categories/coins.webp",
    alt: "Scattered collection of antique coins",
    aspect: 2.35,
  },
  shawls: {
    title: "Woven in Wool",
    line: "Pashmina wool, sozni-stitched for royalty.",
    size: "lg",
    align: "top",
    textPos: "left",
    rotate: 0,
    image: "/BazarJajeer/categories/shawls.webp",
    alt: "Close-up of hand-embroidered pashmina shawl paisley border",
    aspect: 1.0,
  },
  jewellery: {
    title: "Set by Hand",
    line: "Silver and stone, engraved for ceremony.",
    size: "lg",
    align: "bottom",
    textPos: "right",
    rotate: 2,
    image: "/BazarJajeer/categories/jewellery.webp",
    alt: "Ornate gemstone necklace with a jewelled pendant",
    aspect: 0.72,
  },
  carpets: {
    title: "Knotted, Row by Row",
    line: "Persian-rooted knots, months in the making.",
    size: "lg",
    align: "top",
    textPos: "left",
    rotate: 0,
    image: "/BazarJajeer/categories/carpets.webp",
    alt: "Corner detail of a hand-knotted Kashmiri carpet",
    aspect: 0.96,
  },
  willow_wicker: {
    title: "Bent from the Riverbank",
    line: "Willow shoots, bent into everyday form.",
    size: "md",
    align: "bottom",
    textPos: "right",
    rotate: -2,
    image: "/BazarJajeer/categories/willow_wicker.webp",
    alt: "Woven willow wicker kangri basket",
    aspect: 0.86,
  },
  woodwork: {
    title: "Carved from Walnut",
    line: "Walnut lattice, carved under Mughal courts.",
    size: "md",
    align: "top",
    textPos: "left",
    rotate: 0,
    image: "/BazarJajeer/categories/woodwork.webp",
    alt: "Traditional carved wooden sandals with rope straps",
    aspect: 1.27,
  },
  brassware: {
    title: "Engraved in Brass",
    line: "Brass, chased by hand and held sacred.",
    size: "sm",
    align: "bottom",
    textPos: "right",
    rotate: 3,
    image: "/BazarJajeer/categories/brassware.webp",
    alt: "Brass maple-leaf-shaped tray with three cup holders",
    aspect: 1.67,
  },
};
