CREATE TABLE "surat_keterangan_penghasilan_orang_tua" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"nik_ayah" text NOT NULL,
	"nik_ibu" text NOT NULL,
	"tujuan_pembuatan" text NOT NULL,
	"nama_sekolah_atau_universitas" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_keterangan_penghasilan_orang_tua" ADD CONSTRAINT "surat_keterangan_penghasilan_orang_tua_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;