CREATE TYPE "public"."shdk" AS ENUM('suami', 'pembantu', 'orangtua', 'mertua', 'menantu', 'kepala_keluarga', 'istri', 'cucu', 'anak', 'lainnya');--> statement-breakpoint
CREATE TYPE "public"."agama" AS ENUM('islam', 'kristen', 'katolik', 'hindu', 'budha', 'konghucu', 'penghayat_kepercayaan');--> statement-breakpoint
CREATE TYPE "public"."asal_penduduk" AS ENUM('penduduk_desa', 'penduduk_luar_desa');--> statement-breakpoint
CREATE TYPE "public"."pendidikan_terakhir" AS ENUM('tidak_atau_belum_sekolah', 'belum_tamat_sd', 'sd', 'sltp', 'slta', 'd1_d2', 'akademi_d3_s_muda', 's1_d4', 's2', 's3');--> statement-breakpoint
CREATE TYPE "public"."status_domisili" AS ENUM('ktp_beralamat_di_desa_berdomisili_di_desa', 'ktp_beralamat_di_luar_desa_berdomisili_di_desa', 'ktp_beralamat_di_desa_berdomisili_di_luar_desa', 'ktp_beralamat_di_luar_desa_berdomisili_di_luar_desa', 'tidak_domisili');--> statement-breakpoint
CREATE TYPE "public"."status_penduduk" AS ENUM('hidup', 'meninggal', 'tidak_aktif');--> statement-breakpoint
CREATE TYPE "public"."status_perkawinan" AS ENUM('belum_kawin', 'kawin_tercatat', 'kawin_belum_tercatat', 'cerai_hidup', 'cerai_mati');--> statement-breakpoint
CREATE TABLE "anggota_keluarga" (
	"id" text PRIMARY KEY NOT NULL,
	"kartu_keluarga_id" text NOT NULL,
	"penduduk_id" text NOT NULL,
	"shdk" "shdk" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kartu_keluarga" (
	"id" text PRIMARY KEY NOT NULL,
	"kategori_penduduk" "kategori_penduduk" DEFAULT 'penduduk_dalam_desa',
	"nomor_kartu_keluarga" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "penduduk" (
	"id" text PRIMARY KEY NOT NULL,
	"asal_penduduk" "asal_penduduk" DEFAULT 'penduduk_desa',
	"provinsi" text NOT NULL,
	"kabupaten_kota" text NOT NULL,
	"kecamatan" text NOT NULL,
	"desa_kelurahan" text NOT NULL,
	"dusun" text,
	"rt" text NOT NULL,
	"rw" text NOT NULL,
	"alamat" text NOT NULL,
	"nik" text NOT NULL,
	"nama_lengkap" text NOT NULL,
	"agama" "agama" NOT NULL,
	"pendidikan_terakhir" "pendidikan_terakhir" NOT NULL,
	"pekerjaan" "jenis_pekerjaan" NOT NULL,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"tempat_lahir" text NOT NULL,
	"tanggal_lahir" timestamp with time zone NOT NULL,
	"status_perkawinan" "status_perkawinan" NOT NULL,
	"status_domisili" "status_domisili" NOT NULL,
	"nama_ayah_kandung" text NOT NULL,
	"nama_ibu_kandung" text NOT NULL,
	"status_penduduk" "status_penduduk" DEFAULT 'hidup',
	"bantuan_sosial" boolean DEFAULT false NOT NULL,
	"disabilitas" boolean DEFAULT false NOT NULL,
	"kartu_keluarga_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "anggota_keluarga" ADD CONSTRAINT "anggota_keluarga_kartu_keluarga_id_kartu_keluarga_id_fk" FOREIGN KEY ("kartu_keluarga_id") REFERENCES "public"."kartu_keluarga"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anggota_keluarga" ADD CONSTRAINT "anggota_keluarga_penduduk_id_penduduk_id_fk" FOREIGN KEY ("penduduk_id") REFERENCES "public"."penduduk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penduduk" ADD CONSTRAINT "penduduk_kartu_keluarga_id_kartu_keluarga_id_fk" FOREIGN KEY ("kartu_keluarga_id") REFERENCES "public"."kartu_keluarga"("id") ON DELETE cascade ON UPDATE no action;