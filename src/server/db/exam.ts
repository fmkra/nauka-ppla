import { pgEnum } from "drizzle-orm/pg-core";
import { categories } from "./category";
import { createTable } from "./creator";
import { users } from "./user";
import { questionInstances } from "./question";
import { relations } from "drizzle-orm";

export const answerEnum = pgEnum("answer", ["A", "B", "C", "D"]);

export const examAttempt = createTable("exam_attempt", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  categoryId: d
    .integer()
    .notNull()
    .references(() => categories.id),
  startedAt: d.timestamp().notNull().defaultNow(),
  deadlineTime: d.timestamp().notNull(),
  finishedAt: d.timestamp(),
}));

export const examQuestions = createTable("exam_questions", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  examAttemptId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => examAttempt.id),
  questionInstanceId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => questionInstances.id),
  answer: answerEnum(),
}));

export const examQuestionsRelations = relations(examQuestions, ({ one }) => ({
  questionInstance: one(questionInstances, {
    fields: [examQuestions.questionInstanceId],
    references: [questionInstances.id],
  }),
}));
