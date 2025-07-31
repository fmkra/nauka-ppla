"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

export default function CategoryStartButton({
  categoryId,
  children,
  className,
  replaceLink = false,
}: {
  categoryId: number;
  children: React.ReactNode;
  className?: string;
  replaceLink?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const utils = api.useUtils();
  const { mutate, isPending } = api.exam.newExam.useMutation({
    onSuccess: async (id) => {
      router.push(`${replaceLink ? "." : pathname}/${id}`);
      await utils.exam.getExamCount.invalidate();
      await utils.exam.getExams.invalidate();
    },
  });

  const handleStart = () => {
    mutate({
      categoryId,
    });
  };

  return (
    <Button onClick={handleStart} disabled={isPending} className={className}>
      {isPending ? <Spinner className="h-4 w-4" /> : children}
    </Button>
  );
}
