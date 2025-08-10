import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

export type ExamAttempt = Exclude<
  inferRouterOutputs<AppRouter>["exam"]["getExam"],
  null
>[0];

export type FinishedExamAttempt = ExamAttempt & {
  finishedAt: Exclude<ExamAttempt["finishedAt"], null>;
};
