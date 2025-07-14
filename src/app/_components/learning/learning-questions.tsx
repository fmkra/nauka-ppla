import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { LearningProgressBar } from "./progress-bar";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type AttemptData = Exclude<
  inferRouterOutputs<AppRouter>["learning"]["getAttempt"]["attempt"],
  null
>;

type Question = inferRouterOutputs<AppRouter>["learning"]["getQuestion"];

export function LearningQuestions({
  attempt,
  question,
  answerQuestion,
}: {
  attempt: AttemptData;
  question: Question;
  answerQuestion: (isCorrect: boolean) => void;
}) {
  const { mutate } = api.learning.answerQuestion.useMutation({
    onSuccess: (_, { isCorrect }) => {
      answerQuestion(isCorrect);
    },
  });

  const answer = (isCorrect: boolean) => {
    if (!question) return;
    mutate({
      questionId: question.question.id,
      attemptNumber: attempt.currentAttempt,
      isCorrect,
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle>
            Pytanie {attempt.currentQuestion + 1} z {attempt.totalThisAttempt}
          </CardTitle>
          <LearningProgressBar attempt={attempt} />
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(question, null, 2)}</pre>
          <Button onClick={() => answer(true)}>Correct</Button>
          <Button onClick={() => answer(false)}>Incorrect</Button>
        </CardContent>
      </Card>
    </div>
  );
}
