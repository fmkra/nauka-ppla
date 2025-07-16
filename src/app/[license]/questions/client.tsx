"use client";

import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Question } from "~/app/_components/question";
import { Spinner } from "~/components/ui/spinner";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { type SelectOption } from "~/components/ui/select";
import usePagination from "~/app/_components/pagination";
import { CategoryFilter } from "./category-filter";
import { LicenseFilter } from "./license-filter";

const pageSizeOptions: SelectOption[] = [
  { value: "5", label: "5 pytań" },
  { value: "10", label: "10 pytań" },
  { value: "20", label: "20 pytań" },
  { value: "50", label: "50 pytań" },
  { value: "100", label: "100 pytań" },
];

export default function QuestionsPageClient({
  defaultLicenseId,
}: {
  defaultLicenseId: number;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<number[]>([
    defaultLicenseId,
  ]);
  const searchDebounced = useDebounce(search, 500);

  const { data: totalCount, isLoading: countLoading } =
    api.questionDatabase.getQuestionsCount.useQuery({
      search: searchDebounced,
      categoryIds:
        selectedCategories.length > 0 ? selectedCategories : undefined,
    });

  const pagination = usePagination(pageSizeOptions, "20", totalCount);

  const setCurrentPage = pagination.setCurrentPage;
  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, searchDebounced, selectedCategories]);

  const { data: questions, isLoading: questionsLoading } =
    api.questionDatabase.getQuestions.useQuery({
      search: searchDebounced,
      categoryIds:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      limit: pagination.limit,
      offset: pagination.offset,
    });

  const isLoading = questionsLoading || countLoading;

  return (
    <>
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Przeglądaj pytania..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-32">{pagination.pageSizeSelector}</div>
        <LicenseFilter
          selectedLicenses={selectedLicenses}
          onLicensesChange={setSelectedLicenses}
        />
        <CategoryFilter
          licenseIds={selectedLicenses}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        </div>
      ) : !questions || questions.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Nie znaleziono pytań</p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
            <span>
              Pokazano {pagination.currentPageRange} z {totalCount ?? 0} pytań
            </span>
          </div>

          <div className="grid gap-6">
            {questions.map((q) => (
              <Question question={q} key={q.question.id} showLicense={true} />
            ))}
          </div>

          {pagination.footer}
        </>
      )}
    </>
  );
}
