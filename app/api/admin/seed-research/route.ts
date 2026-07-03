import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { RESEARCH_SECTIONS } from "@/lib/research-data";

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const created: string[] = [];
  const skipped: string[] = [];

  for (const section of RESEARCH_SECTIONS) {
    for (let i = 0; i < section.items.length; i++) {
      const item = section.items[i];
      // Use sectionSlug+slug as a stable composite key to avoid duplicates
      const existing = await adminDb
        .collection("research_items")
        .where("sectionSlug", "==", section.sectionSlug)
        .where("slug", "==", item.slug)
        .limit(1)
        .get();

      if (!existing.empty) {
        skipped.push(`${section.sectionSlug}/${item.slug}`);
        continue;
      }

      const ref = adminDb.collection("research_items").doc();
      await ref.set({
        slug: item.slug,
        title: item.title,
        description: item.description,
        images: item.images,
        sectionSlug: section.sectionSlug,
        order: i,
        createdAt: Timestamp.now(),
      });
      created.push(`${section.sectionSlug}/${item.slug}`);
    }
  }

  return NextResponse.json({ created, skipped });
}
