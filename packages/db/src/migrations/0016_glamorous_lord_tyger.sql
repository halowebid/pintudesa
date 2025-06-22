CREATE TABLE "inventaris_hasil_pembangunan" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_hasil_pembangunan" text NOT NULL,
	"volume" text NOT NULL,
	"biaya" text NOT NULL,
	"lokasi" text NOT NULL,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kader_pemberdayaan_masyarakat" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"umur" text NOT NULL,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"pendidikan" text NOT NULL,
	"bidang" text NOT NULL,
	"alamat" text NOT NULL,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pendudukSementara" RENAME TO "penduduk_sementara";