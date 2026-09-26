import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal",
  description: "Terms of use, collection notice, privacy and intellectual property for Traam and Beyond.",
};

const SECTIONS = [
  { id: "terms", label: "Terms of Use" },
  { id: "collection", label: "About the Collection" },
  { id: "privacy", label: "Privacy" },
  { id: "ip", label: "Intellectual Property" },
  { id: "contact", label: "Contact" },
];

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <h1 className="font-display text-3xl sm:text-5xl text-cream mb-3">Legal</h1>
      <p className="text-stone text-sm mb-1">
        Terms, collection notice, privacy and intellectual property
      </p>
      <p className="text-stone text-sm mb-10">Last updated: 25 September 2026</p>

      <nav aria-label="Table of contents" className="flex flex-col gap-2 mb-12">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-sm text-stone hover:text-cream transition-colors w-fit"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 mb-10" />

      <section id="terms" className="scroll-mt-24 mb-12">
        <h2 className="font-display text-2xl sm:text-3xl text-cream mb-4">Terms of Use</h2>
        <p className="text-stone leading-relaxed">
          Traam and Beyond is a website presenting the private collection and research of
          Hakim Ali Reza. By using this site you agree to these terms. The content is
          provided for cultural, educational and research purposes. We may update this
          page from time to time; the date above shows the latest version. These terms
          are governed by the laws of India, and the courts at Srinagar have jurisdiction.
        </p>
      </section>

      <section id="collection" className="scroll-mt-24 mb-12">
        <h2 className="font-display text-2xl sm:text-3xl text-cream mb-4">About the Collection</h2>
        <p className="text-stone leading-relaxed mb-4">
          Unless otherwise noted, all objects shown on this site belong to the private
          collection of Hakim Ali Reza and are displayed for heritage, educational and
          research purposes.
        </p>
        <p className="text-stone leading-relaxed mb-4">
          Many objects in the collection are antiquities within the meaning of India&apos;s
          Antiquities and Art Treasures Act, 1972. Antiquities shown on this site are not
          currently offered for sale and are not exported outside India. This may change
          in the future if the required licence under the Act is obtained; any such
          change will be reflected on this page. Enquiries are welcome about the history,
          craft and context of the objects.
        </p>
        <p className="text-stone leading-relaxed">
          Dates, attributions, origins and descriptions reflect the collector&apos;s
          research and informed opinion. They are not certified appraisals, valuations
          or authentications.
        </p>
      </section>

      <section id="privacy" className="scroll-mt-24 mb-12">
        <h2 className="font-display text-2xl sm:text-3xl text-cream mb-4">Privacy</h2>
        <p className="text-stone leading-relaxed mb-4">
          <span className="text-cream">What we collect: </span>
          When you use the enquiry form, we collect your name, email address and message.
        </p>
        <p className="text-stone leading-relaxed mb-4">
          <span className="text-cream">Why: </span>
          Only to read and reply to your enquiry. We do not sell your data or use it for
          marketing. We do not use analytics or tracking cookies on this site.
        </p>
        <p className="text-stone leading-relaxed mb-4">
          <span className="text-cream">Where it is stored: </span>
          Enquiries are stored securely using Google Firebase, whose servers may be
          located outside India.
        </p>
        <p className="text-stone leading-relaxed mb-4">
          <span className="text-cream">How long: </span>
          We keep enquiries for 24 months, after which they are deleted.
        </p>
        <p className="text-stone leading-relaxed mb-4">
          <span className="text-cream">Your rights: </span>
          You can ask to see, correct or delete your information at any time by writing
          to{" "}
          <a href="mailto:hakimalirezah@hotmail.com" className="text-terracotta hover:underline">
            hakimalirezah@hotmail.com
          </a>
          . We aim to respond within 30 days.
        </p>
        <p className="text-stone leading-relaxed">
          <span className="text-cream">Children: </span>
          This site is not directed at children, and we do not knowingly collect their
          data.
        </p>
      </section>

      <section id="ip" className="scroll-mt-24 mb-12">
        <h2 className="font-display text-2xl sm:text-3xl text-cream mb-4">Intellectual Property</h2>
        <p className="text-stone leading-relaxed mb-4">
          Unless a different source is credited beneath an image — as with several
          images in the Craft Heritage of Kashmir section, reproduced from museum and
          archive collections for educational purposes — all photographs, text,
          research and stories on this site are created by Hakim Ali Reza and family
          and are protected by copyright. © 2026 Traam and Beyond. All rights reserved
          as to our original content; third-party images remain the property of their
          respective sources. You may view and share links to this site for personal,
          non-commercial purposes and quote short passages with credit. Any other
          reproduction requires written permission.
        </p>
        <p className="text-stone leading-relaxed">
          Traam and Beyond&trade; is a trademark of Hakim Ali Reza. The trademark
          application has been filed and is currently pending registration.
        </p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="font-display text-2xl sm:text-3xl text-cream mb-4">Contact</h2>
        <p className="text-stone leading-relaxed">
          For questions about this page, your data, or permissions, write to{" "}
          <a href="mailto:hakimalirezah@hotmail.com" className="text-terracotta hover:underline">
            hakimalirezah@hotmail.com
          </a>
          . You can also use our{" "}
          <Link href="/contact" className="text-terracotta hover:underline">
            contact form
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
