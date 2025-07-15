import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { ExtendedAttempt } from "~/app/learn/[license]/[category]/category-learning-client";
import { api } from "~/trpc/react";

export function LearningAttemptSummary({
  attempt,
  categoryId,
  nextAttempt,
}: {
  attempt: ExtendedAttempt;
  categoryId: number;
  nextAttempt: () => void;
}) {
  const { mutate } = api.learning.nextAttempt.useMutation({
    onSuccess: () => {
      console.log("calling nextAttempt");
      nextAttempt();
    },
  });

  const startNextAttempt = () => {
    mutate({ categoryId });
  };

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
        <Button onClick={startNextAttempt}>Rozpocznij kolejne podejście</Button>
      </CardContent>
    </Card>
  );
}
