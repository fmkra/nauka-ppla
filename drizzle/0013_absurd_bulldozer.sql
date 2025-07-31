ALTER TABLE "nauka-ppla_exam_attempt" RENAME COLUMN "createdAt" TO "startedAt";--> statement-breakpoint
ALTER TABLE "nauka-ppla_category" ADD COLUMN "examTime" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "nauka-ppla_category" ADD COLUMN "examQuestionCount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "nauka-ppla_exam_attempt" ADD COLUMN "finishedAt" timestamp;