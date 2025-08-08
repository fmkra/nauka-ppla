"use client";

import { User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, variants as buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";

export default function NavbarUser() {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <Skeleton className={cn("h-9 w-28", buttonVariants.variant.default)} />
    );
  }

  if (session.data?.user) {
    return (
      <div className="flex items-center">
        <div className="hidden items-center space-x-2 lg:flex">
          <User className="h-4 w-4" />
          <span>{session.data?.user.name}</span>
          <Button className="w-28" onClick={() => signOut()}>
            Wyloguj się
          </Button>
        </div>

        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu użytkownika">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Zalogowano jako
                  </span>
                  <span className="text-foreground max-w-48 truncate text-sm font-medium">
                    {session.data.user.name}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer"
              >
                Wyloguj się
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        className="hidden w-28 sm:inline-flex"
        onClick={() => signIn("google")}
      >
        Zaloguj się
      </Button>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Zaloguj się">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40" align="end">
            <DropdownMenuItem
              onClick={() => signIn("google")}
              className="cursor-pointer"
            >
              Zaloguj się z Google
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
