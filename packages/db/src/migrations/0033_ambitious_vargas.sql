CREATE TABLE "suratIzinMendirikanBangunan" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"tujuan_pembuatan" text NOT NULL,
	"luas_tanah" text NOT NULL,
	"batas_utara" text NOT NULL,
	"batas_selatan" text NOT NULL,
	"batas_barat" text NOT NULL,
	"batas_timur" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suratKeteranganKepemilikanRumah" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"alamat_rumah" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "suratIzinMendirikanBangunan" ADD CONSTRAINT "suratIzinMendirikanBangunan_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suratKeteranganKepemilikanRumah" ADD CONSTRAINT "suratKeteranganKepemilikanRumah_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;