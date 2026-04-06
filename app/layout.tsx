import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant, Raleway } from "next/font/google";
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

const cormorantGarant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-raleway",
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
    <html lang="en" className={`${helvetica.variable} ${cormorantGarant.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
