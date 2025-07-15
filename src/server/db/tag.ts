import { relations } from "drizzle-orm";
import { createTable } from "./creator";
import { questions } from "./question";

export const tags = createTable("tag", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
}));

// TODO: consider if we should tag question or question instance
export const tagsRelations = relations(tags, ({ many }) => ({
  questions: many(questionsToTags),
}));

export const questionsToTags = createTable("question_to_tags", (d) => ({
  questionId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => questions.id),
  tagId: d
    .integer()
    .notNull()
    .references(() => tags.id),
}));

export const questionsToTagsRelations = relations(
  questionsToTags,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionsToTags.questionId],
      references: [questions.id],
    }),
    tag: one(tags, { fields: [questionsToTags.tagId], references: [tags.id] }),
  }),
);
