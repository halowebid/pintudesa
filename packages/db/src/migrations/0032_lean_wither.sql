CREATE TABLE "_surat_keterangan_domisili_keluarga" (
	"id" text PRIMARY KEY NOT NULL,
	"surat_keterangan_domisili_id" text NOT NULL,
	"penduduk_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suratKeteranganDomisili" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"jumlah_tahun_domisili" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suratKuasaAhliWaris" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"yang_diberi_kuasa_nama" text NOT NULL,
	"yang_diberi_kuasa_tempat_lahir" text NOT NULL,
	"yangDiberiKuasaTanggalLahir" timestamp with time zone NOT NULL,
	"hubungan_keluarga" "shdk",
	"yang_diberi_kuasa_alamat" text NOT NULL,
	"yang_diberi_kuasa_alamat_wilayah" text,
	"yang_meninggal_nik" text NOT NULL,
	"tanggalMeninggal" timestamp with time zone NOT NULL,
	"lokasi_meninggal" text NOT NULL,
	"lokasi_pemakaman" text NOT NULL,
	"tanggalPemakaman" timestamp with time zone NOT NULL,
	"nomor_surat_kematian" text,
	"tanggalSuratKematian" timestamp with time zone,
	"ahli_waris_nik" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "suratKeteranganDomisili" ADD CONSTRAINT "suratKeteranganDomisili_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suratKuasaAhliWaris" ADD CONSTRAINT "suratKuasaAhliWaris_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suratKuasaAhliWaris" ADD CONSTRAINT "suratKuasaAhliWaris_yang_meninggal_nik_penduduk_id_fk" FOREIGN KEY ("yang_meninggal_nik") REFERENCES "public"."penduduk"("id") ON DELETE no action ON UPDATE no action;