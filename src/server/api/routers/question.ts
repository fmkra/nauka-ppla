import { z } from "zod";
import { ilike, or, count, sql, and, inArray } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { questions } from "~/server/db/schema";

export const questionRouter = createTRPCRouter({
  getQuestions: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().max(100).optional(),
        offset: z.number().optional(),
        randomOrder: z.boolean().default(false),
        categoryIds: z.array(z.number()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(questions.externalId, `%${input.search}%`),
            ilike(questions.question, `%${input.search}%`),
            ilike(questions.answerCorrect, `%${input.search}%`),
            ilike(questions.answerIncorrect1, `%${input.search}%`),
            ilike(questions.answerIncorrect2, `%${input.search}%`),
            ilike(questions.answerIncorrect3, `%${input.search}%`),
          ),
        );
      }

      if (input.categoryIds && input.categoryIds.length > 0) {
        conditions.push(inArray(questions.category, input.categoryIds));
      }

      return await ctx.db.query.questions.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          tags: {
            with: {
              tag: true,
            },
          },
          category: true,
        },
        orderBy: input.randomOrder
          ? sql`RANDOM()`
          : (questions, { asc }) => [asc(questions.externalId)],
        limit: input.limit ?? 20,
        offset: input.offset ?? 0,
      });
    }),

  getQuestionsCount: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        categoryIds: z.array(z.number()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(questions.externalId, `%${input.search}%`),
            ilike(questions.question, `%${input.search}%`),
            ilike(questions.answerCorrect, `%${input.search}%`),
            ilike(questions.answerIncorrect1, `%${input.search}%`),
            ilike(questions.answerIncorrect2, `%${input.search}%`),
            ilike(questions.answerIncorrect3, `%${input.search}%`),
          ),
        );
      }

      if (input.categoryIds && input.categoryIds.length > 0) {
        conditions.push(inArray(questions.category, input.categoryIds));
      }

      const result = await ctx.db
        .select({ count: count() })
        .from(questions)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return result[0]?.count ?? 0;
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.id)],
    });
  }),
});
