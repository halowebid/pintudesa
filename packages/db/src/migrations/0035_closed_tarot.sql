CREATE TABLE "surat_keterangan_jalan" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"maksud_perjalanan" text NOT NULL,
	"tujuan_perjalanan" text NOT NULL,
	"rencana_berangkat" timestamp with time zone NOT NULL,
	"transportasi" text NOT NULL,
	"no_plat_kendaraan" text NOT NULL,
	"nama_sopir" text NOT NULL,
	"tempat_lahir_sopir" text NOT NULL,
	"tanggal_lahir_sopir" timestamp with time zone,
	"pengikut" text,
	"barang_bawaan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_keterangan_jalan" ADD CONSTRAINT "surat_keterangan_jalan_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;