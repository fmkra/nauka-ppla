ALTER TABLE "nauka-ppla_category" RENAME COLUMN "license" TO "licenseId";--> statement-breakpoint
ALTER TABLE "nauka-ppla_category" DROP CONSTRAINT "nauka-ppla_category_url_license_unique";--> statement-breakpoint
ALTER TABLE "nauka-ppla_category" DROP CONSTRAINT "nauka-ppla_category_license_nauka-ppla_license_id_fk";
--> statement-breakpoint
ALTER TABLE "nauka-ppla_category" ADD CONSTRAINT "nauka-ppla_category_licenseId_nauka-ppla_license_id_fk" FOREIGN KEY ("licenseId") REFERENCES "public"."nauka-ppla_license"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nauka-ppla_category" ADD CONSTRAINT "nauka-ppla_category_url_licenseId_unique" UNIQUE("url","licenseId");