"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Clock, CheckCircle, XCircle, CircleQuestionMark } from "lucide-react";
import { cn, conjugate } from "~/lib/utils";
import { type QuestionParsed } from "~/lib/shuffle";
import { api } from "~/trpc/react";
import { useTimer } from "~/lib/use-timer";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import CategoryStartButton from "../category-start-button";
import Link from "next/link";

function getInitialAnswers(questions: QuestionWithAnswer[]) {
  const mapping = {} as Record<number, number>;
  questions.forEach((question, i) => {
    if (question.answer !== null) {
      mapping[i] = question.answer.charCodeAt(0) - 65;
    }
  });
  return mapping;
}

function getInitialQuestion(questions: QuestionWithAnswer[]) {
  const index = questions.findIndex((question) => question.answer === null);
  if (index === -1) {
    return questions.length - 1;
  }
  return index;
}

export type QuestionWithAnswer = QuestionParsed & {
  answer: "A" | "B" | "C" | "D" | null;
  questionInstanceId: string;
};

export default function ExamPageClient({
  questions,
  finishTime,
  isFinished,
  examAttemptId,
  categoryId,
}: {
  questions: QuestionWithAnswer[];
  finishTime: number;
  isFinished: boolean;
  examAttemptId: string;
  categoryId: number;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    getInitialQuestion(questions),
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | undefined>
  >(() => getInitialAnswers(questions));
  const [sentAnswers, setSentAnswers] = useState<
    Record<number, number | undefined>
  >(() => getInitialAnswers(questions));
  const [showResults, setShowResults] = useState(isFinished);
  const timeLeft = useTimer(finishTime);
  const [warningMessage, setWarningMessage] = useState<number | null>(null);

  const utils = api.useUtils();
  const { mutate } = api.exam.answerQuestion.useMutation({
    onSuccess: () => utils.exam.getExams.invalidate(),
  });

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const sendAnswer = (finishExam = false) => {
    if (
      selectedAnswers[currentQuestion] !== sentAnswers[currentQuestion] ||
      finishExam
    ) {
      mutate({
        examAttemptId,
        questionInstanceId: questions[currentQuestion]!.questionInstanceId,
        answer:
          selectedAnswers[currentQuestion] !== undefined
            ? (String.fromCharCode(65 + selectedAnswers[currentQuestion]) as
                | "A"
                | "B"
                | "C"
                | "D")
            : null,
        finishExam,
      });
      setSentAnswers((answers) => ({
        ...answers,
        [currentQuestion]: selectedAnswers[currentQuestion],
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      sendAnswer();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      sendAnswer();
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const selectQuestion = (index: number) => {
    sendAnswer();
    setCurrentQuestion(index);
  };

  const handleSubmit = (ignoreWarning = false) => {
    let unansweredQuestionCount = 0;
    for (let i = 0; i < (ignoreWarning ? 0 : questions.length); i++) {
      if (selectedAnswers[i] === undefined) unansweredQuestionCount++;
    }
    if (unansweredQuestionCount > 0) {
      setWarningMessage(unansweredQuestionCount);
    } else {
      sendAnswer(true);
      setWarningMessage(null);
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (sentAnswers[i] === 0) {
        correct++;
      }
    }
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Wynik</CardTitle>
            <CardDescription>To twoje wyniki egzaminu</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="mb-2 text-4xl font-bold">
                {percentage.toFixed(0)}%
              </div>
              <div className="text-muted-foreground">
                {score} z {questions.length} odpowiedzi poprawnych
              </div>
            </div>

            <Accordion type="single" collapsible>
              {questions.map((question, index) => (
                <AccordionItem key={question.id} value={question.id}>
                  <AccordionTrigger iconSide="left">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm">Pytanie {index + 1}</span>
                      <div>
                        {selectedAnswers[index] === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : selectedAnswers[index] === undefined ? (
                          <CircleQuestionMark className="h-5 w-5 text-slate-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-left">
                    <p className="mb-4">{question.question}</p>
                    <div className="flex flex-col gap-3">
                      {question.answers.map(([dbIndex, answer]) => (
                        <div
                          key={dbIndex}
                          className={cn(
                            "rounded-lg border px-4 py-3",
                            selectedAnswers[index] === dbIndex &&
                              "border-red-500",
                            dbIndex === 0 && "border-green-500",
                          )}
                        >
                          {answer}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href=".">Wróć do egzaminów</Link>
              </Button>
              <CategoryStartButton
                categoryId={categoryId}
                className="w-34"
                replaceLink
              >
                Rozpocznij nowy
              </CategoryStartButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion]!;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      {warningMessage !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p>
                  Nie odpowiedziałeś na {warningMessage}{" "}
                  {conjugate(warningMessage, "pytanie", "pytania", "pytań")}.
                </p>
                <p>Czy na pewno chcesz zakończyć egzamin?</p>
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setWarningMessage(null)}
                  >
                    Wróć do egzaminu
                  </Button>
                  <Button onClick={() => handleSubmit(true)}>
                    Zakończ egzamin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Egzamin</h1>
              <p className="text-muted-foreground">
                Pytanie {currentQuestion + 1} z {questions.length}
              </p>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {timeLeft === undefined ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                <span
                  className={cn(
                    "text-right font-mono",
                    timeLeft === null && "text-red-500",
                  )}
                >
                  {timeLeft ?? "Czas upłynął"}
                </span>
              )}
            </div>
          </div>

          <Progress value={progress} className="mb-6" />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString() ?? ""}
                onValueChange={(value) =>
                  handleAnswerSelect(currentQuestion, Number.parseInt(value))
                }
                className="space-y-3"
              >
                {currentQ.answers.map(([dbIndex, answer], index) => (
                  <div
                    key={index}
                    className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4"
                    onClick={() => handleAnswerSelect(currentQuestion, dbIndex)}
                  >
                    <RadioGroupItem
                      value={dbIndex.toString()}
                      id={`answer-${index}`}
                    />
                    <Label
                      htmlFor={`answer-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      <span className="mr-2 font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {answer}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Poprzednie pytanie
            </Button>

            <div className="flex gap-2">
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={() => handleSubmit()}>Zakończ egzamin</Button>
              ) : (
                <Button onClick={handleNext}>Następne pytanie</Button>
              )}
            </div>
          </div>

          <div className="bg-muted mt-6 rounded-lg p-4">
            <h3 className="mb-2 font-medium">Progress Overview</h3>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <Badge
                  key={index}
                  variant={
                    index === currentQuestion
                      ? "default"
                      : selectedAnswers[index] !== undefined
                        ? "green"
                        : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => selectQuestion(index)}
                >
                  {index + 1}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
