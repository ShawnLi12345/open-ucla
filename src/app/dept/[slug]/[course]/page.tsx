import Link from "next/link";
import { notFound } from "next/navigation";
import { getDepartment, getDepartments, getCourse, getCourses, getMaterials } from "@/lib/content";
import MaterialCard from "@/components/MaterialCard";

export function generateStaticParams() {
  const departments = getDepartments();
  const params: { slug: string; course: string }[] = [];
  for (const dept of departments) {
    const courses = getCourses(dept.slug);
    for (const course of courses) {
      params.push({ slug: dept.slug, course: course.number });
    }
  }
  return params;
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string; course: string }>;
}) {
  const { slug, course: courseNumber } = await params;
  const department = getDepartment(slug);
  if (!department) notFound();

  const course = getCourse(slug, courseNumber);
  if (!course) notFound();

  const materials = getMaterials(slug, courseNumber);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="mb-3 text-xs text-gray-500">
        <Link href="/" className="text-[#2774AE] hover:underline">Home</Link>
        {" → "}
        <Link href={`/dept/${slug}`} className="text-[#2774AE] hover:underline">{department.name}</Link>
        {" → "}
        {department.code} {course.number}
      </p>

      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        {department.code} {course.number} — {course.name}
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        {department.name} Dept · {materials.length} materials
      </p>

      {materials.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-500">No materials yet for this course — be the first to contribute!</p>
          <Link
            href={`/contribute?course=${encodeURIComponent(courseNumber)}&dept=${encodeURIComponent(slug)}`}
            className="mt-4 inline-block rounded-lg bg-[#2774AE] px-4 py-2 text-sm font-semibold text-white"
          >
            + Upload Material
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {materials.map((material) => (
            <MaterialCard
              key={material.file}
              material={material}
              departmentSlug={slug}
              courseNumber={courseNumber}
            />
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg border-2 border-dashed border-[#2774AE] bg-blue-50 p-6 text-center">
        <p className="mb-3 text-sm text-gray-600">
          Have materials for {department.code} {course.number}? Help your fellow Bruins!
        </p>
        <Link
          href={`/contribute?course=${encodeURIComponent(courseNumber)}&dept=${encodeURIComponent(slug)}`}
          className="inline-block rounded-lg bg-[#2774AE] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1e5f8f]"
        >
          + Upload Material
        </Link>
      </div>
    </div>
  );
}
