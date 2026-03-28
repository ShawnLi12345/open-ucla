import { describe, it, expect } from "vitest";
import { search } from "../search";
import { buildSearchIndex } from "../content";

describe("search", () => {
  const entries = buildSearchIndex();

  it("returns results for an exact course number", () => {
    const results = search("31", entries);
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results for a department alias", () => {
    const results = search("CS", entries);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.departmentCode === "COM SCI")).toBe(true);
  });

  it("returns results for a professor name", () => {
    const results = search("Smallberg", entries);
    expect(results.length).toBeGreaterThan(0);
  });

  it("deduplicates results by path", () => {
    const results = search("31", entries);
    const paths = results.map((r) => r.path);
    const uniquePaths = new Set(paths);
    expect(paths.length).toBe(uniquePaths.size);
  });

  it("returns empty array for nonsense query", () => {
    const results = search("xyzzyplugh12345", entries);
    expect(results).toEqual([]);
  });

  it("always uses fresh index (no stale cache)", () => {
    // Call search twice with different entries to verify no stale cache
    const results1 = search("CS", entries);
    const results2 = search("CS", entries);
    expect(results1.length).toBe(results2.length);

    // Search with empty entries should return nothing
    const results3 = search("CS", []);
    expect(results3).toEqual([]);
  });
});
