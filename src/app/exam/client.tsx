"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { QuestionParsed } from "~/utils";

const useTimer = (timeLength: number, beginTime_?: number) => {
  const initialTime = useMemo(() => Date.now(), []);
  const finishTime = (beginTime_ ?? initialTime) + timeLength * 1000;
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const timeLeft = Math.max(finishTime - currentTime, 0);
  const secondsLeft = Math.round(timeLeft / 1000);
  const timerString =
    Math.floor(secondsLeft / 60).toString() +
    ":" +
    (secondsLeft % 60).toString().padStart(2, "0");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timerString;
};

export default function ExamClientPage({
  questions,
}: {
  questions: QuestionParsed[];
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [showResults, setShowResults] = useState(false);
  const timeLeft = useTimer(60 * 10);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
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

            <div className="mb-6 space-y-4">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm">Pytanie {index + 1}</span>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4">
              {/* <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                  setShowResults(false);
                  setTimeLeft(600);
                }}
              >
                Retake Exam
              </Button> */}
              <Button variant="outline">Przeglądaj odpowiedzi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion]!;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
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
            <span className="font-mono">{timeLeft}</span>
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQ.id]?.toString() ?? ""}
              onValueChange={(value) =>
                handleAnswerSelect(currentQ.id, Number.parseInt(value))
              }
              className="space-y-3"
            >
              {currentQ.answers.map((answer, index) => (
                <div
                  key={index}
                  className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4"
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
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
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit}>Submit Exam</Button>
            ) : (
              <Button onClick={handleNext}>Next Question</Button>
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
                    : selectedAnswers[questions[index]!.id] !== undefined
                      ? "secondary"
                      : "outline"
                }
                className="cursor-pointer"
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
