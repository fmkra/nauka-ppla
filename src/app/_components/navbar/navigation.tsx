"use client";

import { cn } from "~/lib/utils";
import Link from "next/link";
import { Select, type SelectOption } from "~/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Database, GraduationCap, Home, Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const navigation = [
  { name: "Start", href: "", icon: Home },
  { name: "Nauka", href: "learn", icon: BookOpen },
  { name: "Baza pytań", href: "questions", icon: Database },
  { name: "Egzamin", href: "exam", icon: GraduationCap },
];

export default function Navigation({ options }: { options: SelectOption[] }) {
  const pathname = usePathname().split("/");
  const router = useRouter();
  const license = pathname[1] === "" ? undefined : pathname[1];
  const page = pathname[2] ?? "";

  const handleLicenseChange = (value: string) => {
    if (value === license) return;
    router.push(`/${value}`);
  };

  if (!license)
    return (
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
          <GraduationCap className="h-6 w-6" />
        </Link>

        <Select
          className="w-42"
          placeholder="Wybierz licencję"
          options={options}
          value={license}
          onValueChange={handleLicenseChange}
        />
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-1 sm:flex">
        <Link href="/" className="flex items-center">
          <GraduationCap className="h-6 w-6" />
        </Link>

        <Select
          className="mr-4 ml-1 w-24"
          placeholder="Wybierz licencję"
          options={options}
          value={license}
          onValueChange={handleLicenseChange}
        />

        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={`/${license}/${item.href}`}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                page === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Otwórz menu">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 min-w-48">
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center">
                <GraduationCap className="h-6 w-6" />
                <span>Strona główna</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Select
                className="my-2 w-full"
                placeholder="Wybierz licencję"
                options={options}
                value={license}
                onValueChange={handleLicenseChange}
              />
            </DropdownMenuItem>

            {navigation.map((item) => {
              const Icon = item.icon;
              const href = `/${license}/${item.href}`;
              const active = page === item.href;
              return (
                <DropdownMenuItem key={item.name} asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex w-full items-center gap-2",
                      active && "text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
