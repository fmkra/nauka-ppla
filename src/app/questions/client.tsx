"use client";

import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Filter } from "lucide-react";
import { api } from "~/trpc/react";
import { Question } from "./question";
import { Spinner } from "~/components/ui/spinner";
import { useState, useEffect, Fragment } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Select, type SelectOption } from "~/components/ui/select";

const pageSizeOptions: SelectOption[] = [
  { value: "5", label: "5 pytań" },
  { value: "10", label: "10 pytań" },
  { value: "20", label: "20 pytań" },
  { value: "50", label: "50 pytań" },
  { value: "100", label: "100 pytań" },
];

export const Client = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("20");
  const searchDebounced = useDebounce(search, 500);

  const limit = parseInt(pageSize);
  const offset = (currentPage - 1) * limit;

  const { data: questions, isLoading: questionsLoading } =
    api.question.getQuestions.useQuery(
      {
        search: searchDebounced,
        limit,
        offset,
      },
      {
        staleTime: 500,
      },
    );

  const { data: totalCount, isLoading: countLoading } =
    api.question.getQuestionsCount.useQuery(
      {
        search: searchDebounced,
      },
      {
        staleTime: 500,
      },
    );

  const isLoading = questionsLoading || countLoading;
  const totalPages = Math.ceil((totalCount ?? 0) / limit);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchDebounced]);

  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(value);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div>
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
        <div className="w-32">
          <Select
            options={pageSizeOptions}
            value={pageSize}
            onValueChange={handlePageSizeChange}
            placeholder="Rozmiar strony"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtry
        </Button>
      </div>

      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        </div>
      )}

      {!isLoading && (!questions || questions.length === 0) && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Nie znaleziono pytań</p>
          </div>
        </div>
      )}

      {!isLoading && questions && questions.length > 0 && (
        <>
          <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
            <span>
              Pokazano {offset + 1}-{Math.min(offset + limit, totalCount ?? 0)}{" "}
              z {totalCount ?? 0} pytań
            </span>
          </div>

          <div className="grid gap-6">
            {questions.map((question) => (
              <Question question={question} key={question.id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index, array) => (
                    <Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <PaginationItem>
                          <span className="flex h-9 w-9 items-center justify-center text-sm">
                            ...
                          </span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </Fragment>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};
