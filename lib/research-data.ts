export interface ResearchItem {
  slug: string;
  title: string;
  description: string;
  images: string[];
}

export interface ResearchSection {
  sectionSlug: string;
  title: string;
  description: string;
  items: ResearchItem[];
}

export const RESEARCH_SECTIONS: ResearchSection[] = [
  {
    sectionSlug: "adaptive-reuse",
    title: "Adaptive Reuse",
    description:
      "These works seek to reimagine artefacts beyond their original purpose to extend their lifespan while preserving the cultural memory and craftsmanship. Rooted in principles of sustainability, they encourage responsible design, allowing heritage objects to remain relevant in changing contexts by creating new meanings while maintaining a tangible connection to their rich material culture. Rather than replicating the past, these interventions offer new narratives that connect historical craftsmanship with present-day needs and future possibilities.",
    items: [
      {
        slug: "console",
        title: "Console",
        description:
          "This console table is created from a window salvaged from a nineteenth-century Kashmiri house. The original frame was carefully repaired and adapted for a new function while retaining its historic character. The missing pinjra kari (lattice work), which would originally have formed part of the window, was reconstructed in walnut wood using traditional techniques. The lower dilla panel was hand-painted by a Kashmiri papier-mâché artisan, introducing another layer of local craftsmanship. Reimagined as a contemporary furniture piece, the table brings together architecture, woodwork, and decorative arts, preserving the memory of a historic building while giving its materials a renewed purpose.",
        images: [
          "/Research/AR2A.jpeg",
          "/Research/AR2B.jpeg",
          "/Research/AR2C.jpeg",
        ],
      },
    ],
  },
  {
    sectionSlug: "reinterpretation",
    title: "Reinterpretation",
    description:
      "These works seek to reimagine artefacts beyond their original purpose to extend their lifespan while preserving the cultural memory and craftsmanship. Rooted in principles of sustainability, they encourage responsible design, allowing heritage objects to remain relevant in changing contexts by creating new meanings while maintaining a tangible connection to their rich material culture. Rather than replicating the past, these interventions offer new narratives that connect historical craftsmanship with present-day needs and future possibilities.",
    items: [
      {
        slug: "warusi-wardrobe",
        title: "Warusi Wardrobe",
        description:
          "Inspired by the warusi, this wardrobe translates a traditional Kashmiri architectural element into a contemporary furniture form. Historically, warusi partitions were used to subdivide interior spaces through a system of removable timber panels framed by decorative arches. Drawing on this vocabulary, the wardrobe incorporates arched panel detailing and handmade pinjra kari (latticework) in deodar wood, recalling the craftsmanship of traditional Kashmiri interiors. Through reinterpretation rather than replication, the design seeks to preserve the essence of a vernacular architectural tradition while responding to contemporary needs.",
        images: [
          "/Research/RE1A.jpeg",
          "/Research/RE1B.jpeg",
          "/Research/RE1C.jpeg",
          "/Research/RE1D.jpeg",
        ],
      },
    ],
  },
  {
    sectionSlug: "graphic-design",
    title: "Graphic Design",
    description:
      "These works explore the translation of traditional Kashmiri visual aesthetics into contemporary graphic communication. Drawing inspiration from vernacular motifs, ornamentation, and craft traditions, they reinterpret traditional visual vocabularies for contemporary digital media. By adapting the inherited design vocabularies to new contexts, these works seek to create visual narratives that preserve cultural memory while engaging with present day needs and modes of communication.",
    items: [
      {
        slug: "office-mugs",
        title: "Office Mugs",
        description: "",
        images: ["/Research/GD1A.jpeg", "/Research/GD1B.jpeg"],
      },
    ],
  },
];

export function getResearchSection(slug: string): ResearchSection | undefined {
  return RESEARCH_SECTIONS.find((s) => s.sectionSlug === slug);
}

export function getResearchItem(
  sectionSlug: string,
  itemSlug: string
): ResearchItem | undefined {
  return getResearchSection(sectionSlug)?.items.find((i) => i.slug === itemSlug);
}
