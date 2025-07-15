import { z } from "zod";
import { sql, and, eq, gte, asc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { learningProgress as lp, learningCategory } from "~/server/db/learning";
import { questionInstances, questions } from "~/server/db/question";

export const learningRouter = createTRPCRouter({
  resetLearningProgress: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
        isRandom: z.boolean(),
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
          ${ctx.session.user.id} AS \"${sql.raw(lp.userId.name)}\",
          ${questionInstances.id} AS \"${sql.raw(lp.questionInstanceId.name)}\",
          1 AS \"${sql.raw(lp.latestAttempt.name)}\",
          RANDOM() * ${input.isRandom ? 1 : 0} AS \"${sql.raw(lp.random.name)}\",
          false AS \"${sql.raw(lp.isDone.name)}\",
          0 AS \"${sql.raw(lp.correctCount.name)}\",
          0 AS \"${sql.raw(lp.incorrectCount.name)}\"
        FROM ${questionInstances}
        WHERE ${questionInstances.categoryId} = ${input.categoryId}
        ON CONFLICT (\"${sql.raw(lp.userId.name)}\", \"${sql.raw(lp.questionInstanceId.name)}\") DO UPDATE SET
          \"${sql.raw(lp.latestAttempt.name)}\" = 1,
          \"${sql.raw(lp.random.name)}\" = RANDOM() * ${input.isRandom ? 1 : 0},
          \"${sql.raw(lp.isDone.name)}\" = false
      `);

      await ctx.db.execute(sql`
        INSERT INTO ${learningCategory}
        (\"${sql.raw(learningCategory.userId.name)}\", \"${sql.raw(learningCategory.categoryId.name)}\", \"${sql.raw(learningCategory.latestAttempt.name)}\")
        VALUES (${ctx.session.user.id}, ${input.categoryId}, 1)
        ON CONFLICT (\"${sql.raw(learningCategory.userId.name)}\", \"${sql.raw(learningCategory.categoryId.name)}\") DO UPDATE SET 
          \"${sql.raw(learningCategory.latestAttempt.name)}\" = 1
      `);
    }),

  deleteLearningProgress: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.execute(sql`
        DELETE ${lp} FROM ${lp}
        INNER JOIN ${questionInstances} ON ${lp.questionInstanceId} = ${questionInstances.id}
        WHERE ${lp.userId} = ${ctx.session.user.id} AND ${questionInstances.categoryId} = ${input.categoryId}
      `);

      await ctx.db.execute(sql`
        DELETE FROM ${learningCategory}
        WHERE \"${sql.raw(learningCategory.userId.name)}\" = ${ctx.session.user.id} AND \"${sql.raw(learningCategory.categoryId.name)}\" = ${input.categoryId}
      `);
    }),

  getAttempt: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attempt = (
        await ctx.db
          .select({
            currentAttempt: learningCategory.latestAttempt,
          })
          .from(learningCategory)
          .where(
            and(
              eq(learningCategory.userId, ctx.session.user.id),
              eq(learningCategory.categoryId, input.categoryId),
            ),
          )
      )[0];

      if (attempt === undefined) {
        return null;
      }
      const { currentAttempt } = attempt;

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
        JOIN ${questionInstances} ON ${lp.questionInstanceId} = ${questionInstances.id}
        WHERE ${lp.userId} = ${ctx.session.user.id} AND ${questionInstances.categoryId} = ${input.categoryId}
      `);

      const previouslyAnswered = Number(q[0]!.previouslyAnswered);
      const answeredCorrectly = Number(q[0]!.answeredCorrectly);
      const answeredIncorrectly = Number(q[0]!.answeredIncorrectly);
      const notAnswered = Number(q[0]!.notAnswered);

      return {
        currentAttempt,
        previouslyAnswered,
        answeredCorrectly,
        answeredIncorrectly,
        notAnswered,
      };
    }),

  nextAttempt: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(learningCategory)
        .set({
          latestAttempt: sql`${learningCategory.latestAttempt} + 1`,
        })
        .where(
          and(
            eq(learningCategory.userId, ctx.session.user.id),
            eq(learningCategory.categoryId, input.categoryId),
          ),
        );
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
        .innerJoin(
          questionInstances,
          eq(lp.questionInstanceId, questionInstances.id),
        )
        .innerJoin(questions, eq(questionInstances.questionId, questions.id))
        .where(
          and(
            eq(lp.userId, ctx.session.user.id),
            eq(questionInstances.categoryId, input.categoryId),
            gte(lp.latestAttempt, input.attemptNumber),
          ),
        )
        .orderBy(asc(lp.random), asc(questions.externalId), asc(questions.id))
        .limit(1)
        .offset(input.questionNumber);

      return q[0];
    }),

  answerQuestion: protectedProcedure
    .input(
      z.object({
        questionInstanceId: z.string(),
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
            eq(lp.questionInstanceId, input.questionInstanceId),
          ),
        );
    }),
});
