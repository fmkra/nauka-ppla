import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import * as icons from "lucide-react";
import { db } from "~/server/db";
import { questionInstances } from "~/server/db/question";
import { licenses } from "~/server/db/license";
import { categories } from "~/server/db/category";
import { count, eq } from "drizzle-orm";
import { conjugate, formatTime, MINUTES_PER_QUESTION } from "~/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIcon } from "../page";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ license: string }>;
}) {
  const { license: licenseUrl } = await params;
  const licenseData = (
    await db.select().from(licenses).where(eq(licenses.url, licenseUrl))
  )[0];

  if (!licenseData) {
    notFound();
  }

  const cardsWithCounts = await db
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
    .where(eq(categories.licenseId, licenseData.id))
    .groupBy(categories.id)
    .orderBy(categories.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/learn">
              <icons.ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do licencji
            </Link>
          </Button>
        </div>
        <h1 className="mb-4 text-3xl font-bold">
          Materiały do nauki {licenseData.name}
        </h1>
        <p className="text-muted-foreground">
          Kompleksowe materiały do przygotowania się do egzaminu teoretycznego
          na licencję pilota prywatnego samolotu (PPL-A).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardsWithCounts.map((card) => {
          const [description, icon, ...topics] =
            card.description?.split("\n") ?? [];
          const duration = formatTime(
            card.questionCount * MINUTES_PER_QUESTION,
          );

          return (
            <Card key={card.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      {getIcon(icon)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex h-full flex-col">
                <CardDescription className="mb-4 text-sm">
                  {description}
                </CardDescription>

                <div className="text-muted-foreground mb-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <icons.Clock className="h-4 w-4" />
                    {duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <icons.BookOpen className="h-4 w-4" />
                    {card.questionCount}{" "}
                    {conjugate(
                      card.questionCount,
                      "pytanie",
                      "pytania",
                      "pytań",
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium">Tematy:</h4>
                  <div className="flex flex-wrap gap-1">
                    {topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="mt-auto w-full" asChild>
                  <Link href={`/learn/${licenseUrl}/${card.url}`}>
                    Rozpocznij naukę
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 mt-12 rounded-lg p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Informacje o egzaminie PPL(A)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">Wymagania egzaminacyjne:</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Minimum 75% poprawnych odpowiedzi w każdym przedmiocie</li>
              <li>• Egzamin trwa 3 godziny</li>
              <li>• łącznie 425 pytań testowych</li>
              <li>• Wymagane zaliczenie wszystkich 9 przedmiotów</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Struktura egzaminu:</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Każdy przedmiot to osobny moduł</li>
              <li>• Pytania wielokrotnego wyboru</li>
              <li>• Możliwość powrotu do pytań</li>
              <li>• Wynik dostępny natychmiast</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const licensesData = await db.select().from(licenses);
  return licensesData.map((license) => ({
    license: license.url,
  }));
}
