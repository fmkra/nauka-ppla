import { createTable } from "./creator";

export const licenses = createTable("license", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
  url: d.varchar({ length: 255 }).notNull().unique(),
  description: d.text(),
}));
