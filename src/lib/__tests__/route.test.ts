import { describe, it, expect } from "vitest";
import path from "path";

// Test the path validation logic extracted from the route handler.
// We can't easily call the Next.js route handler directly in unit tests,
// so we test the validation logic that would reject malicious segments.

const CONTENT_DIR = path.resolve(process.cwd(), "content");

function isSegmentSafe(segments: string[]): boolean {
  return segments.every(
    (s) =>
      s &&
      !s.includes("\0") &&
      !s.includes("/") &&
      !s.includes("\\") &&
      s !== "." &&
      s !== ".."
  );
}

function isPathUnderContentDir(segments: string[]): boolean {
  const filePath = path.resolve(CONTENT_DIR, ...segments);
  return filePath.startsWith(CONTENT_DIR + path.sep);
}

describe("content route path validation", () => {
  describe("segment validation", () => {
    it("rejects segments containing '..'", () => {
      expect(isSegmentSafe(["..", "..", "etc", "passwd"])).toBe(false);
    });

    it("rejects segments containing '.'", () => {
      expect(isSegmentSafe([".", "com-sci"])).toBe(false);
    });

    it("rejects empty segments", () => {
      expect(isSegmentSafe(["", "com-sci"])).toBe(false);
    });

    it("rejects segments with null bytes", () => {
      expect(isSegmentSafe(["com-sci\0", "31"])).toBe(false);
    });

    it("rejects segments with forward slashes", () => {
      expect(isSegmentSafe(["foo/bar"])).toBe(false);
    });

    it("rejects segments with backslashes", () => {
      expect(isSegmentSafe(["foo\\bar"])).toBe(false);
    });

    it("accepts valid segments", () => {
      expect(isSegmentSafe(["com-sci", "31", "materials", "file.pdf"])).toBe(true);
    });
  });

  describe("resolved path check", () => {
    it("allows paths under content dir", () => {
      expect(isPathUnderContentDir(["com-sci", "31", "course.json"])).toBe(true);
    });

    it("rejects paths that escape content dir via resolve", () => {
      // Even if segments somehow bypass the first check, resolve catches it
      expect(isPathUnderContentDir(["..", "package.json"])).toBe(false);
    });

    it("rejects paths to content dir itself (no trailing sep match)", () => {
      // A single segment that resolves to exactly CONTENT_DIR should not match
      // because startsWith(CONTENT_DIR + path.sep) requires going deeper
      expect(isPathUnderContentDir([])).toBe(false);
    });
  });

  describe("filename sanitization", () => {
    function sanitizeFilename(name: string): string {
      return name.replace(/["\\\r\n]/g, "_");
    }

    it("strips double quotes", () => {
      expect(sanitizeFilename('file"name.pdf')).toBe("file_name.pdf");
    });

    it("strips backslashes", () => {
      expect(sanitizeFilename("file\\name.pdf")).toBe("file_name.pdf");
    });

    it("strips carriage returns and newlines", () => {
      expect(sanitizeFilename("file\r\nname.pdf")).toBe("file__name.pdf");
    });

    it("leaves normal filenames unchanged", () => {
      expect(sanitizeFilename("winter-2026-syllabus.pdf")).toBe("winter-2026-syllabus.pdf");
    });
  });
});
