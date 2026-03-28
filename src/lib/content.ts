import fs from "fs";
import path from "path";
import type { Department, Course, Material, SearchEntry } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getDepartments(): Department[] {
  const filePath = path.join(CONTENT_DIR, "departments.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getDepartment(slug: string): Department | null {
  const departments = getDepartments();
  return departments.find((d) => d.slug === slug) ?? null;
}

export function getCourses(departmentSlug: string): (Course & { materialCount: number })[] {
  const deptDir = path.join(CONTENT_DIR, departmentSlug);
  if (!fs.existsSync(deptDir)) return [];

  const entries = fs.readdirSync(deptDir, { withFileTypes: true });
  const courses: (Course & { materialCount: number })[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const courseJsonPath = path.join(deptDir, entry.name, "course.json");
    if (!fs.existsSync(courseJsonPath)) continue;

    const course: Course = JSON.parse(fs.readFileSync(courseJsonPath, "utf-8"));
    const materialsDir = path.join(deptDir, entry.name, "materials");
    let materialCount = 0;

    if (fs.existsSync(materialsDir)) {
      materialCount = fs.readdirSync(materialsDir).filter((f) => f.endsWith(".json")).length;
    }

    courses.push({ ...course, materialCount });
  }

  return courses.sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
}

export function getCourse(departmentSlug: string, courseNumber: string): Course | null {
  const courseJsonPath = path.join(CONTENT_DIR, departmentSlug, courseNumber, "course.json");
  if (!fs.existsSync(courseJsonPath)) return null;
  return JSON.parse(fs.readFileSync(courseJsonPath, "utf-8"));
}

export function getMaterials(departmentSlug: string, courseNumber: string): Material[] {
  const materialsDir = path.join(CONTENT_DIR, departmentSlug, courseNumber, "materials");
  if (!fs.existsSync(materialsDir)) return [];

  const files = fs.readdirSync(materialsDir).filter((f) => f.endsWith(".json"));
  const materials: Material[] = [];

  for (const file of files) {
    const material: Material = JSON.parse(
      fs.readFileSync(path.join(materialsDir, file), "utf-8")
    );
    materials.push(material);
  }

  return materials.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function getStats(): { courses: number; materials: number; contributors: number } {
  const departments = getDepartments();
  let courseCount = 0;
  let materialCount = 0;
  const contributors = new Set<string>();

  for (const dept of departments) {
    const courses = getCourses(dept.slug);
    courseCount += courses.length;

    for (const course of courses) {
      const materials = getMaterials(dept.slug, course.number);
      materialCount += materials.length;
      for (const mat of materials) {
        contributors.add(mat.contributor);
      }
    }
  }

  return { courses: courseCount, materials: materialCount, contributors: contributors.size };
}

function getDepartmentAliases(dept: Department): string {
  return (dept.aliases || []).join(" ");
}

export function buildSearchIndex(): SearchEntry[] {
  const departments = getDepartments();
  const entries: SearchEntry[] = [];

  for (const dept of departments) {
    const courses = getCourses(dept.slug);
    const aliases = getDepartmentAliases(dept);

    for (const course of courses) {
      // Add a course-level entry
      entries.push({
        courseName: course.name,
        courseNumber: course.number,
        departmentName: dept.name,
        departmentCode: dept.code,
        departmentSlug: dept.slug,
        aliases,
        path: `/dept/${dept.slug}/${course.number}`,
      });

      // Add material-level entries
      const materials = getMaterials(dept.slug, course.number);
      for (const mat of materials) {
        entries.push({
          courseName: course.name,
          courseNumber: course.number,
          departmentName: dept.name,
          departmentCode: dept.code,
          departmentSlug: dept.slug,
          aliases,
          professor: mat.professor,
          quarter: mat.quarter,
          materialTitle: mat.title,
          materialType: mat.type,
          path: `/dept/${dept.slug}/${course.number}`,
        });
      }
    }
  }

  return entries;
}
