"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { X, Mail } from "lucide-react";
import { cn } from "~/lib/utils";

const DISMISSED_KEY = "help-popup-dismissed";
// const SHOW_DELAY_MS = 2 * 60 * 1000; // 2 minutes
const SHOW_DELAY_MS = 10 * 1000;

export function HelpImproving() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user already dismissed the popup
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed === "true") {
      return;
    }

    // Set timer to show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(DISMISSED_KEY, "true");
    }, 200); // Wait for animation to complete
  };

  const handleContact = () => {
    window.location.href = "mailto:pplka@fkrawczyk.pl?subject=Pomoc w ulepszeniu strony";
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg transition-all duration-300",
        isAnimating
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-card-foreground">
            Pomóż nam ulepszyć stronę
          </h3>
          <button
            onClick={handleDismiss}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Zamknij"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Znalazłeś jakiś błąd albo chciałbyś zmienić coś na stronie? A może
          znasz dobre wyjaśnienie poprawnej odpowiedzi na któreś z pytań? Napisz
          do nas na pplka@fkrawczyk.pl. Chętnie usłyszymy Twoją opinię.
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Odrzuć
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleContact}
            className="flex-1"
          >
            <Mail className="h-4 w-4" />
            Kontakt
          </Button>
        </div>
      </div>
    </div>
  );
}
