import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["nauka-ppla_*"],
} satisfies Config;
