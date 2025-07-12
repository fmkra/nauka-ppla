import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnswerStore {
  answers: Record<string, number | undefined>;

  // Actions
  answerState: (
    questionId: string,
  ) => [number | null, (answer: number | null) => void];
}

export const useAnswerStore = create<AnswerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      answers: {},

      // Actions
      answerState: (questionId) => {
        const answers = get().answers;
        return [
          answers[questionId] ?? null,
          (answer) => {
            set((state) => ({
              answers: { ...state.answers, [questionId]: answer ?? undefined },
            }));
          },
        ];
      },
    }),
    {
      name: "answer-store",
    },
  ),
);
