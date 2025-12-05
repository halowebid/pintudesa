CREATE TYPE "public"."jenis_kelamin" AS ENUM('laki-laki', 'perempuan');--> statement-breakpoint
CREATE TYPE "public"."jenis_pekerjaan" AS ENUM('wakil_wali_kota', 'wali_kota', 'tentara_nasional_indonesia', 'sopir', 'psikiater_psikolog', 'pilot', 'pialang', 'perawat', 'perangkat_desa', 'penyiar_televisi', 'penyiar_radio', 'pengacara', 'peneliti', 'pelaut', 'pedagang', 'paranormal', 'notaris', 'lainnya', 'konsultan', 'kepala desa', 'guru', 'dosen', 'dokter', 'biarawati', 'bidan', 'arsitek', 'apoteker', 'anggota_dprd_provinsi', 'anggota_dprd_kabupaten_kota', 'akuntan', 'wiraswasta', 'wakil_bupati', 'bupati', 'wakil_gubernur', 'gubernur', 'duta_besar', 'anggota_kabinet_kementerian', 'anggota_mahkamah konstitusi', 'wakil_presiden', 'presiden', 'anggota_bpk', 'anggota_dpd', 'anggota_dpr-ri', 'promotor_acara', 'juru_masak', 'ustadz_mubaligh', 'wartawan', 'pastor', 'pendeta', 'imam_masjid', 'penterjemah', 'perancang_busana', 'paraji', 'tabib', 'seniman', 'mekanik', 'penata_rambut', 'penata_busana', 'penata_rias', 'tukang_gigi', 'tukang_jahit', 'tukang_las_pandai besi', 'tukang_sol_sepatu', 'tukang_kayu', 'tukang_batu', 'tukang_listrik', 'tukang_cukur', 'pembantu_rumah_tangga', 'buruh_peternakan', 'buruh_nelayan_perikanan', 'buruh_tani_perkebunan', 'buruh_harian_lepas', 'karyawan_honorer', 'karyawan_bumd', 'karyawan_bumn', 'karyawan_swasta', 'transportasi', 'konstruksi', 'industri', 'nelayan_perikanan', 'peternak', 'petani_pekebun', 'perdagangan', 'kepolisian_ri', 'pegawai_negeri_sipil', 'pensiunan', 'pelajar_mahasiswa', 'mengurus_rumah_tangga', 'belum_tidak bekerja');--> statement-breakpoint
CREATE TYPE "public"."kebangsaan" AS ENUM('wni', 'wna');--> statement-breakpoint
CREATE TABLE "pendudukSementara" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"nomor_identitas" text NOT NULL,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"tempat_lahir" text NOT NULL,
	"tanggal_lahir" timestamp NOT NULL,
	"pekerjaan" "jenis_pekerjaan" NOT NULL,
	"kebangsaan" "kebangsaan" NOT NULL,
	"keturunan" text,
	"datang_dari" text NOT NULL,
	"tujuan_kedatangan" text NOT NULL,
	"nama_yang_didatangi" text NOT NULL,
	"alamat_yang_didatangi" text NOT NULL,
	"tanggal_datang" timestamp with time zone NOT NULL,
	"tanggal_pergi" timestamp with time zone,
	"keterangan_tambahan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
