CREATE TABLE "surat_keterangan_gaib" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"tanggal_ditinggal" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_keterangan_gaib" ADD CONSTRAINT "surat_keterangan_gaib_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;