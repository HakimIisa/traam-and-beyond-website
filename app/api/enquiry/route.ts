import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations";
import { createEnquiry } from "@/lib/firebase/enquiries";
import { sendEnquiryNotification } from "@/lib/email";

// In-memory rate limit: max 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // In dev without Firebase configured, just log and return success
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log("[DEV] Enquiry received (Firebase not configured):", data);
      return NextResponse.json({ success: true });
    }

    await createEnquiry(data);
    await sendEnquiryNotification(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
