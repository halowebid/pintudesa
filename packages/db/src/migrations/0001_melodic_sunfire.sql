CREATE TABLE "berita" (
	"id" text PRIMARY KEY NOT NULL,
	"judul" text NOT NULL,
	"slug" text NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "berita_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rab" (
	"id" text PRIMARY KEY NOT NULL,
	"judul" text NOT NULL,
	"waktu_pelaksanaan" text NOT NULL,
	"kegiatan" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
