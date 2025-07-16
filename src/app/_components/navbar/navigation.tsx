"use client";

import { cn } from "~/lib/utils";
import Link from "next/link";
import { Select, type SelectOption } from "~/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Database, GraduationCap } from "lucide-react";

const navigation = [
  // { name: "Start", href: "/", icon: Home },
  { name: "Nauka", href: "learn", icon: BookOpen },
  { name: "Baza pytań", href: "questions", icon: Database },
  { name: "Egzamin", href: "exam", icon: GraduationCap },
];

export default function Navigation({ options }: { options: SelectOption[] }) {
  const pathname = usePathname().split("/");
  const router = useRouter();
  const license = pathname[1] === "" ? undefined : pathname[1];
  const page = pathname[2];

  const handleLicenseChange = (value: string) => {
    if (value === license) return;
    router.push(`/${value}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href="/" className="flex items-center space-x-2">
        <GraduationCap className="h-6 w-6" />
      </Link>

      <Select
        className="mr-4 w-42"
        placeholder="Wybierz licencję"
        options={options}
        value={license}
        onValueChange={handleLicenseChange}
      />

      {!!license &&
        navigation.map((item) => {
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
  );
}
