import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

// TODO: Different results based on URL
export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh_-_6rem_-_1px)] items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-4 text-6xl font-bold text-gray-300">404</div>

          <h1 className="mb-3 text-2xl font-semibold text-gray-800">
            Strona nie została znaleziona
          </h1>

          <p className="mb-8 leading-relaxed text-gray-600">
            Przepraszamy, ale strona której szukasz nie istnieje lub została
            przeniesiona. Sprawdź czy adres URL jest poprawny lub wróć do strony
            głównej.
          </p>

          <Link href="/">
            <Button className="w-full">Wróć do strony głównej</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
