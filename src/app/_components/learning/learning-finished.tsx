import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function LearningFinished({
  categoryId,
  onResetBegin: onLoadingBegin,
  onResetFinished: onLoaded,
}: {
  categoryId: number;
  onResetBegin: () => void;
  onResetFinished: () => void;
}) {
  const { mutate } = api.learning.resetLearningProgress.useMutation({
    onSuccess: () => {
      onLoaded();
    },
  });

  const startNewAttempt = () => {
    mutate({ categoryId });
    onLoadingBegin();
  };

  // TODO: review questions

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle>You have finished learning this category.</CardTitle>
        <CardDescription>
          <Button onClick={startNewAttempt}>Start new attempt</Button>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
