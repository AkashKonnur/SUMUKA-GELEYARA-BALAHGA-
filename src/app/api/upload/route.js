import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * POST /api/upload
 * Uploads an image file and returns a public URL.
 * Protected — requires admin_session cookie.
 *
 * NOTE ON RENDER FREE TIER:
 * The filesystem is ephemeral, so uploaded files won't persist across restarts.
 * For persistent image storage, use an external CDN/URL-based approach (paste image URLs in the gallery admin).
 * This endpoint is still useful for local development and Render instances with a persistent disk attached.
 */
function isAuthenticated(request) {
  const session = request.cookies.get("admin_session");
  return session?.value === "authenticated";
}

export async function POST(request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, GIF, AVIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Save to public/uploads/
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, Buffer.from(arrayBuffer));

    const publicUrl = `/uploads/${safeName}`;
    return NextResponse.json({ url: publicUrl, filename: safeName });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

// Increase body size limit for this route
export const config = {
  api: {
    bodyParser: false,
  },
};
