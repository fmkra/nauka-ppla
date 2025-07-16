"use client";

import Link from "next/link";
import { Button, variants as buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { cn, conjugate } from "~/utils";

type Category = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  questionCount: number;
};

export default function CardUserProgress({
  licenseId,
  licenseUrl,
  category,
}: {
  licenseId: number;
  licenseUrl: string;
  category: Category;
}) {
  const { data, isLoading } = api.learning.getLicenseProgress.useQuery({
    licenseId,
  });

  const categoryProgress = data?.[category.id];

  if (isLoading) {
    return (
      <Skeleton
        className={cn("mt-auto h-9 w-full", buttonVariants.variant.default)}
      />
    );
  }

  return (
    <>
      {categoryProgress ? (
        <p className="text-muted-foreground mb-2 text-sm">
          Ukończono {categoryProgress.done} z {categoryProgress.total}{" "}
          {conjugate(categoryProgress.done, "pytanie", "pytania", "pytań")}
        </p>
      ) : null}
      <Button className="mt-auto w-full" asChild>
        <Link href={`/learn/${licenseUrl}/${category.url}`}>
          {categoryProgress ? "Kontynuuj naukę" : "Rozpocznij naukę"}
        </Link>
      </Button>
    </>
  );
}
