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
  answersIncorrect1: string;
  answersIncorrect2: string;
  answersIncorrect3: string;
  category: { name: string; color: string | null } | null;
  tags: { tag: { id: number; name: string } }[];
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
    question.answersIncorrect1,
    question.answersIncorrect2,
    question.answersIncorrect3,
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
