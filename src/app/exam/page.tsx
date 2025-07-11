import { parseQuestions } from "~/utils";
import { db } from "~/server/db";
import ExamClientPage from "./client";
import { sql } from "drizzle-orm";

export default async function ExamPage() {
  const questions = parseQuestions(
    await db.query.questions.findMany({
      orderBy: sql`RANDOM()`,
      limit: 10,
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
        category: true,
      },
    }),
  );

  return <ExamClientPage questions={questions} />;
}
