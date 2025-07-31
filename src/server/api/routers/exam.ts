import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { answerEnum, examAttempt, examQuestions } from "~/server/db/exam";
import { questionInstances } from "~/server/db/question";
import { sql, eq, and, count, desc } from "drizzle-orm";
import { categories } from "~/server/db/category";

export const examRouter = createTRPCRouter({
  newExam: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.categoryId));

      if (!category[0]) {
        throw new Error("Category not found");
      }
      const questionCount = category[0].examQuestionCount;

      const startedAt = new Date(Date.now());
      const deadlineTime = new Date(Date.now() + 1000 * category[0].examTime);

      const attempt = await ctx.db
        .insert(examAttempt)
        .values({
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
          startedAt,
          deadlineTime,
        })
        .returning({ id: examAttempt.id });

      const id = attempt[0]?.id;
      if (!id) {
        throw new Error("Failed to insert exam attempt into database");
      }

      const c = {
        examAttemptId: sql.raw(examQuestions.examAttemptId.name),
        questionInstanceId: sql.raw(examQuestions.questionInstanceId.name),
        answer: sql.raw(examQuestions.answer.name),
        categoryId: sql.raw(questionInstances.categoryId.name),
      };

      // TODO: Get number of questions from category
      await ctx.db.execute(sql`
          INSERT INTO ${examQuestions} ("${c.examAttemptId}", "${c.questionInstanceId}", "${c.answer}")
          SELECT
            '${sql.raw(id)}' AS "${c.examAttemptId}",
            ${questionInstances.id} AS "${c.questionInstanceId}",
            NULL AS "${c.answer}"
          FROM ${questionInstances}
          WHERE "${c.categoryId}" = ${input.categoryId}
          ORDER BY random()
          LIMIT ${questionCount}
        `);

      return id;
    }),

  getExamCount: publicProcedure
    .input(
      z.object({
        licenseId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) return null;

      const examCount = await ctx.db
        .select({
          count: count(),
        })
        .from(categories)
        .innerJoin(examAttempt, eq(categories.id, examAttempt.categoryId))
        .where(
          and(
            eq(categories.licenseId, input.licenseId),
            eq(examAttempt.userId, ctx.session.user.id),
          ),
        );

      return examCount[0]?.count ?? null;
    }),

  getExams: publicProcedure
    .input(
      z.object({
        licenseId: z.number(),
        limit: z.number().max(50).optional(),
        offset: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) return null;

      return await ctx.db
        .select({
          attemptId: examAttempt.id,
          categoryName: categories.name,
          examTime: categories.examTime,
          questionCount: categories.examQuestionCount,
          questionsDone: count(examQuestions.answer),
          answersCorrect: sql<number>`SUM(CASE WHEN ${examQuestions.answer} = 'A' THEN 1 ELSE 0 END)`,
          startedAt: examAttempt.startedAt,
          finishedAt: examAttempt.finishedAt,
        })
        .from(categories)
        .innerJoin(examAttempt, eq(categories.id, examAttempt.categoryId))
        .innerJoin(
          examQuestions,
          eq(examAttempt.id, examQuestions.examAttemptId),
        )
        .where(
          and(
            eq(categories.licenseId, input.licenseId),
            eq(examAttempt.userId, ctx.session.user.id),
          ),
        )
        .groupBy(categories.id, examAttempt.id)
        .orderBy(desc(examAttempt.startedAt))
        .limit(input.limit ?? 10)
        .offset(input.offset ?? 0);
    }),

  answerQuestion: protectedProcedure
    .input(
      z.object({
        examAttemptId: z.string(),
        questionInstanceId: z.string(),
        answer: z.enum(answerEnum.enumValues).nullable(),
        finishExam: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.db
        .select({ userId: examAttempt.userId })
        .from(examAttempt)
        .where(eq(examAttempt.id, input.examAttemptId));

      if (attempt[0]?.userId !== ctx.session.user.id) {
        throw new Error("You are not allowed to answer this question");
      }

      const result = await ctx.db
        .update(examQuestions)
        .set({ answer: input.answer })
        .where(
          and(
            eq(examQuestions.examAttemptId, input.examAttemptId),
            eq(examQuestions.questionInstanceId, input.questionInstanceId),
          ),
        )
        .returning();

      if (result.length === 0) throw new Error("Question not found");

      if (input.finishExam) {
        await ctx.db
          .update(examAttempt)
          .set({
            finishedAt: new Date(Date.now()),
          })
          .where(eq(examAttempt.id, input.examAttemptId));
      }
    }),
});
