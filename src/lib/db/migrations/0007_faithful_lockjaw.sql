CREATE TYPE "public"."jenis_surat_agenda" AS ENUM('surat_masuk', 'surat_keluar');--> statement-breakpoint
CREATE TABLE "agenda" (
	"id" text PRIMARY KEY NOT NULL,
	"jenis_surat" "jenis_surat_agenda" DEFAULT 'surat_masuk',
	"uraian" text NOT NULL,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "berita" RENAME COLUMN "content" TO "uraian";