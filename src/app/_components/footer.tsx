import Link from "next/link";
import { Mail, Github, GraduationCap } from "lucide-react";

const navigation = [
  { name: "PPL(A)", href: "/ppla" },
  { name: "SPL", href: "/spl" },
  { name: "BPL", href: "/bpl" },
  { name: "PPL(H)", href: "/pplh" },
];

const resources = [
  { name: "Nauka", href: (l: string) => `/${l}/learn` },
  { name: "Baza pytań", href: (l: string) => `/${l}/questions` },
  { name: "Egzamin próbny", href: (l: string) => `/${l}/exam` },
];

export function Footer({license}: {license: string}) {
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6" />
              <span className="font-semibold text-lg">PPLka.pl</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Kompleksowe materiały przygotowujące do egzaminu teoretycznego na licencję pilota prywatnego.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Licencje</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Zasoby</h3>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href(license)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Znalazłeś jakiś błąd albo chciałbyś zmienić coś na stronie? A może
              znasz dobre wyjaśnienie poprawnej odpowiedzi na któreś z pytań?
              Napisz do nas. Chętnie usłyszymy Twoją opinię.
            </p>
            <a
              href="mailto:pplka@fkrawczyk.pl?subject=Pomoc w ulepszeniu strony"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              pplka@fkrawczyk.pl
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Filip Krawczyk.
            <br />
            Kod źródłowy strony oparty na licencji GNU General Public License v3.0.
            <br />
            Wyjaśnienia do pytań udostępniane są na licencji Creative Commons BY-NC-ND 4.0.
            <br />
            Wszelkie prawa do pozostałych materiałów zastrzeżone.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/fmkra/pplka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
