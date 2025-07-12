"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/utils";
import { BookOpen, Database, GraduationCap, Home, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

const navigation = [
  { name: "Start", href: "/", icon: Home },
  { name: "Nauka", href: "/learn", icon: BookOpen },
  { name: "Baza pytań", href: "/questions", icon: Database },
  { name: "Egzamin", href: "/exam", icon: GraduationCap },
];

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">PPL(A)</span>
          </Link>

          <div className="flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname.split("/")[1] === item.href.split("/")[1]
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

          {session.status === "loading" ? (
            <div className="flex w-28 items-center justify-center space-x-2">
              <Spinner className="h-4 w-4" />
            </div>
          ) : session.data?.user ? (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{session.data?.user.name}</span>
              <Button onClick={() => signOut()}>Wyloguj się</Button>
            </div>
          ) : (
            <Button onClick={() => signIn("google")}>Zaloguj się</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
