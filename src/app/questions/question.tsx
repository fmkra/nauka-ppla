"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { QuestionParsed } from "./page";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export function Question({ question }: { question: QuestionParsed }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Card key={question.id} className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => setSelected(index === selected ? null : index)}
              className={`block w-full rounded-lg border p-3 text-left ${
                index === selected
                  ? selected === question.correctAnswer
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
            onClick={() =>
              setSelected(selected === null ? question.correctAnswer : null)
            }
          >
            {selected === null
              ? "Pokaż prawidłową odpowiedź"
              : "Odznacz odpowiedź"}
          </Button>
          <div className="flex items-start justify-between gap-2">
            {question.category && (
              <Badge variant="secondary">{question.category.name}</Badge>
            )}
            {question.tags.map((tag) => (
              <Badge key={tag.tag.id}>{tag.tag.name}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
