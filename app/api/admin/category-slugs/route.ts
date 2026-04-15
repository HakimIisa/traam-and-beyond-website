import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await adminGetAllCategories();
  return NextResponse.json(
    categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
  );
}
