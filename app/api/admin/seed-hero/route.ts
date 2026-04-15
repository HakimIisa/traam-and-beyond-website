import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminUpdateHomeSection } from "@/lib/firebase/admin-site-content";

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await adminUpdateHomeSection("hero", {
    tagline: "Silenced crafts, Speaking again",
    headline: "Timeless Kashmiri Treasures Curated by Hakim Ali Reza",
    subtext: "",
    ctaLabel: "Explore Collection",
  });

  revalidatePath("/");
  return NextResponse.json({ ok: true, updated: "hero" });
}
