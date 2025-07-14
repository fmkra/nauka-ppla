CREATE TABLE "nauka-ppla_learning_category" (
	"userId" varchar(255) NOT NULL,
	"categoryId" integer NOT NULL,
	"latestAttempt" integer NOT NULL,
	CONSTRAINT "nauka-ppla_learning_category_userId_categoryId_pk" PRIMARY KEY("userId","categoryId")
);
--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_category" ADD CONSTRAINT "nauka-ppla_learning_category_userId_nauka-ppla_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nauka-ppla_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_category" ADD CONSTRAINT "nauka-ppla_learning_category_categoryId_nauka-ppla_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."nauka-ppla_category"("id") ON DELETE no action ON UPDATE no action;