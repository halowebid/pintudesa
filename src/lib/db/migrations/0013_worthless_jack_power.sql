CREATE TABLE "rencana_kerja_pembangunan" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_kegiatan" text NOT NULL,
	"lokasi" text NOT NULL,
	"tahun_perencanaan" text NOT NULL,
	"jumlah" text NOT NULL,
	"pelaksana" text NOT NULL,
	"manfaat" text NOT NULL,
	"keterangan" text NOT NULL,
	"biaya_dari_pemerintah" text,
	"biaya_dari_provinsi" text,
	"biaya_dari_kabupaten" text,
	"biaya_dari_swadaya" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
