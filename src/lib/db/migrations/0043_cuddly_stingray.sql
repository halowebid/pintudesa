CREATE TABLE "surat_pindah_desa_bpn" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"nomor_shm" text NOT NULL,
	"tanggal_shm" timestamp with time zone NOT NULL,
	"keterangan_surat" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_pindah_desa_bpn" ADD CONSTRAINT "surat_pindah_desa_bpn_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;