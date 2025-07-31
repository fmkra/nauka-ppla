import { postRouter } from "~/server/api/routers/post";
import { questionDatabaseRouter } from "~/server/api/routers/question_database";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { learningRouter } from "./routers/learning";
import { examRouter } from "./routers/exam";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  questionDatabase: questionDatabaseRouter,
  post: postRouter,
  learning: learningRouter,
  exam: examRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
