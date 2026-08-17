import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminGetAllStories, adminCreateStory } from "@/lib/firebase/admin-stories";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await adminGetAllStories();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = await adminCreateStory(body);
  return NextResponse.json({ id });
}
