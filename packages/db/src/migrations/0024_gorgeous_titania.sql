CREATE TABLE "keputusan_kepala_desa" (
	"id" text PRIMARY KEY NOT NULL,
	"nomor_surat" text NOT NULL,
	"tanggal_surat" timestamp with time zone NOT NULL,
	"judul" text NOT NULL,
	"uraian" text NOT NULL,
	"nomor_laporan" text NOT NULL,
	"tanggal_laporan" timestamp with time zone NOT NULL,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
