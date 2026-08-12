import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetAllFeaturedItems, adminCreateFeaturedItem } from "@/lib/firebase/admin-featured";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await adminGetAllFeaturedItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = await adminCreateFeaturedItem(body);
  return NextResponse.json({ id });
}
