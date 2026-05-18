"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";

type HeritagePanel = {
  shortLabel: string;
  sectionNumber?: string;
  title: string;
  subtitle?: string;
  introText?: string[];
  text: string[];
  caption?: string;
  captionUrl?: string;
  image: string | null;
  isReferences?: boolean;
};

const HERITAGE_PANELS: HeritagePanel[] = [
  {
    shortLabel: "3000–1500 BCE",
    sectionNumber: "1",
    title: "Prehistory: Origins of Material Culture",
    subtitle: "Early Settlements and the Birth of Craft (c. 3000–1500 BCE)",
    introText: [
      "Kashmir's arts and crafts emerge from a long continuum of making, shaped by memory, geography, patronage, and sustained cultural exchange. In this Himalayan valley, defined by its stunning landscape and shifting histories, craft emerged as a language through which communities interpreted the world around them. Materials were not merely used but understood. Across centuries, artisans have negotiated change with quiet ingenuity, absorbing influences without losing a sense of place. What distinguishes Kashmiri craftsmanship is not only technical refinement, but an enduring attentiveness to detail, proportion, and meaning. Objects were rarely isolated from life. They participated in ritual, domestic life, and exchange, carrying within them layers of intention and inheritance.",
      "This history is therefore not linear, but cumulative, comprised of a palimpsest of adaptations that reveal how skill, belief, and environment converge. To trace Kashmiri arts and crafts is to encounter a tradition that is at once rooted and fluid, shaped as much by continuity as by transformation, and sustained by the persistent dialogue between hand, material, and imagination.",
    ],
    text: [
      "The foundations of Kashmiri craft traditions lie in prehistoric settlements such as Burzahom, where early communities produced handmade pottery, tools, and rudimentary terracotta objects. These artifacts demonstrate an early sensitivity to material and function, establishing a lasting ethos of resourcefulness, adaptability, and a respect for natural materials, that continues to define Kashmiri craftsmanship [1][2].",
    ],
    caption: "Pottery from Burzahom, Kashmir. Neolithic period, 2700 BC.\nNational Museum, New Delhi.\nReproduced from Kaw, M. K. Kashmir and Its People: Studies in the Evolution of Kashmiri Society. New Delhi: APH Publishing, 2004.",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-1.jpeg",
  },
  {
    shortLabel: "2nd BCE",
    sectionNumber: "2",
    title: "Early Antiquity: Indigenous Beliefs and External Contacts",
    subtitle: "Naga Traditions, Indo-Greek and Indo Scythian Influences (c. 2nd century BCE onwards)",
    text: [
      "As settled life developed, Kashmir's cultural landscape was shaped by indigenous belief systems, particularly Naga traditions associated with water and fertility, which informed symbolic and ritual practices [3]. Simultaneously, Indo-Greek and Gandharan interactions introduced naturalistic representation and proportional systems, while subsequent Indo-Scythian (Shaka) influences contributed to the transmission of Central Asian motifs and evolving artistic forms in the wider northwestern region, subtly influencing regional artistic expression [4][21]. Though subtle, these influences marked the beginning of Kashmir's role as a cultural intermediary between South Asia and the wider Hellenistic and Central Asian worlds.",
    ],
    caption: "Terracotta Statuette from Semthan, Kashmir (Early Historic Period, c. 2nd century BCE–1st century CE).\nAshmolean Museum, University of Oxford.\nImage accessed via Wikipedia: Semthan Archaeological Site.",
    captionUrl: "https://en.wikipedia.org/wiki/Semthan",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-2.jpeg",
  },
  {
    shortLabel: "1–5 CE",
    sectionNumber: "3",
    title: "Buddhist Kashmir: Intellectual and Artistic Formation",
    subtitle: "Sacred Aesthetics under the Kushan Empire (1st–5th century CE)",
    text: [
      "Under Kushan patronage, Kashmir emerged as a major centre of Buddhist scholarship, associated with the Fourth Buddhist Council. Artistic production in stone, terracotta, and metal expanded significantly, reflecting refined craftsmanship and spiritual purpose [5][6]. The works from this time reveal a sophisticated understanding of form and symbolism, where craftsmanship served spiritual purpose.",
    ],
    caption: "Terracotta Tile, Kashmir (Moulded Terracotta, Kushan Period, c. 3rd–5th century CE).\nVictoria and Albert Museum, London. Accessed via Victoria and Albert Museum Collections.",
    captionUrl: "https://collections.vam.ac.uk/item/O67325/tile-tile-unknown/",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-3.jpeg",
  },
  {
    shortLabel: "6–12 CE",
    sectionNumber: "4",
    title: "Hindu Kingdoms: Monumentality and Refinement",
    subtitle: "Temple Arts under the Karkota Dynasty (6th–12th century CE)",
    text: [
      "Temple architecture and sculptural traditions flourished during this period, with sites such as Martand Sun Temple exemplifying advanced engineering and sculptural precision. Artistic practices emphasized iconography, compositional balance, and sacred symbolism [7][8]. Alongside architecture, metalwork in bronze and copper developed further, reinforcing the integration of ritual, art, and craftsmanship.",
    ],
    caption: "Martand Sun Temple, 8th century, Kashmir (Albumen Photograph, c. 1865), by Francis Frith.\nVictoria and Albert Museum, London. Reproduced via Hindu Aesthetic.",
    captionUrl: "https://hinduaesthetic.medium.com/m%C4%81rt%C4%81%E1%B9%87%E1%B8%8Da-32673a77a1f",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-4.jpeg",
  },
  {
    shortLabel: "7–14 CE",
    sectionNumber: "5",
    title: "Kashmir and the Silk Route: Exchange and Synthesis",
    subtitle: "Cross-Cultural Influences (7th–14th century CE)",
    text: [
      "Kashmir's position along major trade routes facilitated cultural exchange with Central Asia, Persia, and the Indian subcontinent. This resulted in the assimilation of diverse motifs and techniques into a distinct regional aesthetic [9]. Motifs such as the chinar leaf, lotus, and cypress emerged as enduring visual elements, reflecting both the natural environment and broader cosmological ideas. This period marks a synthesis of earlier traditions with new cultural forms, shaping the distinctive identity of Kashmiri craftsmanship.",
    ],
    caption: "Crowned Buddha Shakyamuni (Copper Alloy Sculpture, Kashmir or Northwestern Himalayan Region, c. 8th–11th century CE).\nAsia Society Museum, New York. Accessed via Asia Society Museum Collection.",
    captionUrl: "https://sites.asiasociety.org/asianjourneys/rise-of-south-asian-southeast-asian-and-himalayan-art-collecting/",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-5.jpeg",
  },
  {
    shortLabel: "14th c.",
    sectionNumber: "6",
    title: "The Shah Miri Dynasty: The Persianate Transformation",
    subtitle: "Craft Expansion under Mir Sayyid Ali Hamadani (14th century)",
    text: [
      "The rule of the Shah Mir dynasty in Kashmir (1339–1561) marked a significant phase in the growth of arts and crafts. Founded by Shah Mir after the reign of Rinchan (Rinchana), the Ladakhi Buddhist ruler whose conversion to Islam marked an important turning point in Kashmir's religious and political history, this period witnessed strong cultural influences from Persia and Central Asia [16]. An important contemporary figure was Sayyid Ali Hamdani, a 14th-century Sufi saint whose visits to Kashmir had a lasting cultural impact [18]. His arrival marked a transformative moment, introducing new crafts and organized workshop systems (karkhanas), marking the beginning of a more structured and collaborative approach to production [10]. Sayyid Ali Hamdani is credited with bringing skilled artisans from Persia and promoting crafts such as shawl weaving, carpet making, wood carving, and papier-mâché [17][18].",
      "These crafts later became central to Kashmir's economy and identity [20]. The Shah Mir rulers supported these developments by encouraging cultural exchange and providing patronage to artisans [16]. This led to a blend of local traditions with Persian artistic styles [19]. Architecture and decorative arts also flourished during this time. Mosques, shrines, and houses were decorated with intricate woodwork and detailed designs, reflecting both religious and artistic values [20]. The overlap between Shah Mir rule and Hamdani's influence created a strong foundation for Kashmir's artistic heritage for which Kashmir remains famous today.",
    ],
    caption: "Khanqah of Shah Hamadan on the Jhelum River, Srinagar originally built in 1395 CE (Watercolour Painting, Kashmir, c. 19th century).\nMpositive – Mir Syed Ali Hamadani.\nAccessed via Mpositive Archive.",
    captionUrl: "https://www.mpositive.in/tag/mir-syed-ali-hamadani/",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-6.jpeg",
  },
  {
    shortLabel: "15th c.",
    sectionNumber: "7",
    title: "Sultanate Golden Age",
    subtitle: "Patronage under Zain-ul-Abidin (15th century)",
    text: [
      "Zain-ul-Abidin's reign (r. 1420–1470) fostered further artistic growth through unprecedented state patronage, improving technical standards and establishing a recognizable Kashmiri craft identity [11]. Artisanship was actively cultivated as both cultural expression and economic strategy. Under his patronage, Kashmir developed a more recognizable and refined artistic identity shaped by Persian, Central Asian, and indigenous traditions.",
      "A remarkable example of this synthesis survives in the shrine of Sayyid Muhammad Madni (Madin Sahib), built in 1444 in Srinagar. Once adorned with glazed tiles depicting a centaur-like archer whose tail transformed into a dragon's head, the shrine preserves one of the rare surviving examples of figurative art in Kashmiri Islamic architecture. The motif reflects a striking fusion of Persian and Chinese artistic vocabularies, revealing Kashmir's continued engagement with wider trans-Asian visual cultures [22].",
    ],
    caption: "Madin Sahib Mosque (Architectural Complex, Srinagar, Kashmir, 15th century CE; photograph c. early 20th century).\nAccessed via Search Kashmir Archive.",
    captionUrl: "https://searchkashmir.org/why-is-madin-sahib-locked/",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-7.jpeg",
  },
  {
    shortLabel: "16–18 c.",
    sectionNumber: "8",
    title: "Mughal Kashmir: Luxury, Precision and Global Reach",
    subtitle: "Imperial Aesthetics under Akbar (16th–18th century)",
    text: [
      "Mughal annexation introduced refined aesthetics emphasizing naturalism, symmetry, and controlled ornamentation. Kashmiri crafts achieved high levels of sophistication and gained international recognition [12]. They moved, were used, adapted, and recontextualized. Kashmir became a centre for luxury goods, producing objects that combined technical mastery with visual elegance. By 17th and 18th century, Kashmiri crafts became significant export commodities, circulating across Central Asia, Europe, and the Middle East, reinforcing the region's artistic reputation [9][12].",
      "During this time, Kashmiri crafts became more elaborate and luxurious. Shawls gained international fame for their softness and intricate designs, Carpets achieved extraordinary knot density and compositional complexity, Metalwork incorporated techniques such as enamelling (meenakari), while wood carving achieved remarkable intricacy, especially in walnut wood. The Mughal aesthetic introduced refined floral patterns, symmetry, and a sense of grandeur that became hallmarks of Kashmiri design. Many motifs like paisleys, vines, and garden-inspired patterns, still seen today, have their roots in this period.",
    ],
    caption: "Long Jamawar Shawl (Pashmina Wool Jamawar Textile, Kashmir, early 18th century CE).\nAccessed via Christie's Archive.",
    captionUrl: "https://onlineonly.christies.com/s/important-private-collection-kashmir-shawls/long-jamawar-panel-62/71461",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-8.jpeg",
  },
  {
    shortLabel: "18–19 c.",
    sectionNumber: "9",
    title: "Political Transitions: Resilience of Craft",
    subtitle: "Afghan, Sikh, and Dogra Rule (18th–19th century)",
    text: [
      "Following the decline of Mughal authority, Kashmir underwent periods of political instability under successive regimes. Despite political instability, craft traditions persisted and adapted, demonstrating resilience and continuity under changing regimes [13]. Production became more market-oriented. Artisans continued to produce traditional items, though often under difficult circumstances. The resilience of these crafts during periods of upheaval is a testament to their importance in Kashmiri identity.",
    ],
    caption: "Embroidered Figural Square Rumal (Embroidered Pashmina Textile, Kashmir, c. 1835–45 CE).\nAccessed via Christie's Archive.",
    captionUrl: "https://onlineonly.christies.com/s/important-private-collection-kashmir-shawls/embroidered-figural-square-shawl-amli-rumal-55/71455",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-9.jpeg",
  },
  {
    shortLabel: "19–20 c.",
    sectionNumber: "10",
    title: "Colonial Encounter and Decline: Industrial Challenge",
    subtitle: "19th–early 20th century Transformations",
    text: [
      "European demand, particularly for shawls, briefly revitalized the craft economy, but industrialization introduced competition from machine-made goods, leading to decline in traditional production [14]. Many artisans were forced to abandon their crafts or shift to less skilled labour. However, despite these challenges, certain crafts, especially shawls and carpets, continued to find niche markets due to their superior quality.",
    ],
    caption: "Anglo-Indian Silver Three-Piece Tea Service of Kang Form, Kashmir, c. 1900 CE.\nChiswick Auctions, London.\nAccessed via Invaluable Auction Archive.",
    captionUrl: "https://www.invaluable.com/auction-lot/a-late-19th-early-20th-century-anglo-indian-unmar-98-c-56c488f81a/",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-10.jpeg",
  },
  {
    shortLabel: "20th c.",
    sectionNumber: "11",
    title: "Modern Kashmir: Survival, Revival, and Reinterpretation",
    subtitle: "20th century afterwards",
    text: [
      "Modern revival efforts through government initiatives and global recognition have helped sustain Kashmiri crafts, many of which now hold protected (GI) status; most notably Kashmiri Pashmina, Kani shawls, Sozni embroidery, Kashmiri carpets, Papier-mâché, Walnut wood carving, and Khatamband [11][15]. While adapting to contemporary markets, artisans continue to uphold techniques passed down through generations. Today, Kashmiri arts and crafts stand as enduring symbols of cultural resilience, bridging tradition and modernity. Their survival reflects not only artistic excellence but also cultural resilience.",
    ],
    caption: "Lacquered Papier-Mâché Ensemble with Polo Motifs (Kashmir, second half of the 20th century CE).\nTraam and Beyond Private Collection.",
    image: "/Crafts%20Heritage%20of%20Kashmir/Chapter-11.jpeg",
  },
  {
    shortLabel: "Ref",
    title: "References",
    text: [
      "Archaeological Survey of India. Excavation Reports: Burzahom. New Delhi: ASI.",
      "Sri Pratap Singh Museum. Catalogue of Neolithic Collections. Srinagar: SPS Museum.",
      "Nilamata Purana. Translated editions. Various publishers.",
      "Rowland, Benjamin. The Art and Architecture of India: Buddhist, Hindu, Jain. Harmondsworth: Penguin Books.",
      "UNESCO. Buddhist Heritage of Kashmir and Central Asia. Paris: UNESCO Publications.",
      "Siudmak, Jacek. The Buddhist Heritage of Kashmir. New Delhi: Oxford University Press, 2013.",
      "Archaeological Survey of India. Monuments of Kashmir: Temple Architecture Reports. New Delhi: ASI.",
      "Kak, Ram Chandra. Ancient Monuments of Kashmir. London: Luzac & Co., 1933.",
      "UNESCO. The Silk Roads: History and Heritage. Paris: UNESCO Publishing.",
      "Roxburgh, David J. (ed.). The Arts of the Islamic World, 640–1800. London: Thames & Hudson.",
      "Development Commissioner (Handicrafts). Handicrafts of Kashmir. New Delhi: Ministry of Textiles, Government of India.",
      "Welch, Stuart Cary. The Mughal Emperors and Their Courts. London: Thames & Hudson.",
      "Bamzai, P. N. K. Culture and Political History of Kashmir. New Delhi: M.D. Publications.",
      "Irwin, John. The Kashmir Shawl. London: Victoria and Albert Museum, 1973.",
      "Indian National Trust for Art and Cultural Heritage (INTACH). Documentation of Kashmiri Crafts. New Delhi: INTACH.",
      "Bamzai, P. N. K. (1994). Culture and Political History of Kashmir. New Delhi: M.D. Publications.",
      "Lawrence, W. R. (1895). The Valley of Kashmir. London: H. Frowde.",
      "Rizvi, S. A. A. (1983). A History of Sufism in India, Vol. I. New Delhi: Munshiram Manoharlal.",
      "Digby, S. (2004). 'Before Timur Came: Provincialization of the Delhi Sultanate through the Fourteenth Century.'",
      "Khan, M. I. (1978). Kashmir's Transition to Islam: The Role of Muslim Rishis. Manohar.",
      "Harmatta, J. (1994). History of Civilizations of Central Asia, Vol. II. UNESCO.",
      "Haider, T. (2025). 'Kashmir’s Sufi Shrines: Mausoleum, Khanqah, History and Heritage under Mughal Rule.' Frontline.\nhttps://frontline.thehindu.com/photo-essay/kashmir-sufi-shrines-srinagar-mausoleum-khanqah-history-heritage-islam-mughal-rule/article69075736.ece",
    ],
    isReferences: true,
    image: null,
  },
];

function OrganicDot({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      className={`transition-all duration-700 ease-out drop-shadow-md ${
        active ? "text-terracotta scale-125 fill-current" : "text-stone/30 fill-current scale-75"
      }`}
    >
      <path d="M6.2 0.8 C8.5 0.5 11 2 11.2 5 C11.5 8 9.5 11 6.5 11.2 C3.5 11.5 0.5 9.5 0.8 6 C1 3 3.5 1.5 6.2 0.8 Z" />
    </svg>
  );
}

function OrganicLine() {
  return (
    <svg
      className="absolute inset-x-0 w-full h-full -z-10 pointer-events-none pb-[12px]"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="roughpaper-ch">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <line
        x1="50%"
        y1="20px"
        x2="50%"
        y2="calc(100% - 20px)"
        stroke="currentColor"
        className="text-stone/30"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        filter="url(#roughpaper-ch)"
      />
    </svg>
  );
}

function TimelineIndicator({ activeIndex, visible }: { activeIndex: number; visible: boolean }) {
  return (
    <div
      className={`hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 z-[50] flex-col items-center transition-opacity duration-500 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col space-y-6 py-2">
        <OrganicLine />
        {HERITAGE_PANELS.map((panel, i) => (
          <div key={i} className="relative flex items-center justify-center group h-4">
            <OrganicDot active={activeIndex === i} />
            <div
              className={`absolute right-full mr-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeIndex === i ? "opacity-100 -translate-x-1" : "opacity-0 translate-x-2"
              }`}
            >
              <span className="text-xs lg:text-sm whitespace-nowrap text-terracotta font-serif tracking-widest uppercase">
                {panel.shortLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferenceText({ text, index }: { text: string; index: number }) {
  const newlineIdx = text.indexOf("\n");
  if (newlineIdx === -1) {
    return (
      <p className="text-stone/70 text-sm leading-relaxed">
        [{index + 1}]{"  "}{text}
      </p>
    );
  }
  const beforeUrl = text.slice(0, newlineIdx);
  const url = text.slice(newlineIdx + 1).trim();
  return (
    <p className="text-stone/70 text-sm leading-relaxed">
      [{index + 1}]{"  "}{beforeUrl}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-0.5 text-stone/50 hover:text-terracotta underline break-all"
      >
        {url}
      </a>
    </p>
  );
}

function TextBlock({
  panel,
  index,
  setActiveIndex,
  setImageIndex,
  scrollDirRef,
}: {
  panel: HeritagePanel;
  index: number;
  setActiveIndex: (i: number) => void;
  setImageIndex: (i: number) => void;
  scrollDirRef: React.RefObject<"up" | "down">;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isCentered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const isNearTop = useInView(ref, { margin: "-20% 0px -70% 0px" });

  useEffect(() => {
    if (isCentered) setActiveIndex(index);
  }, [isCentered, index, setActiveIndex]);

  useEffect(() => {
    if (isNearTop) {
      setImageIndex(index);
    } else if (index > 0 && scrollDirRef.current === "up") {
      setImageIndex(index - 1);
    }
  }, [isNearTop, index, setImageIndex, scrollDirRef]);

  return (
    <div
      ref={ref}
      className="bg-[#1a130a] w-full py-28 lg:py-40 px-6 lg:px-20 min-h-[75vh] flex flex-col justify-center items-center relative z-10"
    >
      <div className="max-w-2xl w-full mx-auto text-left space-y-6">
        {/* Intro text — only on Panel 1 */}
        {panel.introText && (
          <div className="space-y-5 pb-10 border-b border-white/10 mb-10">
            {panel.introText.map((para, i) => (
              <p key={i} className="text-[#DAC4A1] text-base lg:text-lg leading-relaxed text-justify">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Section heading */}
        {panel.sectionNumber && (
          <h3 className="text-lg lg:text-xl text-cream mb-1">
            {panel.sectionNumber}. {panel.title}
          </h3>
        )}
        {!panel.sectionNumber && !panel.isReferences && (
          <h3 className="text-lg lg:text-xl text-cream mb-1">{panel.title}</h3>
        )}
        {panel.isReferences && (
          <h3 className="font-display text-3xl lg:text-4xl text-cream mb-6">{panel.title}</h3>
        )}

        {/* Subtitle / era */}
        {panel.subtitle && (
          <p className="text-terracotta text-base lg:text-lg font-semibold mb-8">{panel.subtitle}</p>
        )}

        {/* Body text */}
        <div className={panel.isReferences ? "space-y-3" : "space-y-6"}>
          {panel.text.map((paragraph, i) =>
            panel.isReferences ? (
              <ReferenceText key={i} text={paragraph} index={i} />
            ) : (
              <p key={i} className="text-[#DAC4A1] text-base lg:text-lg leading-relaxed text-justify">
                {paragraph}
              </p>
            )
          )}
        </div>

        {/* Figure caption */}
        {panel.caption && (
          <p className="text-stone/60 text-xs lg:text-sm italic leading-relaxed pt-4 border-t border-white/5 whitespace-pre-line">
            {panel.caption}
            {panel.captionUrl && (
              <a
                href={panel.captionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-0.5 not-italic text-stone/50 hover:text-terracotta underline break-all"
              >
                {panel.captionUrl}
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CraftHeritageTimeline({ visible }: { visible: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const scrollDirRef = useRef<"up" | "down">("down");

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      scrollDirRef.current = window.scrollY > lastY ? "down" : "up";
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-[#1a130a]">
      <TimelineIndicator activeIndex={activeIndex} visible={visible} />

      {/* Sticky background layer */}
      <div className="sticky top-0 h-screen w-full z-[1] bg-[#0a0a0a] flex items-center justify-center pointer-events-none overflow-hidden">
        {HERITAGE_PANELS.map((panel, i) => {
          if (!panel.image) return null;
          return (
            <Image
              key={i}
              src={panel.image}
              alt={panel.title}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`object-contain transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                imageIndex === i ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      {/* Foreground pulled up to overlap the sticky background */}
      <div className="relative z-[2] w-full flex flex-col -mt-[100vh]">
        {/* Section title */}
        <div className="bg-[#1a130a] w-full pt-24 pb-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-5xl sm:text-6xl text-cream text-center">
              Craft Heritage of Kashmir
            </h2>
          </div>
        </div>

        {HERITAGE_PANELS.map((panel, i) => (
          <div key={i} className="w-full">
            <TextBlock
              panel={panel}
              index={i}
              setActiveIndex={setActiveIndex}
              setImageIndex={setImageIndex}
              scrollDirRef={scrollDirRef}
            />
            {panel.image && (
              <div className="w-full aspect-square lg:h-[85vh] bg-transparent pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
