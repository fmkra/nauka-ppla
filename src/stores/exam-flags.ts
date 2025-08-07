import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExamFlagsStore {
  flags: Record<string, Record<string, boolean>>;

  attempt: (examAttemptId: string) => {
    flags: Record<string, boolean>;
    setFlag: (flag: string, value: boolean) => void;
  };
}

export const useExamFlagsStore = create<ExamFlagsStore>()(
  persist(
    (set, get) => ({
      flags: {},

      attempt: (examAttemptId) => {
        return {
          flags: get().flags[examAttemptId] ?? {},

          setFlag: (flag, value) => {
            set((state) => ({
              flags: {
                ...state.flags,
                [examAttemptId]: {
                  ...(state.flags[examAttemptId] ?? {}),
                  [flag]: value,
                },
              },
            }));
          },
        };
      },
    }),
    {
      name: "exam-flags-store",
    },
  ),
);
