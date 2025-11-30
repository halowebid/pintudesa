CREATE TYPE "public"."notification_type" AS ENUM('system', 'letter_created', 'letter_updated', 'letter_approved', 'letter_rejected', 'document_updated', 'admin_action');--> statement-breakpoint
CREATE TABLE "notifikasi" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"related_entity_id" text,
	"related_entity_type" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;