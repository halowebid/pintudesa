CREATE TABLE "surat_izin_keramaian" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"tujuan_pembuatan" text NOT NULL,
	"waktu_acara" timestamp with time zone NOT NULL,
	"waktu_selesai" timestamp with time zone,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_izin_keramaian" ADD CONSTRAINT "surat_izin_keramaian_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;