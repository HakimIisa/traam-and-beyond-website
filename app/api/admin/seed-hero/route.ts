import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminUpdateHomeSection } from "@/lib/firebase/admin-site-content";

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await adminUpdateHomeSection("hero", {
    tagline: "Kashmiri Handcrafted Antiques",
    headline: "Timeless Kashmiri Treasures Curated by Hakim Ali Reza",
    subtext:
      "Discover a curated collection of authentic Kashmiri craftsmanship — each piece a story of heritage, skill, and artistry.",
    ctaLabel: "Explore Collection",
  });

  revalidatePath("/");
  return NextResponse.json({ ok: true, updated: "hero" });
}
