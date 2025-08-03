import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export function conjugate(
  count: number,
  single: string,
  few: string,
  many: string,
) {
  if (count === 1) return single;

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  )
    return few;

  return many;
}

export function formatTime(minutes: number) {
  minutes = Math.ceil(minutes);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`;
  }

  return `${remainingMinutes}min`;
}

export const MINUTES_PER_QUESTION = 1.5;
