import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetAllResearchItems, adminCreateResearchItem } from "@/lib/firebase/admin-research";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await adminGetAllResearchItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = await adminCreateResearchItem(body);
  return NextResponse.json({ id });
}
