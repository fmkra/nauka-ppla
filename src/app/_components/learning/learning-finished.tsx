import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
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

  const [isRandom, setIsRandom] = useState(false);

  const startNewAttempt = () => {
    mutate({ categoryId, isRandom });
    onLoadingBegin();
  };

  // TODO: review questions

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle>Zakończyłeś naukę tego przedmiotu</CardTitle>
        <CardDescription>
          <div className="my-4 flex items-center justify-center gap-2">
            <Checkbox
              id="isRandom"
              checked={isRandom}
              onCheckedChange={() => setIsRandom(!isRandom)}
            />
            <Label htmlFor="isRandom">Losowa kolejność pytań</Label>
          </div>
          <Button onClick={startNewAttempt}>
            Zresetuj postęp i zacznij od nowa
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
