"use client";

import { useState, useEffect, useRef } from "react";

export function useTimeLeft(finishTime: number): string | undefined;
export function useTimeLeft(
  finishTime: number,
  initialTime: number,
  onFinish?: () => void,
): string;

export function useTimeLeft(
  finishTime: number,
  initialTime?: number,
  onFinish?: () => void,
) {
  const [currentTime, setCurrentTime] = useState<number | undefined>(
    initialTime,
  );
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const now = Date.now();
    setCurrentTime(now);
    if (now > finishTime) {
      onFinishRef.current?.();
      onFinishRef.current = undefined;
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (now > finishTime) {
        onFinishRef.current?.();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [finishTime, onFinishRef]);

  if (currentTime === undefined) return undefined;

  const timeLeft = finishTime - currentTime;
  if (timeLeft < 0) return null;
  const secondsLeft = Math.round(timeLeft / 1000);
  const timerString =
    Math.floor(secondsLeft / 60).toString() +
    ":" +
    (secondsLeft % 60).toString().padStart(2, "0");

  return timerString;
}
