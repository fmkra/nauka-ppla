import { db } from "~/server/db";
import { licenses } from "~/server/db/license";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ExamList from "./exam_list";
import ExamStart from "./exam_start";

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

  return (
    <div>
      <ExamStart licenseId={license.id} />
      <ExamList licenseId={license.id} />
    </div>
  );
}

export function generateStaticParams() {
  return db.select({ license: licenses.url }).from(licenses);
}
