import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetAboutContent, adminUpdateAboutSection } from "@/lib/firebase/admin-about-content";
import { DEFAULT_ABOUT_CONTENT, type AboutContent } from "@/types/about-content";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stored = await adminGetAboutContent();
  if (!stored) return NextResponse.json(DEFAULT_ABOUT_CONTENT);

  const content: AboutContent = {
    intro: { ...DEFAULT_ABOUT_CONTENT.intro, ...stored.intro },
    crafts: {
      ...DEFAULT_ABOUT_CONTENT.crafts,
      ...stored.crafts,
      copper: { ...DEFAULT_ABOUT_CONTENT.crafts.copper, ...stored.crafts?.copper },
      silver: { ...DEFAULT_ABOUT_CONTENT.crafts.silver, ...stored.crafts?.silver },
      jade: { ...DEFAULT_ABOUT_CONTENT.crafts.jade, ...stored.crafts?.jade },
      papierMache: { ...DEFAULT_ABOUT_CONTENT.crafts.papierMache, ...stored.crafts?.papierMache },
    },
    enquiry: { ...DEFAULT_ABOUT_CONTENT.enquiry, ...stored.enquiry },
  };

  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { section, data } = body as { section: keyof AboutContent; data: AboutContent[keyof AboutContent] };

  const validSections: Array<keyof AboutContent> = ["intro", "crafts", "enquiry"];
  if (!validSections.includes(section))
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  await adminUpdateAboutSection(section, data as AboutContent[typeof section]);
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
