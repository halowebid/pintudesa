CREATE TABLE "lembaran" (
	"id" text PRIMARY KEY NOT NULL,
	"jenis_peraturan" "jenis_peraturan" DEFAULT 'peraturan_desa',
	"nomor_ditetapkan" text NOT NULL,
	"tanggal_ditetapkan" timestamp with time zone NOT NULL,
	"nomor_diundangkan" text NOT NULL,
	"tanggal_diundangkan" timestamp with time zone NOT NULL,
	"tentang" text,
	"keterangan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
