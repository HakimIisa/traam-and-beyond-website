import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations";
import { createEnquiry } from "@/lib/firebase/enquiries";
import { sendEnquiryNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
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
