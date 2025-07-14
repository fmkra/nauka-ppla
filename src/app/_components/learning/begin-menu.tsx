"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { BookOpen, Play } from "lucide-react";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

export function LearningBeginMenu({
  categoryId,
  onLoaded,
  onLoadingBegin,
}: {
  categoryId: number;
  onLoaded: () => void;
  onLoadingBegin: () => void;
}) {
  const { mutate } = api.learning.resetLearningProgress.useMutation({
    onSuccess: () => {
      onLoaded();
    },
  });

  const [isRandom, setIsRandom] = useState(false);

  const handleBeginLearning = () => {
    onLoadingBegin();
    mutate({ categoryId, isRandom });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Nie rozpocząłeś jeszcze nauki
        </CardTitle>
        <CardDescription className="mt-2 text-base text-gray-600">
          W trybie nauki możesz przejrzeć wszystkie pytania i odpowiadać na nie.
          Następnie błędne odpowiedzi zostaną wyświetlone w kolejnej próbie i
          tak dopóki nie odpowiesz poprawnie na wszystkie pytania.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Checkbox
            id="isRandom"
            checked={isRandom}
            onCheckedChange={() => setIsRandom(!isRandom)}
          />
          <Label htmlFor="isRandom">Losowa kolejność pytań</Label>
        </div>
        <Button
          onClick={handleBeginLearning}
          size="lg"
          className="bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        >
          <Play className="mr-2 h-5 w-5" />
          Rozpocznij podejście
        </Button>
      </CardContent>
    </Card>
  );
}
