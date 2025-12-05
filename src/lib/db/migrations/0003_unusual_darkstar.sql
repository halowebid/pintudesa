CREATE TYPE "public"."jenis_peraturan_buku_peraturan_desa" AS ENUM('peraturan_desa', 'peraturan_bersama', 'peraturan_kepala_desa');--> statement-breakpoint
CREATE TABLE "buku_peraturan_desa" (
	"id" text PRIMARY KEY NOT NULL,
	"judul" text NOT NULL,
	"uraian" text NOT NULL,
	"jenis_peraturan" "jenis_peraturan_buku_peraturan_desa" DEFAULT 'peraturan_desa' NOT NULL,
	"nomor_surat_ditetapkan" text NOT NULL,
	"tanggal_surat_ditetapkan" timestamp with time zone NOT NULL,
	"nomor_surat_dilaporkan" text NOT NULL,
	"tanggal_surat_dilaporkan" timestamp with time zone,
	"nomor_surat_diundangkan" text,
	"tanggal_surat_diundangkan" timestamp with time zone,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
