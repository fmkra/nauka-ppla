import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Filter } from "lucide-react";
import { db } from "~/server/db";
import { Question } from "./question";
import { parseQuestions } from "~/utils";

export default async function QuestionBasePage() {
  const questions = parseQuestions(
    await db.query.questions.findMany({
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
        category: true,
      },
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Baza pytań</h1>
        <p className="text-muted-foreground">
          Przeglądaj listę pytań i sprawdź czy umiesz na nie odpowiedzieć.
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input placeholder="Przeglądaj pytania..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtry
        </Button>
      </div>

      <div className="grid gap-6">
        {questions.map((question) => (
          <Question question={question} key={question.id} />
        ))}
      </div>
    </div>
  );
}
