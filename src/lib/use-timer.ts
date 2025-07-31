"use client";

import { useState, useEffect } from "react";

export const useTimer = (finishTime: number) => {
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (currentTime === undefined) return undefined;

  const timeLeft = finishTime - currentTime;
  if (timeLeft < 0) return null;
  const secondsLeft = Math.round(timeLeft / 1000);
  const timerString =
    Math.floor(secondsLeft / 60).toString() +
    ":" +
    (secondsLeft % 60).toString().padStart(2, "0");

  return timerString;
};
