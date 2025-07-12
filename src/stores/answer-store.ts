import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnswerStore {
  answers: Record<string, number | undefined>;

  // Actions
  setAnswer: (questionId: string, answer: number | null) => void;
}

export const useAnswerStore = create<AnswerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      answers: {},

      // Actions
      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer ?? undefined },
        })),
    }),
    {
      name: "answer-store",
    },
  ),
);
