import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { ExtendedAttempt } from "~/app/[license]/learn/[category]/category-learning-client";
import { api } from "~/trpc/react";

export function LearningAttemptSummary({
  attempt,
  categoryId,
  isAnswerQuestionPending,
  nextAttempt,
}: {
  attempt: ExtendedAttempt;
  categoryId: number;
  nextAttempt: () => void;
  // Whether mutation that sends question answers is still in progress.
  // In that case, user shouldn't be able to take any action.
  isAnswerQuestionPending: boolean;
}) {
  const { mutate } = api.learning.nextAttempt.useMutation({
    onSuccess: () => {
      nextAttempt();
    },
  });

  const startNextAttempt = () => {
    mutate({ categoryId });
  };

  // TODO: Button should not only be disabled, but show spinner

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center">Podsumowanie podejścia</CardTitle>
        <CardDescription>
          <ul>
            <li>
              W poprzednich podejściach odpowiedziałeś na{" "}
              {attempt.previouslyAnswered} pytań.
            </li>
            <li>
              W tym podejściu odpowiedziałeś poprawnie na{" "}
              {attempt.answeredCorrectly} nowych pytań.
            </li>
            <li>
              Pozostało ci {attempt.answeredIncorrectly} pytań do odpowiedzi.
            </li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled={isAnswerQuestionPending} onClick={startNextAttempt}>
          Rozpocznij kolejne podejście
        </Button>
      </CardContent>
    </Card>
  );
}
