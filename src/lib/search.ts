import Fuse from "fuse.js";
import type { SearchEntry } from "@/types";

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
  const fuse = createSearchIndex(entries);
  const results = fuse.search(query);
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
