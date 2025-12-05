CREATE TABLE "surat_keterangan_penyaksian_tanah" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"keperluan" text NOT NULL,
	"jenis_tanah" text NOT NULL,
	"lokasi_tanah" text NOT NULL,
	"luas_tanah" text NOT NULL,
	"batas_utara" text NOT NULL,
	"batas_selatan" text NOT NULL,
	"batas_timur" text NOT NULL,
	"batas_barat" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_keterangan_penyaksian_tanah" ADD CONSTRAINT "surat_keterangan_penyaksian_tanah_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;