"use client";

interface CategoryLearningClientProps {
  category: {
    id: number;
    name: string;
    url: string;
    description: string | null;
    questionCount: number;
  };
}

export function CategoryLearningClient({}: CategoryLearningClientProps) {
  return null;
}
