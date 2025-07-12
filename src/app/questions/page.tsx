import { Client } from "./client";

export default function QuestionBasePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Baza pytań</h1>
        <p className="text-muted-foreground">
          Przeglądaj listę pytań i sprawdź czy umiesz na nie odpowiedzieć.
        </p>
      </div>

      <Client />
    </div>
  );
}
