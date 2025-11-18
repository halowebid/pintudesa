CREATE TABLE "surat_template" (
	"id" text PRIMARY KEY NOT NULL,
	"surat_type" text NOT NULL,
	"name" text NOT NULL,
	"html_content" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "surat_template_type_idx" ON "surat_template" USING btree ("surat_type");