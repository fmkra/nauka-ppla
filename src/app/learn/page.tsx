import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import Link from "next/link";

export default async function LearnPage() {
  const licenses = await db.query.licenses.findMany({
    orderBy: (license, { asc }) => [asc(license.id)],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Wybierz swój typ licencji</h1>
        <p className="text-muted-foreground">
          Kompleksowe materiały do przygotowania się do egzaminu teoretycznego
          na licencję pilota prywatnego samolotu.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {licenses.map((license) => {
          return (
            <Card
              key={license.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      {/* <Icon className="text-primary h-5 w-5" /> */}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{license.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex h-full flex-col">
                <CardDescription className="mb-4 text-sm">
                  {license.description}
                </CardDescription>

                <Button className="mt-auto w-full" asChild>
                  <Link href={`/learn/${license.url}`}>Rozpocznij naukę</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 mt-12 rounded-lg p-6">
        <h2 className="mb-4 text-xl font-semibold">Informacje o egzaminie</h2>
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
