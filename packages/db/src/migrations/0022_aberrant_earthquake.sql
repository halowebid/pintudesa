CREATE TABLE "surat_keterangan_kematian" (
	"id" text PRIMARY KEY NOT NULL,
	"tanggal_meninggal" timestamp with time zone NOT NULL,
	"lokasi_meninggal" text NOT NULL,
	"sebab_meninggal" text,
	"lokasi_pemakaman" text NOT NULL,
	"tanggal_pemakaman" timestamp with time zone,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
