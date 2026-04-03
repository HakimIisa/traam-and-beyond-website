import { adminAuth } from "@/lib/firebase/admin";
import { NextRequest } from "next/server";

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return false;
    await adminAuth.verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}
