"use client";

import { notFound, useParams } from "next/navigation";
import { getRandomNumber, shuffleAnswers } from "~/lib/shuffle";
import { api } from "~/trpc/react";
import Exam from "./exam";
import ExamSummary from "./summary";
import { Spinner } from "~/components/ui/spinner";

export default function ExamAttempt() {
  const { exam_id } = useParams<{ exam_id: string }>();

  const { data } = api.exam.getExam.useQuery({
    examAttemptId: exam_id,
  });

  if (data === null) notFound();

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const [exam, questions] = data;

  const questionsParsed = questions.map((examQuestion) => ({
    ...shuffleAnswers(
      examQuestion.questionInstance.question,
      getRandomNumber(`${exam.id}_${examQuestion.questionInstanceId}`),
    ),
    answer: examQuestion.answer,
    questionInstanceId: examQuestion.questionInstance.id,
  }));

  if (exam.finishedAt === null)
    return (
      <Exam
        examAttemptId={exam.id}
        questions={questionsParsed}
        finishTime={exam.deadlineTime.getTime()}
      />
    );

  return (
    <ExamSummary
      attemptId={exam.id}
      questions={questionsParsed}
      categoryId={exam.categoryId}
    />
  );
}
