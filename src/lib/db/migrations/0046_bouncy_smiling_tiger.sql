CREATE TABLE "surat_keterangan_usaha" (
	"id" text PRIMARY KEY NOT NULL,
	"bidang_usaha" text NOT NULL,
	"merk_usaha" text NOT NULL,
	"alamat_usaha" text NOT NULL,
	"berdasarkan" text NOT NULL,
	"pemohon_nik" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_keterangan_usaha" ADD CONSTRAINT "surat_keterangan_usaha_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;