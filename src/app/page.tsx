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
import { getIcon } from "~/lib/get-icon";

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
          const icon = getIcon(license.icon);
          return (
            <Card
              key={license.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      {icon}
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
                  <Link href={`/${license.url}`}>Rozpocznij naukę</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
