import Fuse from "fuse.js";
import type { SearchEntry } from "@/types";

let fuseInstance: Fuse<SearchEntry> | null = null;

function createSearchIndex(entries: SearchEntry[]): Fuse<SearchEntry> {
  return new Fuse(entries, {
    keys: [
      { name: "courseName", weight: 2 },
      { name: "courseNumber", weight: 3 },
      { name: "departmentName", weight: 1.5 },
      { name: "departmentCode", weight: 2 },
      { name: "aliases", weight: 2 },
      { name: "professor", weight: 1.5 },
      { name: "materialTitle", weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}

export function search(query: string, entries: SearchEntry[]): SearchEntry[] {
  if (!fuseInstance) {
    fuseInstance = createSearchIndex(entries);
  }
  // Normalize queries like "cs31" → "cs 31" so Fuse can match dept alias and course number separately
  const normalizedQuery = query.replace(/([a-zA-Z])(\d)/g, "$1 $2")
  const results = fuseInstance!.search(normalizedQuery);

  // Deduplicate by path
  const seen = new Set<string>();
  return results
    .map((r) => r.item)
    .filter((item) => {
      if (seen.has(item.path)) return false;
      seen.add(item.path);
      return true;
    });
}
