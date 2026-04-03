export interface HomeContent {
  hero: {
    tagline: string;
    headline: string;
    subtext: string;
    ctaLabel: string;
  };
  intro: {
    title: string;
    body: string;
  };
  collections: {
    title: string;
    subtitle: string;
  };
  enquiry: {
    title: string;
    subtitle: string;
  };
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    tagline: "Kashmiri Handcrafted Items",
    headline: "Traam and Beyond",
    subtext:
      "Discover a curated collection of authentic Kashmiri craftsmanship — each piece a story of heritage, skill, and artistry.",
    ctaLabel: "Explore Collection",
  },
  intro: {
    title: "Where Craft Meets Heritage",
    body: "Traam and Beyond brings you a thoughtfully curated selection of Kashmiri handcrafted items — each piece made by skilled artisans carrying forward centuries of tradition. From hand-hammered copper vessels to delicate papier-mâché, every item is a testament to Kashmir's rich artistic legacy.",
  },
  collections: {
    title: "Our Collections",
    subtitle: "Each category tells a distinct story of Kashmiri artisanship.",
  },
  enquiry: {
    title: "Get in Touch",
    subtitle: "Have a question or want to know more? We'd love to hear from you.",
  },
};
