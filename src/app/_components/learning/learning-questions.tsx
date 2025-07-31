import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { LearningProgressBar } from "./progress-bar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type {
  AnswerQuestionInput,
  ExtendedAttempt,
} from "~/app/[license]/learn/[category]/category-learning-client";
import { cn, randomizeQuestion } from "~/lib/utils";
import { useMemo, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";

type Question =
  inferRouterOutputs<AppRouter>["learning"]["getQuestions"][number];

export function LearningQuestions({
  attempt,
  question,
  isAnswerQuestionPending,
  answerQuestion,
}: {
  attempt: ExtendedAttempt;
  question: Question | undefined;
  isAnswerQuestionPending: boolean;
  answerQuestion: (data: AnswerQuestionInput) => void;
}) {
  const parsedQuestion = useMemo(() => {
    // TODO: randomness based on data from db (random and latestAttempt)
    if (!question) return null;
    return randomizeQuestion(question.question);
  }, [question]);

  const [selected, setSelected] = useState<number | null>(null);

  const next = () => {
    if (!parsedQuestion || !question) return;
    answerQuestion({
      questionInstanceId: question.question_instance.id,
      attemptNumber: attempt.currentAttempt,
      isCorrect: selected === 0,
    });
    setSelected(null);
  };

  return (
    <div className="w-full max-w-4xl">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle>
            Pytanie {attempt.questionNumber + 1} z{" "}
            {attempt.attemptQuestionCount}
          </CardTitle>
          <LearningProgressBar attempt={attempt} />
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-2">
            {parsedQuestion ? (
              <>
                <p className="mb-4">
                  {!!parsedQuestion?.externalId && (
                    <span>{parsedQuestion.externalId}: </span>
                  )}
                  {parsedQuestion?.question}
                </p>
                {parsedQuestion.answers.map(([dbIndex, answer], index) => (
                  <button
                    key={index}
                    onClick={() => setSelected(selected ?? dbIndex)}
                    className={cn(
                      `block w-full rounded-lg border p-3 text-left`,
                      dbIndex === 0 && selected !== null
                        ? "border-green-200 bg-green-50 text-green-800"
                        : selected === dbIndex
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-gray-200 bg-gray-50",
                    )}
                  >
                    <span className="mr-2 font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {answer}
                  </button>
                ))}
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-4 w-1/3 rounded-none" />
                <Skeleton className="h-[50px] w-full rounded-lg border text-left" />
                <Skeleton className="h-[50px] w-full rounded-lg border text-left" />
                <Skeleton className="h-[50px] w-full rounded-lg border text-left" />
                <Skeleton className="h-[50px] w-full rounded-lg border text-left" />
              </div>
            )}
          </div>
          <div className="flex w-full justify-end">
            <Button
              disabled={isAnswerQuestionPending || selected === null}
              onClick={next}
              className="w-20"
            >
              {isAnswerQuestionPending && selected !== null ? (
                <Spinner size="sm" />
              ) : (
                "Dalej"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
