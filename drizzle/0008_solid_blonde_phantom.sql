ALTER TABLE "nauka-ppla_category_question" RENAME TO "nauka-ppla_question_instance";--> statement-breakpoint
ALTER TABLE "nauka-ppla_questions_to_tags" RENAME TO "nauka-ppla_question_to_tags";--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" RENAME COLUMN "questionId" TO "questionInstanceId";--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_instance" DROP CONSTRAINT "nauka-ppla_category_question_categoryId_nauka-ppla_category_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_instance" DROP CONSTRAINT "nauka-ppla_category_question_questionId_nauka-ppla_question_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" DROP CONSTRAINT "nauka-ppla_learning_progress_questionId_nauka-ppla_question_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_to_tags" DROP CONSTRAINT "nauka-ppla_questions_to_tags_questionId_nauka-ppla_question_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_to_tags" DROP CONSTRAINT "nauka-ppla_questions_to_tags_tagId_nauka-ppla_tag_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" DROP CONSTRAINT "nauka-ppla_learning_progress_userId_questionId_pk";--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" ADD CONSTRAINT "nauka-ppla_learning_progress_userId_questionInstanceId_pk" PRIMARY KEY("userId","questionInstanceId");--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_instance" ADD CONSTRAINT "nauka-ppla_question_instance_categoryId_nauka-ppla_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."nauka-ppla_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_instance" ADD CONSTRAINT "nauka-ppla_question_instance_questionId_nauka-ppla_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."nauka-ppla_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" ADD CONSTRAINT "nauka-ppla_learning_progress_questionInstanceId_nauka-ppla_question_instance_id_fk" FOREIGN KEY ("questionInstanceId") REFERENCES "public"."nauka-ppla_question_instance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_to_tags" ADD CONSTRAINT "nauka-ppla_question_to_tags_questionId_nauka-ppla_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."nauka-ppla_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_question_to_tags" ADD CONSTRAINT "nauka-ppla_question_to_tags_tagId_nauka-ppla_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."nauka-ppla_tag"("id") ON DELETE no action ON UPDATE no action;