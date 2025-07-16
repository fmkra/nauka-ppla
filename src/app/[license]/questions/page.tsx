import { db } from "~/server/db";
import QuestionsPageClient from "./client";
import { licenses } from "~/server/db/license";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function QuestionsPage({
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Baza pytań</h1>
        <p className="text-muted-foreground">
          Przeglądaj listę pytań i sprawdź czy umiesz na nie odpowiedzieć.
        </p>
      </div>

      <QuestionsPageClient defaultLicenseId={licenseList[0].id} />
    </div>
  );
}

export async function generateStaticParams() {
  const licensesData = await db.select().from(licenses);
  return licensesData.map((license) => ({
    license: license.url,
  }));
}
