import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { adminStorage } from "@/lib/firebase/admin";

// Max dimension (longest edge) any uploaded image is resized to before storing.
// Nothing on the site displays images anywhere near full camera/scan resolution,
// so this alone accounts for most of the size reduction.
const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const path = formData.get("path") as string | null;

  if (!file || !path)
    return NextResponse.json({ error: "Missing file or path" }, { status: 400 });

  if (!file.type.startsWith("image/"))
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });

  const originalBuffer = Buffer.from(await file.arrayBuffer());

  let buffer: Buffer;
  try {
    buffer = await sharp(originalBuffer)
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Could not process image" }, { status: 400 });
  }

  // Storage content is always re-encoded to WebP here, so the stored path always
  // ends in .webp regardless of what extension the uploaded file had — the caller
  // never assumes an extension itself, it just uses the URL this route returns.
  const webpPath = path.replace(/\.[^./]+$/, "") + ".webp";

  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(webpPath);

  await fileRef.save(buffer, {
    metadata: { contentType: "image/webp" },
    predefinedAcl: "publicRead",
  });

  const url = `https://storage.googleapis.com/${bucket.name}/${webpPath}`;

  return NextResponse.json({ url });
}
