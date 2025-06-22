CREATE TYPE "public"."jenis_inventaris" AS ENUM('barang', 'bangunan');--> statement-breakpoint
ALTER TYPE "public"."jenis_peraturan_desa" RENAME TO "jenis_peraturan";--> statement-breakpoint
CREATE TABLE "inventaris" (
	"id" text PRIMARY KEY NOT NULL,
	"jenis_inventaris" "jenis_inventaris" DEFAULT 'barang' NOT NULL,
	"tahun" integer NOT NULL,
	"dari_pemerintah" integer,
	"dari_provinsi" integer,
	"dari_kabupaten_atau_kota" integer,
	"dibeli_sendiri" integer,
	"sumbangan" integer,
	"keadaan_baik" integer,
	"keadaan_rusak" integer,
	"penghapusan_rusak" integer,
	"penghapusan_dijual" integer,
	"penghapusan_hilang" integer,
	"penghapusan_disumbangkan" integer,
	"tanggal_penghapusan" timestamp with time zone,
	"keadaan_baik_akhir_tahun" integer,
	"keadaan_rusak_akhir_tahun" integer,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "peraturan_desa" RENAME TO "peraturan";