import { db } from "~/server/db";
import ExamPageClient from "./client";
import { licenses } from "~/server/db/license";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ license: string }>;
}) {
  const { license } = await params;
  const licenseList = await db
    .select()
    .from(licenses)
    .where(eq(licenses.url, license))
    .orderBy(asc(licenses.id))
    .limit(1);

  if (!licenseList[0]) {
    notFound();
  }

  return <ExamPageClient licenseId={licenseList[0].id} />;
}

export async function generateStaticParams() {
  const licensesData = await db.select().from(licenses);
  return licensesData.map((license) => ({
    license: license.url,
  }));
}
