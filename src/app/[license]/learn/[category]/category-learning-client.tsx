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
    licenseId: number | null;
  };
}

type AttemptData = inferRouterOutputs<AppRouter>["learning"]["getAttempt"];

export function extendAttempt(attempt: AttemptData | undefined) {
  if (typeof attempt !== "object") return attempt;
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
  "UNAUTHORIZED" | "NO_ATTEMPT" | undefined
>;

export function CategoryLearningClient({
  category,
}: CategoryLearningClientProps) {
  const { data: _attempt, refetch: refetchAttempt } =
    api.learning.getAttempt.useQuery({
      categoryId: category.id,
    });
  const attempt = extendAttempt(_attempt);

  const questionsPageSize = 10;
  const questionsFetchWhenCloserThan = 3;
  const questionsMaxFetchedPages = 2;
  const { data, fetchNextPage, isFetchingNextPage } =
    api.learning.getQuestions.useInfiniteQuery(
      {
        categoryId: category.id,
        attemptNumber: typeof attempt === "object" ? attempt.currentAttempt : 0,
        limit: questionsPageSize,
      },
      {
        enabled: typeof attempt === "object" && attempt.notAnswered > 0,
        initialCursor: typeof attempt === "object" ? attempt.questionNumber : 0,
        maxPages: questionsMaxFetchedPages,
        getNextPageParam: (_a, _b, lastPageParam) =>
          lastPageParam ?? 0 + questionsPageSize,
        select: (data) => {
          let lastQuestionNumber = 0;
          const pages = data.pages.flat();
          const output = {} as Record<number, (typeof pages)[number]>;
          for (const page of pages) {
            output[page.questionNumber] = page;
            if (page.questionNumber > lastQuestionNumber) {
              lastQuestionNumber = page.questionNumber;
            }
          }
          return { questions: output, lastQuestionNumber };
        },
      },
    );

  const utils = api.useUtils();

  const nextQuestion = (isCorrect: boolean) => {
    if (
      data &&
      typeof attempt === "object" &&
      attempt.questionNumber + questionsFetchWhenCloserThan >=
        data.lastQuestionNumber &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
    utils.learning.getAttempt.setData({ categoryId: category.id }, (old) => {
      if (typeof old !== "object") return old;
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
      if (typeof old !== "object" || old.notAnswered !== 0) return old;
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

  const question =
    typeof attempt === "object"
      ? data?.questions[attempt.questionNumber]
      : undefined;

  const onLearningReset = async () => {
    await utils.learning.getQuestions.reset();
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

  if (typeof attempt === "object" && attempt.notAnswered === 0) {
    if (attempt.answeredIncorrectly === 0)
      return (
        <LearningFinished
          licenseId={category.licenseId}
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

  if (attempt === "UNAUTHORIZED")
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Zaloguj się aby kontynuować</h1>
      </div>
    );

  if (attempt === "NO_ATTEMPT")
    return (
      <LearningBeginMenu
        licenseId={category.licenseId}
        categoryId={category.id}
        onLoadingBegin={() => setIsLoading(true)}
        onLoaded={refetchAttempt}
      />
    );

  return (
    <LearningQuestions
      licenseId={category.licenseId}
      attempt={attempt}
      question={question}
      answerQuestion={nextQuestion}
    />
  );
}
