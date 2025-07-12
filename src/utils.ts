import arrayShuffle from "array-shuffle";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export interface QuestionBase {
  id: string;
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
  answers: string[];
  correctAnswer: number;
}

export function parseQuestions<T extends QuestionBase>(
  questions: T[],
): (T & QuestionParsed)[] {
  return questions.map((question) => {
    const answers = [
      question.answerCorrect,
      question.answersIncorrect1,
      question.answersIncorrect2,
      question.answersIncorrect3,
    ];
    const permutation = [0, 1, 2, 3];
    arrayShuffle(permutation);
    const shuffledAnswers = permutation.map(
      (index) => answers[index],
    ) as string[];
    return {
      ...question,
      answers: shuffledAnswers,
      correctAnswer: permutation.indexOf(0),
    };
  });
}
