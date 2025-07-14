"use client";

import * as React from "react";
import { cn } from "~/lib/utils";

interface LearningProgressBarProps {
  attempt: {
    previouslyAnswered: number;
    answeredCorrectly: number;
    answeredIncorrectly: number;
    notAnswered: number;
  };
  className?: string;
  height?: string;
}

export function LearningProgressBar({
  attempt,
  className,
  height = "h-3",
}: LearningProgressBarProps) {
  const total =
    attempt.previouslyAnswered +
    attempt.answeredCorrectly +
    attempt.answeredIncorrectly +
    attempt.notAnswered;

  if (total === 0) {
    return (
      <div
        className={cn("w-full rounded-full bg-gray-200", height, className)}
      />
    );
  }

  const previouslyAnsweredPercent = (attempt.previouslyAnswered / total) * 100;
  const answeredCorrectlyPercent = (attempt.answeredCorrectly / total) * 100;
  const answeredIncorrectlyPercent =
    (attempt.answeredIncorrectly / total) * 100;
  const notAnsweredPercent = (attempt.notAnswered / total) * 100;

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-full",
        height,
        className,
      )}
    >
      {attempt.previouslyAnswered > 0 && (
        <div
          className="bg-green-800"
          style={{ width: `${previouslyAnsweredPercent}%` }}
          title={`Previously answered: ${attempt.previouslyAnswered}`}
        />
      )}

      {attempt.answeredCorrectly > 0 && (
        <div
          className="bg-green-400"
          style={{ width: `${answeredCorrectlyPercent}%` }}
          title={`Answered correctly: ${attempt.answeredCorrectly}`}
        />
      )}

      {attempt.answeredIncorrectly > 0 && (
        <div
          className="bg-red-500"
          style={{ width: `${answeredIncorrectlyPercent}%` }}
          title={`Answered incorrectly: ${attempt.answeredIncorrectly}`}
        />
      )}

      {attempt.notAnswered > 0 && (
        <div
          className="bg-gray-200"
          style={{ width: `${notAnsweredPercent}%` }}
          title={`Not answered: ${attempt.notAnswered}`}
        />
      )}
    </div>
  );
}
