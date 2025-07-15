import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import { createTable } from "./creator";
import { users } from "./user";
import { questionInstances } from "./question";
import { categories } from "./category";

// Represents progress of learning a given question by the user
export const learningProgress = createTable(
  "learning_progress",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    questionInstanceId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => questionInstances.id),
    latestAttempt: d.integer().notNull(),
    random: d.doublePrecision().notNull(),
    isDone: d.boolean().notNull(),
    correctCount: d.integer().notNull(),
    incorrectCount: d.integer().notNull(),
  }),
  (table) => [
    primaryKey({ columns: [table.userId, table.questionInstanceId] }),
  ],
);

export const learningProgressRelations = relations(
  learningProgress,
  ({ one }) => ({
    questionInstance: one(questionInstances, {
      fields: [learningProgress.questionInstanceId],
      references: [questionInstances.id],
    }),
  }),
);

// Represents progress of learning a given category by the user.
// For now it is only useful to get which attempt the user is currently on.
// Rest of the data is stored in the learningProgress table.
export const learningCategory = createTable(
  "learning_category",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    categoryId: d
      .integer()
      .notNull()
      .references(() => categories.id),
    latestAttempt: d.integer().notNull(),
  }),
  (table) => [primaryKey({ columns: [table.userId, table.categoryId] })],
);
