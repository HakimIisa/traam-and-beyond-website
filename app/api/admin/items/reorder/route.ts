import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminReorderItems } from "@/lib/firebase/admin-items";
import { z } from "zod";

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.number() })).min(1),
});

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await adminReorderItems(parsed.data.items);
  return NextResponse.json({ success: true });
}
