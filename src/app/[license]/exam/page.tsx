import { db } from "~/server/db";
import { licenses } from "~/server/db/license";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ExamList from "./exam_list";
import ExamStart from "./exam_start";
import { categories } from "~/server/db/category";

export default async function ExamsPage({
  params,
}: {
  params: Promise<{ license: string }>;
}) {
  const { license: licenseUrl } = await params;

  const license = (
    await db
      .select({ id: licenses.id })
      .from(licenses)
      .where(eq(licenses.url, licenseUrl))
      .limit(1)
  )[0];

  if (!license) {
    notFound();
  }

  const categoriesData = await db
    .select({
      id: categories.id,
      name: categories.name,
      color: categories.color,
    })
    .from(categories)
    .where(eq(categories.licenseId, license.id));

  return (
    <>
      <ExamStart licenseId={license.id} />
      <ExamList licenseId={license.id} categories={categoriesData} />
    </>
  );
}

export function generateStaticParams() {
  return db.select({ license: licenses.url }).from(licenses);
}
