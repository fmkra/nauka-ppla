CREATE TABLE "nauka-ppla_learning_progress" (
	"userId" varchar(255) NOT NULL,
	"questionId" varchar(255) NOT NULL,
	"latestAttempt" integer NOT NULL,
	"random" double precision NOT NULL,
	"isDone" boolean NOT NULL,
	"correctCount" integer NOT NULL,
	"incorrectCount" integer NOT NULL,
	CONSTRAINT "nauka-ppla_learning_progress_userId_questionId_pk" PRIMARY KEY("userId","questionId")
);
--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" ADD CONSTRAINT "nauka-ppla_learning_progress_userId_nauka-ppla_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."nauka-ppla_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_learning_progress" ADD CONSTRAINT "nauka-ppla_learning_progress_questionId_nauka-ppla_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."nauka-ppla_question"("id") ON DELETE no action ON UPDATE no action;