CREATE TABLE "surat_keteragan_penghasilan" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"penghasilan" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "suratIzinMendirikanBangunan" RENAME TO "surat_izin_mendirikan_bangunan";--> statement-breakpoint
ALTER TABLE "suratKeteranganDomisili" RENAME TO "surat_keterangan_domisili";--> statement-breakpoint
ALTER TABLE "suratKeteranganKepemilikanRumah" RENAME TO "surat_keterangan_kepemilikan_rumah";--> statement-breakpoint
ALTER TABLE "suratKuasaAhliWaris" RENAME TO "surat_kuasa_ahli_waris";--> statement-breakpoint
ALTER TABLE "surat_izin_mendirikan_bangunan" DROP CONSTRAINT "suratIzinMendirikanBangunan_pemohon_nik_penduduk_id_fk";
--> statement-breakpoint
ALTER TABLE "surat_keterangan_domisili" DROP CONSTRAINT "suratKeteranganDomisili_pemohon_nik_penduduk_id_fk";
--> statement-breakpoint
ALTER TABLE "surat_keterangan_kepemilikan_rumah" DROP CONSTRAINT "suratKeteranganKepemilikanRumah_pemohon_nik_penduduk_id_fk";
--> statement-breakpoint
ALTER TABLE "surat_kuasa_ahli_waris" DROP CONSTRAINT "suratKuasaAhliWaris_pemohon_nik_penduduk_id_fk";
--> statement-breakpoint
ALTER TABLE "surat_kuasa_ahli_waris" DROP CONSTRAINT "suratKuasaAhliWaris_yang_meninggal_nik_penduduk_id_fk";
--> statement-breakpoint
ALTER TABLE "surat_keteragan_penghasilan" ADD CONSTRAINT "surat_keteragan_penghasilan_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_izin_mendirikan_bangunan" ADD CONSTRAINT "surat_izin_mendirikan_bangunan_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_keterangan_domisili" ADD CONSTRAINT "surat_keterangan_domisili_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_keterangan_kepemilikan_rumah" ADD CONSTRAINT "surat_keterangan_kepemilikan_rumah_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_kuasa_ahli_waris" ADD CONSTRAINT "surat_kuasa_ahli_waris_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_kuasa_ahli_waris" ADD CONSTRAINT "surat_kuasa_ahli_waris_yang_meninggal_nik_penduduk_id_fk" FOREIGN KEY ("yang_meninggal_nik") REFERENCES "public"."penduduk"("id") ON DELETE no action ON UPDATE no action;