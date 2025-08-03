import { createTable } from "./_creator";

export const explanations = createTable("explanation", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  explanation: d.text().notNull(),
}));
