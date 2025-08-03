"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useAnswerStore } from "~/stores";
import type { Category } from "./client";
import {
  getRandomNumber,
  shuffleAnswers,
  type QuestionBase,
} from "~/lib/shuffle";
// import type { CategoryAgg } from "~/server/api/routers/question_database";

function getStyle(color: string | null | undefined) {
  const colors = color?.split(",");
  if (colors?.length != 2) return {};
  return {
    backgroundColor: colors[0],
    borderColor: colors[1],
  };
}

// TODO: when we add question database page with all licenses, we can add this param back and use getQuestionsWithAllCategories instead of getQuestions
// type QuestionArg = {
//   question: QuestionBase;
//   categories: CategoryAgg[];
// };

export function Question({
  question: q,
  category,
  // showLicense,
}: {
  // question: QuestionArg;
  question: QuestionBase;
  category: Category;
  // showLicense: boolean;
}) {
  // TODO: randomize it based on more than just id
  const question = useMemo(() => shuffleAnswers(q, getRandomNumber(q.id)), [q]);

  const { answerState } = useAnswerStore();
  // `selected` is NOT index of displayed items but index in database (before shuffling)
  const [selected, setSelected] = answerState(question.id);

  return (
    <Card key={question.id} className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          {question.answers.map(([dbIndex, answer], index) => (
            <button
              key={index}
              onClick={() => setSelected(dbIndex === selected ? null : dbIndex)}
              className={`block w-full rounded-lg border p-3 text-left ${
                dbIndex === selected
                  ? selected === 0
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="mr-2 font-medium">
                {String.fromCharCode(65 + index)}.
              </span>
              {answer}
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected(selected === null ? 0 : null)}
          >
            {selected === null
              ? "Pokaż prawidłową odpowiedź"
              : "Odznacz odpowiedź"}
          </Button>
          <div className="flex items-start justify-between gap-2">
            {/* {question.tags?.map((tag) => (
              <Badge key={tag.tag.id}>{tag.tag.name}</Badge>
            ))} */}
            {/* TODO: this works good for multiple licenses page */}
            {/* {q.categories.map((category) => (
              <Badge
                variant="secondary"
                style={getStyle(category.color)}
                key={category.id}
              >
                {(showLicense ? category.license.name + ": " : "") +
                  category.name}
              </Badge>
            ))} */}
            <Badge variant="secondary" style={getStyle(category.color)}>
              {category.name}
            </Badge>
            {question.externalId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground my-[3px] h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{question.externalId}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
