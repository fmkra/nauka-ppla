CREATE TABLE "nauka-ppla_category_question" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"categoryId" integer NOT NULL,
	"questionId" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nauka-ppla_question" DROP CONSTRAINT "nauka-ppla_question_category_nauka-ppla_category_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_category_question" ADD CONSTRAINT "nauka-ppla_category_question_categoryId_nauka-ppla_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."nauka-ppla_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_category_question" ADD CONSTRAINT "nauka-ppla_category_question_questionId_nauka-ppla_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."nauka-ppla_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_question" DROP COLUMN "category";