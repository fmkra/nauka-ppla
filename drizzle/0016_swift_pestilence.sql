ALTER TABLE "nauka-ppla_learning_category" DROP CONSTRAINT "nauka-ppla_learning_category_userId_categoryId_pk";--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" DROP CONSTRAINT "nauka-ppla_learning_progress_userId_questionInstanceId_pk";--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_category" ADD COLUMN "id" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" ADD COLUMN "id" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "nauka-ppla_learning_category_userId_categoryId_index" ON "nauka-ppla_learning_category" USING btree ("userId","categoryId");--> statement-breakpoint
CREATE UNIQUE INDEX "nauka-ppla_learning_progress_userId_questionInstanceId_index" ON "nauka-ppla_learning_progress" USING btree ("userId","questionInstanceId");