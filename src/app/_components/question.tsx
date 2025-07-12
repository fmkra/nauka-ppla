"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { randomizeQuestion, type QuestionBase } from "~/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useAnswerStore } from "~/stores";

function getStyle(color: string | null) {
  const colors = color?.split(",");
  if (colors?.length != 2) return {};
  return {
    backgroundColor: colors[0],
    borderColor: colors[1],
  };
}

export function Question({ question: q }: { question: QuestionBase }) {
  const question = useMemo(() => randomizeQuestion(q), [q]);

  const { answers, setAnswer } = useAnswerStore();
  // `selected` is NOT index of displayed items but index in database (before shuffling)
  const selected = answers[question.id] ?? null;
  const setSelected = (index: number | null) => {
    setAnswer(question.id, index);
  };

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
            {question.tags.map((tag) => (
              <Badge key={tag.tag.id}>{tag.tag.name}</Badge>
            ))}
            {question.category && (
              <Badge
                variant="secondary"
                style={getStyle(question.category.color)}
              >
                {question.category.name}
              </Badge>
            )}
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
