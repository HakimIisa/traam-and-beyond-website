import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default async function AboutPage() {
  return <AboutPageClient />;
}
