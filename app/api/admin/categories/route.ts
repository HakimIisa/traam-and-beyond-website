import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminCreateCategory, adminGetAllCategories } from "@/lib/firebase/admin-categories";
import { categorySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await adminGetAllCategories();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const id = await adminCreateCategory(parsed.data);
  return NextResponse.json({ id });
}
