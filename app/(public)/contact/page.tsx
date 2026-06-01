import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Traam and Beyond. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-stone-light text-lg mt-24 mb-12">
        Have a question or want to know more? We&apos;d love to hear from you.
      </p>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <EnquiryForm type="general" />
        </div>

        {/* Contact details */}
        <div className="flex flex-col gap-6">
          <div className="mt-auto p-5 bg-cream-dark rounded-sm">
            <p className="text-sm text-stone leading-relaxed">
              We typically respond within 24–48 hours. For item-specific
              enquiries, please use the{" "}
              <span className="text-cream font-medium">Enquire</span> button on
              the item page to automatically include item details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
