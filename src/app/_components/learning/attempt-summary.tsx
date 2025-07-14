import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type AttemptData = Exclude<
  inferRouterOutputs<AppRouter>["learning"]["getAttempt"]["attempt"],
  null
>;

export function LearningAttemptSummary({
  attempt,
  startNextAttempt,
}: {
  attempt: AttemptData;
  startNextAttempt: () => void;
}) {
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
        <Button onClick={startNextAttempt}>Rozpocznij nowe podejście</Button>
      </CardContent>
    </Card>
  );
}
