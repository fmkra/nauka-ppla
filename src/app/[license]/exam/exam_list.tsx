"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import usePagination from "~/app/_components/pagination";

const PASS_THRESHOLD = 0.75;

function getStatus(
  finishedAt: Date | null,
  correctCount: number,
  totalCount: number,
) {
  if (finishedAt === null) {
    return {
      text: "W trakcie",
      variant: "secondary" as const,
      icon: <Clock className="h-4 w-4" />,
    };
  }

  if (correctCount >= PASS_THRESHOLD * totalCount) {
    return {
      text: "Zaliczony",
      variant: "green" as const,
      icon: <CheckCircle className="h-4 w-4" />,
    };
  }

  return {
    text: "Niezaliczony",
    variant: "destructive" as const,
    icon: <Clock className="h-4 w-4" />,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

const pageSizeOptions = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
];

export default function ExamList({ licenseId }: { licenseId: number }) {
  const { data: totalCount } = api.exam.getExamCount.useQuery({ licenseId });

  const pagination = usePagination(
    pageSizeOptions,
    "10",
    totalCount ?? undefined,
    true,
  );

  const { data: exams } = api.exam.getExams.useQuery({
    licenseId,
    limit: pagination.limit,
    offset: pagination.offset,
  });

  if (totalCount === null || exams === null) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Twoje egzaminy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground py-8 text-center">
              Nie masz jeszcze żadnych egzaminów. Rozpocznij swój pierwszy
              egzamin!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Twoje egzaminy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">
                    Data rozpoczęcia
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Przedmiot</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Postęp / Wynik
                  </th>
                  <th className="w-24 px-4 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {exams?.map((exam) => {
                  const status = getStatus(
                    exam.finishedAt,
                    exam.answersCorrect,
                    exam.questionCount,
                  );

                  const questionsDone =
                    exam.finishedAt === null
                      ? exam.questionsDone
                      : exam.answersCorrect;

                  const progressPercentage = Math.round(
                    (questionsDone / exam.questionCount) * 100,
                  );

                  return (
                    <tr
                      key={exam.attemptId}
                      className="hover:bg-muted/50 border-b"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">
                          {formatDate(exam.startedAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {exam.categoryName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={status.variant}
                          className="flex items-center gap-1"
                        >
                          {status.icon}
                          {status.text}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            {questionsDone}/{exam.questionCount}
                          </div>
                          <div className="bg-muted h-2 w-16 rounded-full">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {progressPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" className="w-full">
                          <Link href={`./exam/${exam.attemptId}`}>
                            {exam.finishedAt === null ? "Kontynuuj" : "Zobacz"}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex items-center">
            <div className="mx-auto">{pagination.footer}</div>
            <p className="mr-2 text-sm">Ilość na stronę: </p>
            <div className="w-20">{pagination.pageSizeSelector}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
