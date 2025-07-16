// import { LatestPost } from "~/app/_components/post";
// import { auth, signIn } from "~/server/auth";
// import { api, HydrateClient } from "~/trpc/server";

// export default async function Home() {
//   const hello = await api.post.hello({ text: "from tRPC" });
//   const session = await auth();

//   if (session?.user) {
//     void api.post.getLatest.prefetch();
//   }

//   return (
//     <HydrateClient>
//       <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//         <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
//           <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//             Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
//           </h1>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
//               href="https://create.t3.gg/en/usage/first-steps"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">First Steps →</h3>
//               <div className="text-lg">
//                 Just the basics - Everything you need to know to set up your
//                 database and authentication.
//               </div>
//             </Link>
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
//               href="https://create.t3.gg/en/introduction"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">Documentation →</h3>
//               <div className="text-lg">
//                 Learn more about Create T3 App, the libraries it uses, and how
//                 to deploy it.
//               </div>
//             </Link>
//           </div>
//           <div className="flex flex-col items-center gap-2">
//             <p className="text-2xl text-white">
//               {hello ? hello.greeting : "Loading tRPC query..."}
//             </p>

//             <div className="flex flex-col items-center justify-center gap-4">
//               <p className="text-center text-2xl text-white">
//                 {session && <span>Logged in as {session.user?.name}</span>}
//               </p>
//               <Link
//                 href={session ? "/api/auth/signout" : "/api/auth/signin"}
//                 className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
//               >
//                 {session ? "Sign out" : "Sign in"}
//               </Link>
//             </div>
//             <form
//               action={async () => {
//                 "use server";
//                 await signIn("google");
//               }}
//             >
//               Alternative <button type="submit">Sign in</button>
//             </form>
//           </div>

//           {session?.user && <LatestPost />}
//         </div>
//       </main>
//     </HydrateClient>
//   );
// }

import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { BookOpen, Database, GraduationCap, ArrowRight } from "lucide-react";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { licenses } from "~/server/db/license";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ license: string }>;
}) {
  const { license } = await params;
  const licenseData = await db.query.licenses.findFirst({
    where: eq(licenses.url, license),
  });

  if (!licenseData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Witaj na Nauka {licenseData.name}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Opanuj materiał do egzaminu na licencję PPL(A) z naszą interaktywną
          platformą. Ucz się, ćwicz i sprawdzaj swoją wiedzę.      
        </p>
      </div>
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <BookOpen className="mb-4 h-12 w-12 text-blue-600" />   
            <CardTitle>Nauka</CardTitle>
            <CardDescription>
              Przechodź przez wszystkie pytania, a system zapamięta Twoje
              odpowiedzi i postępy w nauce.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${license}/learn`}>
              <Button className="w-full">
                Rozpocznij naukę <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <Database className="mb-4 h-12 w-12 text-green-600" /> 
            <CardTitle>Baza Pytań</CardTitle>
            <CardDescription>
              Przeglądaj i filtruj całą bazę pytań po kategoriach, tagach oraz
              wyszukuj po treści.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${license}/questions`}>
              <Button className="w-full bg-transparent" variant="outline">
                Zobacz pytania
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <GraduationCap className="mb-4 h-12 w-12 text-purple-600" />       
                <CardTitle>Egzamin</CardTitle>
            <CardDescription>
              Sprawdź swoją wiedzę w realistycznych warunkach, korzystając z
              naszego symulatora egzaminu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${license}/exam`}>
              <Button className="w-full" variant="secondary">
                Podejdź do egzaminu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">Gotów, aby zacząć?</h2>     
        <p className="text-muted-foreground mb-6">
          Wybierz swój tryb nauki i rozpocznij podróż do zdobycia licencji.
        </p>
        <Link href={`/${license}/learn`}>
           <Button size="lg">Rozpocznij przygotowania</Button>
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const licenses = await db.query.licenses.findMany();
  return licenses.map((license) => ({
    license: license.url,
  }));
}
