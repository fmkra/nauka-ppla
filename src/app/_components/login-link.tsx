"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function LoginLink({ asText = false }: { asText?: boolean }) {
  const handleClick = () => {
    void signIn("google");
  };

  if (asText) {
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer font-medium text-amber-900 underline dark:text-amber-100"
      >
        Zaloguj się
      </button>
    );
  }

  return (
    <Button onClick={handleClick} className="mt-3" variant="default">
      Zaloguj się
    </Button>
  );
}
