"use client";

import { LearningBeginMenu } from "~/app/_components/learning/begin-menu";
import { api } from "~/trpc/react";
import { Spinner } from "~/components/ui/spinner";
import { LearningQuestions } from "~/app/_components/learning/learning-questions";
import { useEffect, useState } from "react";
import { LearningAttemptSummary } from "~/app/_components/learning/attempt-summary";
import { LearningFinished } from "~/app/_components/learning/learning-finished";

interface CategoryLearningClientProps {
  category: {
    id: number;
    name: string;
    url: string;
    description: string | null;
    questionCount: number;
  };
}

export function CategoryLearningClient({
  category,
}: CategoryLearningClientProps) {
  const { data, refetch: refetchAttempt } = api.learning.getAttempt.useQuery({
    categoryId: category.id,
  });

  const utils = api.useUtils();
  const nextQuestion = (isCorrect: boolean) => {
    utils.learning.getAttempt.setData({ categoryId: category.id }, (old) => {
      if (!old?.attempt) return old;
      const attempt = {
        ...old.attempt,
        currentQuestion: old.attempt.currentQuestion + 1,
        answeredCorrectly: old.attempt.answeredCorrectly + (isCorrect ? 1 : 0),
        answeredIncorrectly:
          old.attempt.answeredIncorrectly + (isCorrect ? 0 : 1),
        notAnswered: old.attempt.notAnswered - 1,
      };
      // TODO: handle next attempt here instead of refetching attempt
      return {
        isComplete:
          attempt.notAnswered === 0 && attempt.answeredIncorrectly == 0
            ? true
            : old.isComplete,
        attempt,
      };
    });
  };

  // const [state, setState] = useState<{
  //   attempt: number;
  //   questionNumber: number;
  // } | null>(null);

  // useEffect(() => {
  //   setState()
  // }, [data])

  const isAttemptDone = data?.attempt
    ? data.attempt.currentQuestion === data.attempt.totalThisAttempt
    : false;
  const { data: question } = api.learning.getQuestion.useQuery(
    {
      categoryId: category.id,
      attemptNumber: data?.attempt?.currentAttempt ?? 0,
      questionNumber: data?.attempt?.currentQuestion ?? 0,
    },
    {
      enabled: !!data?.attempt && !isAttemptDone,
    },
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [question]);

  if (!data || isLoading) {
    return <Spinner />;
    // TODO: handle error message
  }
  if (data.isComplete) {
    return (
      <LearningFinished
        categoryId={category.id}
        onLoadingBegin={() => setIsLoading(true)}
        onLoaded={refetchAttempt}
      />
    );
  }

  if (isAttemptDone) {
    return (
      <LearningAttemptSummary
        attempt={data.attempt!}
        startNextAttempt={() => {
          void refetchAttempt();
        }}
      />
    );
  }

  if (data.attempt)
    return (
      <LearningQuestions
        attempt={data.attempt}
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
