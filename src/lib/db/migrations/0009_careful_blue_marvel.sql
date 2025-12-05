CREATE TABLE "ekspedisi" (
	"id" text PRIMARY KEY NOT NULL,
	"nomor_surat" text NOT NULL,
	"tanggal_surat" timestamp with time zone NOT NULL,
	"ditujukan" text NOT NULL,
	"tanggal_pengiriman" timestamp with time zone,
	"uraian_surat" text NOT NULL,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
