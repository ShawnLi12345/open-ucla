import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.resolve(process.cwd(), "content");

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".md": "text/markdown",
  ".txt": "text/plain",
};

function sanitizeFilename(name: string): string {
  return name.replace(/["\\\r\n]/g, "_");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;

  // Validate each segment individually
  const isSafe = segments.every(
    (s) =>
      s &&
      !s.includes("\0") &&
      !s.includes("/") &&
      !s.includes("\\") &&
      s !== "." &&
      s !== ".."
  );
  if (!isSafe) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const filePath = path.resolve(CONTENT_DIR, ...segments);

  // Ensure resolved path is strictly under CONTENT_DIR
  if (!filePath.startsWith(CONTENT_DIR + path.sep)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "File not found", message: "This material has not been uploaded yet." },
      { status: 404 }
    );
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const fileBuffer = fs.readFileSync(filePath);
  const filename = sanitizeFilename(path.basename(filePath));

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
