import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { categories } from "~/server/db/category";
import { licenses } from "~/server/db/license";
import { questionInstances } from "~/server/db/question";
import { count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import * as icons from "lucide-react";
import Link from "next/link";
import { CategoryLearningClient } from "./category-learning-client";
import { formatTime, MINUTES_PER_QUESTION } from "~/utils";
import { auth } from "~/server/auth";

export default async function LearnCategoryPage({
  params,
}: {
  params: Promise<{ category: string; license: string }>;
}) {
  const { category: categoryUrl, license: licenseUrl } = await params;
  const session = await auth();

  const categoryData = (
    await db
      .select({
        id: categories.id,
        name: categories.name,
        url: categories.url,
        description: categories.description,
        questionCount: count(questionInstances.id),
      })
      .from(categories)
      .leftJoin(
        questionInstances,
        eq(categories.id, questionInstances.categoryId),
      )
      .leftJoin(licenses, eq(categories.licenseId, licenses.id))
      .where(and(eq(categories.url, categoryUrl), eq(licenses.url, licenseUrl)))
      .groupBy(categories.id)
      .limit(1)
  )[0];

  if (!categoryData) {
    notFound();
  }

  const [description, icon, ...topics] =
    categoryData.description?.split("\n") ?? [];
  if (!icon) return null;
  const Icon = icons[icon as keyof typeof icons] as React.ElementType;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/learn/${licenseUrl}`}>
              <icons.ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do przedmiotów
            </Link>
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 flex items-center text-3xl font-bold">
              <Icon className="mr-2 h-6 w-6" />
              {categoryData.name}
            </h1>
            <p className="text-muted-foreground mb-4 max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-sm">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <icons.BookOpen className="h-4 w-4" />
              Wszystkie pytania
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryData.questionCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <icons.Target className="h-4 w-4" />
              Cel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-muted-foreground text-xs">
              Minimum do zaliczenia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <icons.Clock className="h-4 w-4" />
              Szacowany czas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(categoryData.questionCount * MINUTES_PER_QUESTION)}
            </div>
            <p className="text-muted-foreground text-xs">
              ~{MINUTES_PER_QUESTION} min na pytanie
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex min-h-[400px] items-center justify-center">
        {session?.user ? (
          <CategoryLearningClient category={categoryData} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Zaloguj się aby kontynuować</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await db
    .select()
    .from(categories)
    .innerJoin(licenses, eq(categories.licenseId, licenses.id));
  return pages.map((page) => ({
    category: page.category.url,
    license: page.license.url,
  }));
}
