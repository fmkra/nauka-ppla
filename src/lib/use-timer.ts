"use client";

import { useState, useEffect } from "react";

export function useTimer(): Date | undefined;
export function useTimer(initialTime: Date): Date;

export function useTimer(initialTime?: Date) {
  const [currentTime, setCurrentTime] = useState<number | undefined>(() =>
    initialTime?.getTime(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return currentTime !== undefined ? new Date(currentTime) : undefined;
}
