import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { categories, questions } from "~/server/db/schema";
import { count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import * as icons from "lucide-react";
import Link from "next/link";
import { CategoryLearningClient } from "./category-learning-client";
import { formatTime, MINUTES_PER_QUESTION } from "~/utils";

export default async function LearnCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryUrl } = await params;

  const category = (
    await db
      .select({
        id: categories.id,
        name: categories.name,
        url: categories.url,
        description: categories.description,
        questionCount: count(questions.id),
      })
      .from(categories)
      .leftJoin(questions, eq(categories.id, questions.category))
      .where(eq(categories.url, categoryUrl))
      .groupBy(categories.id)
      .limit(1)
  )[0];

  if (!category) {
    notFound();
  }

  const [description, icon, ...topics] =
    category.description?.split("\n") ?? [];
  if (!icon) return null;
  const Icon = icons[icon as keyof typeof icons] as React.ElementType;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/learn">
              <icons.ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do kategorii
            </Link>
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 flex items-center text-3xl font-bold">
              <Icon className="mr-2 h-6 w-6" />
              {category.name}
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
            <div className="text-2xl font-bold">{category.questionCount}</div>
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
              {formatTime(category.questionCount * MINUTES_PER_QUESTION)}
            </div>
            <p className="text-muted-foreground text-xs">
              ~{MINUTES_PER_QUESTION} min na pytanie
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex min-h-[400px] items-center justify-center">
        <CategoryLearningClient category={category} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const cats = await db.select().from(categories);
  return cats.map((category) => ({
    category: category.url,
  }));
}
