CREATE TABLE "surat_keterangan_kelahiran" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_anak" text NOT NULL,
	"tempat_lahir_anak" text NOT NULL,
	"tanggal_lahir_anak" timestamp with time zone,
	"jenis_kelamin_anak" "jenis_kelamin" NOT NULL,
	"nik_ayah" text NOT NULL,
	"nama_ayah" text NOT NULL,
	"tempat_lahir_ayah" text NOT NULL,
	"tanggal_lahir_ayah" timestamp with time zone,
	"pekerjaan_ayah" "jenis_pekerjaan" NOT NULL,
	"alamat_ayah" text NOT NULL,
	"alamat_wilayah_ayah" text NOT NULL,
	"nik_ibu" text NOT NULL,
	"nama_ibu" text NOT NULL,
	"tempat_lahir_ibu" text NOT NULL,
	"tanggal_lahir_ibu" timestamp with time zone,
	"pekerjaan_ibu" "jenis_pekerjaan" NOT NULL,
	"alamat_ibu" text NOT NULL,
	"alamat_wilayah_ibu" text NOT NULL,
	"nik_pemohon" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "surat_kuasa_skgr" (
	"id" text PRIMARY KEY NOT NULL,
	"yang_diberi_kuasa_nama" text NOT NULL,
	"yang_diberi_kuasa_tempat_lahir" text NOT NULL,
	"yang_diberi_kuasa_tanggal_lahir" timestamp with time zone,
	"yang_diberi_kuasa_pekerjaan" "jenis_pekerjaan" NOT NULL,
	"yang_diberi_kuasa_alamat" text NOT NULL,
	"yang_diberi_kuasa_alamat_wilayah" text NOT NULL,
	"kuasa_untuk" text NOT NULL,
	"kuasa_atas" text NOT NULL,
	"tujuan_kuasa" text NOT NULL,
	"atas_nama" text NOT NULL,
	"no_reg" text NOT NULL,
	"tanggal_surat" timestamp with time zone NOT NULL,
	"lokasi_tanah" text NOT NULL,
	"luas_tanah" text NOT NULL,
	"kuasa_dari_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "surat_pernyataan_belum_menikah" (
	"id" text PRIMARY KEY NOT NULL,
	"pemohon_nik" text NOT NULL,
	"nama_saksi_1" text NOT NULL,
	"hubungan_saksi_1" "shdk" NOT NULL,
	"nama_saksi_2" text,
	"hubungan_saksi_2" "shdk",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "surat_keterangan_kelahiran" ADD CONSTRAINT "surat_keterangan_kelahiran_nik_pemohon_penduduk_id_fk" FOREIGN KEY ("nik_pemohon") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_kuasa_skgr" ADD CONSTRAINT "surat_kuasa_skgr_kuasa_dari_id_penduduk_id_fk" FOREIGN KEY ("kuasa_dari_id") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surat_pernyataan_belum_menikah" ADD CONSTRAINT "surat_pernyataan_belum_menikah_pemohon_nik_penduduk_id_fk" FOREIGN KEY ("pemohon_nik") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;