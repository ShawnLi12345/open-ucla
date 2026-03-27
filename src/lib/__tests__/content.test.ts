import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import {
  getDepartments,
  getDepartment,
  getCourses,
  getCourse,
  getMaterials,
  getStats,
  buildSearchIndex,
} from "../content";

// Tests run against the real content/ directory in the repo.
// This ensures tests break if content structure drifts.

describe("getDepartments", () => {
  it("returns an array of departments", () => {
    const depts = getDepartments();
    expect(Array.isArray(depts)).toBe(true);
    expect(depts.length).toBeGreaterThan(0);
  });

  it("each department has required fields", () => {
    const depts = getDepartments();
    for (const dept of depts) {
      expect(dept).toHaveProperty("name");
      expect(dept).toHaveProperty("code");
      expect(dept).toHaveProperty("slug");
    }
  });

  it("departments have optional aliases field as array", () => {
    const depts = getDepartments();
    for (const dept of depts) {
      if (dept.aliases !== undefined) {
        expect(Array.isArray(dept.aliases)).toBe(true);
      }
    }
  });
});

describe("getDepartment", () => {
  it("returns a department by slug", () => {
    const dept = getDepartment("com-sci");
    expect(dept).not.toBeNull();
    expect(dept!.code).toBe("COM SCI");
  });

  it("returns null for unknown slug", () => {
    const dept = getDepartment("nonexistent-dept");
    expect(dept).toBeNull();
  });
});

describe("getCourses", () => {
  it("returns courses for a valid department", () => {
    const courses = getCourses("com-sci");
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
  });

  it("each course has required fields and materialCount", () => {
    const courses = getCourses("com-sci");
    for (const course of courses) {
      expect(course).toHaveProperty("name");
      expect(course).toHaveProperty("number");
      expect(typeof course.materialCount).toBe("number");
    }
  });

  it("returns empty array for nonexistent department", () => {
    const courses = getCourses("nonexistent");
    expect(courses).toEqual([]);
  });
});

describe("getCourse", () => {
  it("returns a course by slug and number", () => {
    const course = getCourse("com-sci", "31");
    expect(course).not.toBeNull();
    expect(course!.name).toBe("Introduction to Computer Science I");
  });

  it("returns null for nonexistent course", () => {
    const course = getCourse("com-sci", "999");
    expect(course).toBeNull();
  });
});

describe("getMaterials", () => {
  it("returns materials for a valid course", () => {
    const materials = getMaterials("com-sci", "31");
    expect(Array.isArray(materials)).toBe(true);
    expect(materials.length).toBeGreaterThan(0);
  });

  it("each material has required fields", () => {
    const materials = getMaterials("com-sci", "31");
    for (const mat of materials) {
      expect(mat).toHaveProperty("title");
      expect(mat).toHaveProperty("type");
      expect(mat).toHaveProperty("file");
      expect(mat).toHaveProperty("contributor");
      expect(mat).toHaveProperty("uploadedAt");
    }
  });

  it("materials are sorted by date descending", () => {
    const materials = getMaterials("com-sci", "31");
    if (materials.length > 1) {
      for (let i = 0; i < materials.length - 1; i++) {
        const a = new Date(materials[i].uploadedAt).getTime();
        const b = new Date(materials[i + 1].uploadedAt).getTime();
        expect(a).toBeGreaterThanOrEqual(b);
      }
    }
  });

  it("returns empty array for nonexistent course", () => {
    const materials = getMaterials("com-sci", "999");
    expect(materials).toEqual([]);
  });
});

describe("getStats", () => {
  it("returns course, material, and contributor counts", () => {
    const stats = getStats();
    expect(typeof stats.courses).toBe("number");
    expect(typeof stats.materials).toBe("number");
    expect(typeof stats.contributors).toBe("number");
    expect(stats.courses).toBeGreaterThan(0);
    expect(stats.materials).toBeGreaterThan(0);
  });
});

describe("buildSearchIndex", () => {
  it("returns a non-empty array of search entries", () => {
    const entries = buildSearchIndex();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    const entries = buildSearchIndex();
    for (const entry of entries) {
      expect(entry).toHaveProperty("courseName");
      expect(entry).toHaveProperty("courseNumber");
      expect(entry).toHaveProperty("departmentSlug");
      expect(entry).toHaveProperty("path");
    }
  });

  it("includes aliases from departments.json", () => {
    const entries = buildSearchIndex();
    const csEntry = entries.find((e) => e.departmentCode === "COM SCI");
    expect(csEntry).toBeDefined();
    expect(csEntry!.aliases).toContain("CS");
  });

  it("includes material-level entries", () => {
    const entries = buildSearchIndex();
    const materialEntry = entries.find((e) => e.materialTitle);
    expect(materialEntry).toBeDefined();
  });
});
