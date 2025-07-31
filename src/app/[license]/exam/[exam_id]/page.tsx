import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { examAttempt, examQuestions } from "~/server/db/exam";
import ExamPageClient from "./client";
import { randomizeQuestion } from "~/lib/utils";

export default async function ExamAttempt({
  params,
}: {
  params: Promise<{ exam_id: string }>;
}) {
  const { exam_id } = await params;
  const session = await auth();

  if (!session) {
    // TODO: consider redirecting
    notFound();
  }

  const [exam, questions] = await Promise.all([
    db.query.examAttempt.findFirst({
      where: and(
        eq(examAttempt.id, exam_id),
        eq(examAttempt.userId, session.user.id),
      ),
    }),
    db.query.examQuestions.findMany({
      with: {
        questionInstance: {
          with: {
            question: true,
          },
        },
      },
      where: eq(examQuestions.examAttemptId, exam_id),
      orderBy: asc(examQuestions.id),
    }),
  ]);

  if (!exam) {
    notFound();
  }

  const questionsParsed = questions.map((examQuestion) => ({
    ...randomizeQuestion(examQuestion.questionInstance.question),
    answer: examQuestion.answer,
    questionInstanceId: examQuestion.questionInstance.id,
  }));

  return (
    <div>
      {/* <p>{exam.categoryId}</p> */}
      {/* <pre>{JSON.stringify(questions, null, 2)}</pre> */}
      <ExamPageClient
        questions={questionsParsed}
        finishTime={exam.deadlineTime.getTime()}
        isFinished={exam.finishedAt !== null}
        examAttemptId={exam.id}
        categoryId={exam.categoryId}
      />
    </div>
  );
}
