export interface AboutContent {
  intro: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  crafts: {
    heading: string;
    copper: { name: string; desc: string };
    silver: { name: string; desc: string };
    jade: { name: string; desc: string };
    papierMache: { name: string; desc: string };
  };
  enquiry: {
    title: string;
    subtitle: string;
  };
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  intro: {
    heading: "Our Story",
    paragraph1:
      "Traam and Beyond was born from a deep love for Kashmir\u2019s artistic heritage \u2014 a heritage that spans centuries and is carried forward by generations of dedicated artisans.",
    paragraph2:
      "The word Traam (\u062a\u0631\u0627\u0645) refers to copper in Kashmiri \u2014 one of the oldest crafts of the valley. Our collection begins there, but reaches far beyond: into silver filigree work, jade carvings, papier-m\u00e2ch\u00e9, terracotta jewellery, and ancient coins that hold stories of dynasties past.",
    paragraph3:
      "Every item in our collection is carefully sourced directly from craftsmen and families who have practiced these arts for generations. We believe that acquiring a handcrafted item is not just a purchase \u2014 it is an act of preserving culture.",
  },
  crafts: {
    heading: "The Crafts",
    copper: {
      name: "Copper (Traam)",
      desc: "Hand-hammered copper vessels, trays, and decorative items shaped by khar (coppersmiths) using techniques unchanged for centuries.",
    },
    silver: {
      name: "Silver",
      desc: "Intricate filigree and engraved silverwork \u2014 rings, pendants, boxes, and ornamental pieces.",
    },
    jade: {
      name: "Jade",
      desc: "Carved jade objects ranging from small figurines to decorative bowls, sourced and finished with extraordinary precision.",
    },
    papierMache: {
      name: "Papier-m\u00e2ch\u00e9",
      desc: "Lacquered papier-m\u00e2ch\u00e9 boxes, vases, and decorative pieces painted with floral and geometric motifs in vivid natural pigments.",
    },
  },
  enquiry: {
    title: "Have a Question?",
    subtitle: "We\u2019re happy to share more about any piece or our story.",
  },
};
