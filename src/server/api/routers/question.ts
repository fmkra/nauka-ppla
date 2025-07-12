import { z } from "zod";
import { ilike, or, count } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { questions } from "~/server/db/schema";
import { parseQuestions } from "~/utils";

export const questionRouter = createTRPCRouter({
  getQuestions: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().max(100).optional(),
        offset: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const questionsData = parseQuestions(
        await ctx.db.query.questions.findMany({
          where: input.search
            ? or(
                ilike(questions.externalId, `%${input.search}%`),
                ilike(questions.question, `%${input.search}%`),
                ilike(questions.answerCorrect, `%${input.search}%`),
                ilike(questions.answersIncorrect1, `%${input.search}%`),
                ilike(questions.answersIncorrect2, `%${input.search}%`),
                ilike(questions.answersIncorrect3, `%${input.search}%`),
              )
            : undefined,
          with: {
            tags: {
              with: {
                tag: true,
              },
            },
            category: true,
          },
          orderBy: (questions, { asc }) => [asc(questions.externalId)],
          limit: input.limit ?? 20,
          offset: input.offset ?? 0,
        }),
      );

      return questionsData;
    }),

  getQuestionsCount: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.search
        ? or(
            ilike(questions.externalId, `%${input.search}%`),
            ilike(questions.question, `%${input.search}%`),
            ilike(questions.answerCorrect, `%${input.search}%`),
            ilike(questions.answersIncorrect1, `%${input.search}%`),
            ilike(questions.answersIncorrect2, `%${input.search}%`),
            ilike(questions.answersIncorrect3, `%${input.search}%`),
          )
        : undefined;

      const result = await ctx.db
        .select({ count: count() })
        .from(questions)
        .where(whereClause);

      return result[0]?.count ?? 0;
    }),
});
