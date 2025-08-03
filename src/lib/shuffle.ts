import XXH from "xxhashjs";

export function getRandomNumber(input: string): number {
  return XXH.h32(input, 0).toNumber();
}

export function generatePermutation(n: number, randomness: number): number[] {
  const elements: number[] = Array.from({ length: n }, (_, i) => i);
  const permutation: number[] = [];

  for (let i = n; i > 0; i--) {
    const index = randomness % i;
    permutation.push(elements[index]!);
    elements.splice(index, 1);
    randomness = Math.floor(randomness / i);
  }

  return permutation;
}

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

export function shuffleAnswers<T extends QuestionBase>(
  question: T,
  randomness: number,
): T & QuestionParsed {
  const permutation = generatePermutation(4, randomness);
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
