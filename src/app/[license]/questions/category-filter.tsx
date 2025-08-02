"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
// import { api } from "~/trpc/react";
// import { Spinner } from "~/components/ui/spinner";
import { conjugate } from "~/lib/utils";
import type { Category } from "./client";

function getStyle(color: string | null) {
  const colors = color?.split(",");
  if (colors?.length != 2) return {};
  return {
    backgroundColor: colors[0],
    borderColor: colors[1],
  };
}

interface CategoryFilterProps {
  // licenseIds: number[];
  categories: Category[];
  selectedCategories: number[];
  onCategoriesChange: (categories: number[]) => void;
}

export function CategoryFilter({
  // licenseIds,
  categories,
  selectedCategories,
  onCategoriesChange,
}: CategoryFilterProps) {
  const [open, setOpen] = useState(false);

  // const { data: categories, isLoading } =
  //   api.questionDatabase.getCategories.useQuery({
  //     licenseIds,
  //   });

  const handleCategoryToggle = (categoryId: number) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelected);
  };

  const handleSelectAll = () => {
    if (categories) {
      onCategoriesChange(categories.map((cat) => cat.id));
    }
  };

  const handleClearAll = () => {
    onCategoriesChange([]);
  };

  const selectedCount = selectedCategories.length;
  const totalCount = categories?.length ?? 0;
  // const showLicenseName = licenseIds.length !== 1;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          <span>
            {selectedCount == 0 || selectedCount == totalCount
              ? "Wszystkie przedmioty"
              : selectedCount +
                " " +
                conjugate(
                  selectedCount,
                  "przedmiot",
                  "przedmioty",
                  "przedmiotów",
                )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Filtruj według przedmiotów</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Spinner size="sm" />
          </div>
        ) : (
          <> */}
        <DropdownMenuCheckboxItem
          checked={selectedCount === totalCount}
          onCheckedChange={() => {
            if (selectedCount === totalCount) {
              handleClearAll();
            } else {
              handleSelectAll();
            }
          }}
        >
          Wszystkie przedmioty
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />

        {categories?.map((category) => (
          <DropdownMenuCheckboxItem
            key={category.id}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={() => handleCategoryToggle(category.id)}
            className="flex items-center gap-2"
          >
            <div
              className="h-3 w-3 shrink-0 rounded-full border"
              style={getStyle(category.color)}
            />
            {/* {(showLicenseName ? category.license?.name + ": " : "") +
              category.name} */}
            {category.name}
          </DropdownMenuCheckboxItem>
        ))}
        {/* </>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
