import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const helvetica = localFont({
  src: [
    { path: "../fonts/helvetica-255/Helvetica.ttf", weight: "400", style: "normal" },
    { path: "../fonts/helvetica-255/Helvetica-Oblique.ttf", weight: "400", style: "italic" },
    { path: "../fonts/helvetica-255/Helvetica-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/helvetica-255/Helvetica-BoldOblique.ttf", weight: "700", style: "italic" },
    { path: "../fonts/helvetica-255/helvetica-light-587ebe5a59211.ttf", weight: "300", style: "normal" },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Traam and Beyond — Kashmiri Handcrafted Items",
    template: "%s | Traam and Beyond",
  },
  description:
    "Discover a curated collection of authentic Kashmiri handcrafted items — copper, silver, jade, papier-mâché, terracotta jewellery, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={helvetica.variable}>
      <body>{children}</body>
    </html>
  );
}
