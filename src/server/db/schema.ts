import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `nauka-ppla_${name}`);

export const questions = createTable("question", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  externalId: d.varchar({ length: 255 }),
  question: d.text().notNull(),
  answerCorrect: d.text().notNull(),
  answerIncorrect1: d.text().notNull(),
  answerIncorrect2: d.text().notNull(),
  answerIncorrect3: d.text().notNull(),
  category: d.integer().references(() => categories.id),
  createdBy: d.varchar({ length: 255 }).references(() => users.id),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
}));

export const learningProgress = createTable(
  "learning_progress",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    questionId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => questions.id),
    latestAttempt: d.integer().notNull(),
    random: d.doublePrecision().notNull(),
    isDone: d.boolean().notNull(),
    correctCount: d.integer().notNull(),
    incorrectCount: d.integer().notNull(),
  }),
  (table) => [primaryKey({ columns: [table.userId, table.questionId] })],
);

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

export const questionsRelations = relations(questions, ({ many, one }) => ({
  tags: many(questionsToTags),
  category: one(categories, {
    fields: [questions.category],
    references: [categories.id],
  }),
}));

export const learningProgressRelations = relations(
  learningProgress,
  ({ one }) => ({
    question: one(questions, {
      fields: [learningProgress.questionId],
      references: [questions.id],
    }),
  }),
);

export const categories = createTable("category", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
  url: d.varchar({ length: 255 }).notNull().unique(),
  color: d.varchar({ length: 15 }),
  description: d.text(),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  questions: many(questions),
}));

export const tags = createTable("tag", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  questions: many(questionsToTags),
}));

export const questionsToTags = createTable("questions_to_tags", (d) => ({
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

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
