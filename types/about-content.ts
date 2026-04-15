export interface AboutContent {
  introduction: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    paragraph5: string;
  };
  craftHeritage: {
    body: string;
  };
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  introduction: {
    paragraph1:
      "It was during a casual evening stroll in Srinagar with my mother in 2004 that we passed by this shop selling Kashmiri copperware. My eyes fell upon an antique bowl with hand engraved and enamelled floral rim, it's patina worn off, just sitting there on a shelf among its fresh counterparts. Someone had sold it by weight, in exchange for something new, a practice not uncommon even today. My mom got me that for 300 Indian rupees and it became the first item in my collection that I still cherish.",
    paragraph2:
      "Since I was a kid, growing up in a cultural context full of arts and crafts, I subconsciously was developing a taste for Kashmiri handicrafts. Learning about them was my solace. It inspired me to collect Kashmiri antiques as a hobby, which I have unceasingly pursued ever since.",
    paragraph3:
      "Even during my education as an architect, the aspect of Kashmiri vernacular architecture that went hand in hand with its handicrafts always amazed me. Much of my local work is therefore aimed at incorporating tractional handicrafts into contemporary architectural practices as a means to their revival.",
    paragraph4:
      "However, seeing many of the crafts dead, and the rapid decline in the quality of the ones still being produced, I felt the need to document these masterpieces across different mediums, with an idea of creating a repository, not just of the objects, but their stories, as evidence of a legacy worth remembering, for the new generation to see, and hopefully be inspired from, just as I was.",
    paragraph5:
      "Although most of the items in my collection are sourced locally, many have also been brought from Europe and America, back home where they belong.",
  },
  craftHeritage: {
    body: "",
  },
};
