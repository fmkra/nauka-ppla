"use client";

import { User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, variants as buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export default function NavbarUser() {
  const session = useSession();

  return session.status === "loading" ? (
    <Skeleton className={cn("h-9 w-28", buttonVariants.variant.default)} />
  ) : session.data?.user ? (
    <div className="flex items-center space-x-2">
      <User className="h-4 w-4" />
      <span>{session.data?.user.name}</span>
      <Button className="w-28" onClick={() => signOut()}>
        Wyloguj się
      </Button>
    </div>
  ) : (
    <Button className="w-28" onClick={() => signIn("google")}>
      Zaloguj się
    </Button>
  );
}
