import { z } from "zod";
import { ilike, or, count, sql, and, inArray, eq, gte, asc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { learningProgress as lp, questions } from "~/server/db/schema";

export const learningRouter = createTRPCRouter({
  resetLearningCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // For each question in the category and user that sends the request,
      // create a record that records answers for the question.
      // Set latestAttempt to 1, random to a random number, isDone to false.
      // Keep correctCount and incorrectCount at previous value if they exist,
      // otherwise set to 0.

      await ctx.db.execute(sql`
        INSERT INTO ${lp}
        SELECT
          ${ctx.session.user.id} AS ${sql.raw(lp.userId.name)},
          ${questions.id} AS ${sql.raw(lp.questionId.name)},
          1 AS ${sql.raw(lp.latestAttempt.name)},
          RANDOM() AS ${sql.raw(lp.random.name)},
          false AS ${sql.raw(lp.isDone.name)},
          0 AS ${sql.raw(lp.correctCount.name)},
          0 AS ${sql.raw(lp.incorrectCount.name)}
        FROM ${questions}
        WHERE ${questions.category} = ${input.categoryId}
        ON CONFLICT (\"${sql.raw(lp.userId.name)}\", \"${sql.raw(lp.questionId.name)}\") DO UPDATE SET
          \"${sql.raw(lp.latestAttempt.name)}\" = 1,
          \"${sql.raw(lp.random.name)}\" = RANDOM(),
          \"${sql.raw(lp.isDone.name)}\" = false
      `);
    }),

  getAttempt: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Current attempt is the smallest latestAttempt among questions that were not answered in previous attempts.

      const { currentAttempt, questionCount } = (
        await ctx.db
          .select({
            currentAttempt: sql<number>`MIN(\"latestAttempt\") FILTER (WHERE \"isDone\" = false)`,
            questionCount: sql<number>`COUNT(*)`,
          })
          .from(lp)
          .innerJoin(questions, eq(lp.questionId, questions.id))
          .where(
            and(
              eq(lp.userId, ctx.session.user.id),
              eq(questions.category, input.categoryId),
            ),
          )
      )[0]!;

      const isComplete = questionCount > 0;

      if (currentAttempt === null) {
        return { isComplete, attempt: null };
      }

      // Questions that were answered correctly in previous attempts have latestAttempt < attemptNumber.
      // Questions that were answered correctly in this attempt have isDone = true and latestAttempt = attemptNumber.
      // Questions that were answered incorrectly in this attempt have latestAttempt > attemptNumber.
      // Questions that were not answered in this attempt have isDone = false and latestAttempt = attemptNumber.

      const q = await ctx.db.execute(sql`
        SELECT
          COUNT(*) FILTER (WHERE \"latestAttempt\" < ${currentAttempt}) AS "previouslyAnswered",
          COUNT(*) FILTER (WHERE \"latestAttempt\" = ${currentAttempt} AND \"isDone\" = true) AS "answeredCorrectly",
          COUNT(*) FILTER (WHERE \"latestAttempt\" > ${currentAttempt}) AS "answeredIncorrectly",
          COUNT(*) FILTER (WHERE \"latestAttempt\" = ${currentAttempt} AND \"isDone\" = false) AS "notAnswered"
        FROM ${lp}
        JOIN ${questions} ON ${lp.questionId} = ${questions.id}
        WHERE ${lp.userId} = ${ctx.session.user.id} AND ${questions.category} = ${input.categoryId}
      `);

      const previouslyAnswered = Number(q[0]!.previouslyAnswered);
      const answeredCorrectly = Number(q[0]!.answeredCorrectly);
      const answeredIncorrectly = Number(q[0]!.answeredIncorrectly);
      const notAnswered = Number(q[0]!.notAnswered);
      const currentQuestion = answeredCorrectly + answeredIncorrectly;
      const totalThisAttempt = currentQuestion + notAnswered;
      const total = previouslyAnswered + totalThisAttempt;

      return {
        isComplete: false,
        attempt: {
          currentAttempt,
          previouslyAnswered,
          answeredCorrectly,
          answeredIncorrectly,
          notAnswered,
          currentQuestion,
          totalThisAttempt,
          total,
        },
      };
    }),

  getQuestion: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
        attemptNumber: z.number(),
        questionNumber: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // We only consider questions that weren't answered in previous attempts.

      const q = await ctx.db
        .select()
        .from(lp)
        .innerJoin(questions, eq(lp.questionId, questions.id))
        .where(
          and(
            eq(lp.userId, ctx.session.user.id),
            eq(questions.category, input.categoryId),
            gte(lp.latestAttempt, input.attemptNumber),
          ),
        )
        .orderBy(asc(lp.random))
        .limit(1)
        .offset(input.questionNumber);

      return q[0];
    }),

  answerQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        isCorrect: z.boolean(),
        attemptNumber: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(lp)
        .set({
          isDone: input.isCorrect,
          latestAttempt: input.isCorrect ? undefined : input.attemptNumber + 1,
        })
        .where(
          and(
            eq(lp.userId, ctx.session.user.id),
            eq(lp.questionId, input.questionId),
          ),
        );
    }),
});
