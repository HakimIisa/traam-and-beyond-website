import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetHomeContent, adminUpdateHomeSection } from "@/lib/firebase/admin-site-content";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/types/home-content";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stored = await adminGetHomeContent();
  if (!stored) return NextResponse.json(DEFAULT_HOME_CONTENT);

  // Merge with defaults so missing fields are always present
  const content: HomeContent = {
    hero: { ...DEFAULT_HOME_CONTENT.hero, ...stored.hero },
    intro: { ...DEFAULT_HOME_CONTENT.intro, ...stored.intro },
    collections: { ...DEFAULT_HOME_CONTENT.collections, ...stored.collections },
    enquiry: { ...DEFAULT_HOME_CONTENT.enquiry, ...stored.enquiry },
  };

  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { section, data } = body as { section: keyof HomeContent; data: HomeContent[keyof HomeContent] };

  const validSections: Array<keyof HomeContent> = ["hero", "intro", "collections", "enquiry"];
  if (!validSections.includes(section))
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  await adminUpdateHomeSection(section, data as HomeContent[typeof section]);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
