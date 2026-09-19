import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetAllFeaturedItems, adminCreateFeaturedItem } from "@/lib/firebase/admin-featured";

const createSchema = z.object({
  imageUrl: z.string().min(1),
  order: z.number(),
  panel: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
});

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await adminGetAllFeaturedItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const id = await adminCreateFeaturedItem(parsed.data);
  return NextResponse.json({ id });
}
