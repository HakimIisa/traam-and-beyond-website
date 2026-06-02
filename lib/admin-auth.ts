import { adminAuth } from "@/lib/firebase/admin";
import { NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.OWNER_EMAIL;

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return false;
    const decoded = await adminAuth.verifyIdToken(token);
    if (ADMIN_EMAIL && decoded.email !== ADMIN_EMAIL) return false;
    return true;
  } catch {
    return false;
  }
}
