"use client";

import { LearningBeginMenu } from "~/app/_components/learning/begin-menu";
import { api } from "~/trpc/react";
import { Spinner } from "~/components/ui/spinner";
import { LearningQuestions } from "~/app/_components/learning/learning-questions";
import { useEffect, useState } from "react";
import { LearningAttemptSummary } from "~/app/_components/learning/attempt-summary";
import { LearningFinished } from "~/app/_components/learning/learning-finished";
import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

interface CategoryLearningClientProps {
  category: {
    id: number;
    name: string;
    url: string;
    description: string | null;
    questionCount: number;
  };
}

type AttemptData = inferRouterOutputs<AppRouter>["learning"]["getAttempt"];

export function extendAttempt(attempt: AttemptData | undefined | null) {
  if (!attempt) return attempt;
  return {
    ...attempt,
    questionNumber: attempt.answeredCorrectly + attempt.answeredIncorrectly,
    attemptQuestionCount:
      attempt.answeredCorrectly +
      attempt.answeredIncorrectly +
      attempt.notAnswered,
  };
}

export type ExtendedAttempt = Exclude<
  ReturnType<typeof extendAttempt>,
  null | undefined
>;

export function CategoryLearningClient({
  category,
}: CategoryLearningClientProps) {
  const { data: _attempt, refetch: refetchAttempt } =
    api.learning.getAttempt.useQuery({
      categoryId: category.id,
    });
  const attempt = extendAttempt(_attempt);

  const utils = api.useUtils();

  const nextQuestion = (isCorrect: boolean) => {
    utils.learning.getAttempt.setData({ categoryId: category.id }, (old) => {
      if (!old) return old;
      return {
        ...old,
        answeredCorrectly: old.answeredCorrectly + (isCorrect ? 1 : 0),
        answeredIncorrectly: old.answeredIncorrectly + (isCorrect ? 0 : 1),
        notAnswered: old.notAnswered - 1,
      };
    });
  };

  const nextAttempt = () => {
    utils.learning.getAttempt.setData({ categoryId: category.id }, (old) => {
      // Next attempt can only be started if there are questions left to answer
      console.log("old", old);
      if (!old || old.notAnswered !== 0) return old;
      return {
        ...old,
        currentAttempt: old.currentAttempt + 1,
        answeredCorrectly: 0,
        answeredIncorrectly: 0,
        previouslyAnswered: old.previouslyAnswered + old.answeredCorrectly,
        notAnswered: old.answeredIncorrectly,
        questionNumber: 0,
        attemptQuestionCount: old.answeredIncorrectly,
      };
    });
  };

  const { data: question } = api.learning.getQuestion.useQuery(
    {
      categoryId: category.id,
      attemptNumber: attempt?.currentAttempt ?? 0,
      questionNumber: attempt?.questionNumber ?? 0,
    },
    {
      enabled: !!attempt && attempt.notAnswered > 0,
    },
  );

  const onLearningReset = async () => {
    await utils.learning.getQuestion.reset();
    await utils.learning.getAttempt.reset();
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [question]);

  if (attempt === undefined || isLoading) {
    return <Spinner />;
    // TODO: handle error message
  }

  if (!!attempt && attempt.notAnswered === 0) {
    if (attempt.answeredIncorrectly === 0)
      return (
        <LearningFinished
          categoryId={category.id}
          onResetBegin={() => setIsLoading(true)}
          onResetFinished={onLearningReset}
        />
      );
    else
      return (
        <LearningAttemptSummary
          attempt={attempt}
          categoryId={category.id}
          nextAttempt={nextAttempt}
        />
      );
  }

  if (attempt)
    return (
      <LearningQuestions
        attempt={attempt}
        question={question}
        answerQuestion={nextQuestion}
      />
    );

  return (
    <LearningBeginMenu
      categoryId={category.id}
      onLoadingBegin={() => setIsLoading(true)}
      onLoaded={refetchAttempt}
    />
  );
}
