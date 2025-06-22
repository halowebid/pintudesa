CREATE TABLE "kegiatan_pembangunan" (
	"id" text PRIMARY KEY NOT NULL,
	"tahun_kegiatan" text NOT NULL,
	"volume" text,
	"jumlah" text NOT NULL,
	"waktu_pengerjaan" text NOT NULL,
	"pelaksana" text NOT NULL,
	"baru" text,
	"lanjutan" text,
	"uraian" text NOT NULL,
	"biaya_dari_pemerintah" text NOT NULL,
	"biaya_dari_provinsi" text,
	"biaya_dari_kabupaten" text,
	"biaya_dari_swadaya" text,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
