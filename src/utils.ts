import arrayShuffle from "array-shuffle";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export interface QuestionBase {
  id: string;
  externalId: string | null;
  question: string;
  answerCorrect: string;
  answerIncorrect1: string;
  answerIncorrect2: string;
  answerIncorrect3: string;
}

export interface QuestionParsed extends QuestionBase {
  id: string;
  answers: [number, string][]; // index in database, answer content
  correctAnswer: number;
}

export function randomizeQuestion<T extends QuestionBase>(
  question: T,
): T & QuestionParsed {
  const permutation = arrayShuffle([0, 1, 2, 3]);
  const answers = [
    question.answerCorrect,
    question.answerIncorrect1,
    question.answerIncorrect2,
    question.answerIncorrect3,
  ];
  const shuffledAnswers = permutation.map(
    (index) => [index, answers[index]!] as [number, string],
  );

  return {
    ...question,
    answers: shuffledAnswers,
    correctAnswer: permutation.indexOf(0),
  };
}

export function conjugate(
  count: number,
  single: string,
  few: string,
  many: string,
) {
  if (count === 1) return single;

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  )
    return few;

  return many;
}

export function formatTime(minutes: number) {
  minutes = Math.ceil(minutes);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`;
  }

  return `${remainingMinutes}min`;
}

export const MINUTES_PER_QUESTION = 1.5;
