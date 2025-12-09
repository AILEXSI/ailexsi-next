import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ category: string }> }
) {
  // Params müssen jetzt awaited werden (Next.js 16 Änderung)
  const { category } = await context.params;

  const folderPath = path.join(
    process.cwd(),
    "public",
    "images",
    "gallery",
    category
  );

  try {
    const files = fs.readdirSync(folderPath);

    const allowed =
      /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm|mp3|wav|ogg|pdf)$/i;

    const filtered = files
      .filter((f) => allowed.test(f))
      .map((file) => `/images/gallery/${category}/${file}`);

    return NextResponse.json({ files: filtered });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ files: [] });
  }
}
