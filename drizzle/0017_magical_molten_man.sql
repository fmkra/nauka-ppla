CREATE TABLE "nauka-ppla_explanation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"explanation" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nauka-ppla_question" ADD COLUMN "explanationId" varchar(255);--> statement-breakpoint
ALTER TABLE "nauka-ppla_question" ADD CONSTRAINT "nauka-ppla_question_explanationId_nauka-ppla_explanation_id_fk" FOREIGN KEY ("explanationId") REFERENCES "public"."nauka-ppla_explanation"("id") ON DELETE no action ON UPDATE no action;