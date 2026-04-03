import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Traam and Beyond. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl font-semibold text-walnut mb-3">Get in Touch</h1>
      <p className="text-stone text-lg mb-12">
        Whether you have a question about an item, want to learn more about our
        collection, or simply want to connect — we&apos;re here.
      </p>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <EnquiryForm type="general" />
        </div>

        {/* Contact details */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <Mail className="text-terracotta mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium text-walnut text-sm mb-1">Email</p>
              <p className="text-stone text-sm">
                Your enquiry will reach us directly via the form.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-terracotta mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium text-walnut text-sm mb-1">Based in</p>
              <p className="text-stone text-sm">Kashmir, India</p>
            </div>
          </div>

          <div className="mt-4 p-5 bg-cream-dark rounded-sm">
            <p className="text-sm text-stone leading-relaxed">
              We typically respond within 24–48 hours. For item-specific
              enquiries, please use the{" "}
              <span className="text-walnut font-medium">Enquire</span> button on
              the item page to automatically include item details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
