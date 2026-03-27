export type MaterialType =
  | "syllabus"
  | "notes"
  | "study-guide"
  | "past-exam"
  | "project-spec"
  | "other";

export interface Material {
  title: string;
  type: MaterialType;
  quarter: string;
  professor: string;
  contributor: string;
  file: string;
  uploadedAt: string;
}

export interface Course {
  name: string;
  number: string;
  department: string;
  departmentCode: string;
  description?: string;
}

export interface Department {
  name: string;
  code: string;
  slug: string;
  aliases?: string[];
}

export interface SearchEntry {
  courseName: string;
  courseNumber: string;
  departmentName: string;
  departmentCode: string;
  departmentSlug: string;
  aliases?: string;
  professor?: string;
  quarter?: string;
  materialTitle?: string;
  materialType?: MaterialType;
  path: string;
}
