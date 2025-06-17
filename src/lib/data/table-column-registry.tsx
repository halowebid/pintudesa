import type { ColumnDef } from "@tanstack/react-table"

import type { InsertAgenda } from "@/lib/db/schema/agenda"
import { formatDate } from "@/lib/utils/date"

export const agendaColumns: ColumnDef<InsertAgenda, unknown>[] = [
  {
    accessorKey: "jenisSurat",
    header: "Jenis Surat",
    cell: ({ getValue }) => (
      <span className="max-w-[180px] truncate font-medium">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "uraian",
    header: "Uraian",
    cell: ({ getValue, row }) => {
      const uraian = getValue<string>()
      const surat = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{uraian}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {surat.keteranganTambahan}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            {surat.createdAt && (
              <span>Dibuat: {formatDate(new Date(surat.createdAt), "LL")}</span>
            )}
            {surat.updatedAt && (
              <span>
                Diperbarui: {formatDate(new Date(surat.updatedAt), "LL")}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "keteranganTambahan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan Tambahan</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { isHiddenOnMobile: true }, // tambahkan supaya otomatis hidden di mobile
    header: () => <span className="hidden lg:inline">Created At</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden lg:inline">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Updated At</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden lg:inline">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const tableColumnRegistry = {
  agenda: agendaColumns,
  berita: [
    { header: "Judul", accessorKey: "judul" },
    { header: "Slug", accessorKey: "slug" },
    { header: "Uraian", accessorKey: "uraian" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],
  rab: [
    { header: "Bidang", accessorKey: "bidang" },
    { header: "Waktu Pelaksanaan", accessorKey: "waktuPelaksanaan" },
    { header: "Kegiatan", accessorKey: "kegiatan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],
  peraturan: [
    { header: "Judul", accessorKey: "judul" },
    { header: "Uraian", accessorKey: "uraian" },
    {
      header: "Jenis Peraturan",
      accessorKey: "jenisPeraturan",
      meta: { filterVariant: "select" },
    },
    { header: "No. Ditetapkan", accessorKey: "nomorSuratDitetapkan" },
    {
      header: "Tgl. Ditetapkan",
      accessorKey: "tanggal_surat_ditetapkan",
      meta: { filterVariant: "range" },
    },
    { header: "No. Dilaporkan", accessorKey: "nomorSuratDilaporkan" },
    {
      header: "Tgl. Dilaporkan",
      accessorKey: "tanggalSuratDilaporkan",
      meta: { filterVariant: "range" },
    },
    { header: "No. Diundangkan", accessorKey: "nomorSuratDiundangkan" },
    {
      header: "Tgl. Diundangkan",
      accessorKey: "tanggalSuratDiundangkan",
      meta: { filterVariant: "range" },
    },
    { header: "Keterangan Tambahan", accessorKey: "keteranganTambahan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],

  pendudukSementara: [
    { header: "Nama", accessorKey: "nama" },
    { header: "No. Identitas", accessorKey: "nomorIndentitas" },
    {
      header: "Jenis Kelamin",
      accessorKey: "jenisKelamin",
      meta: { filterVariant: "select" },
    },
    { header: "Tempat Lahir", accessorKey: "tempatLahir" },
    {
      header: "Tanggal Lahir",
      accessorKey: "tanggalLahir",
      meta: { filterVariant: "range" },
    },
    {
      header: "Pekerjaan",
      accessorKey: "pekerjaan",
      meta: { filterVariant: "select" },
    },
    {
      header: "Kebangsaan",
      accessorKey: "kebangsaan",
      meta: { filterVariant: "select" },
    },
    { header: "Keturunan", accessorKey: "keturunan" },
    { header: "Datang Dari", accessorKey: "datangDari" },
    { header: "Tujuan Kedatangan", accessorKey: "tujuanKedatangan" },
    { header: "Nama Yang Didatangi", accessorKey: "namaYangDidatangi" },
    { header: "Alamat Yang Didatangi", accessorKey: "alamatYangDidatangi" },
    {
      header: "Tanggal Datang",
      accessorKey: "tanggalDatang",
      meta: { filterVariant: "range" },
    },
    {
      header: "Tanggal Pergi",
      accessorKey: "tanggalPergi",
      meta: { filterVariant: "range" },
    },
    { header: "Keterangan Tambahan", accessorKey: "keteranganTambahan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],

  lembaran: [
    {
      header: "Jenis Peraturan",
      accessorKey: "jenisPeraturan",
      meta: { filterVariant: "select" },
    },
    { header: "No. Ditetapkan", accessorKey: "nomorDitetapkan" },
    {
      header: "Tgl. Ditetapkan",
      accessorKey: "tanggalDitetapkan",
      meta: { filterVariant: "range" },
    },
    { header: "No. Diundangkan", accessorKey: "nomorDiundangkan" },
    {
      header: "Tgl. Diundangkan",
      accessorKey: "tanggalDiundangkan",
      meta: { filterVariant: "range" },
    },
    { header: "Tentang", accessorKey: "tentang" },
    { header: "Keterangan", accessorKey: "keterangan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],

  inventaris: [
    {
      header: "Jenis Inventaris",
      accessorKey: "jenisInventaris",
      meta: { filterVariant: "select" },
    },
    { header: "Tahun", accessorKey: "tahun", meta: { filterVariant: "range" } },
    {
      header: "Dari Pemerintah",
      accessorKey: "dariPemerintah",
      meta: { filterVariant: "range" },
    },
    {
      header: "Dari Provinsi",
      accessorKey: "dariProvinsi",
      meta: { filterVariant: "range" },
    },
    {
      header: "Dari Kabupaten/Kota",
      accessorKey: "dariKabupatenAtauKota",
      meta: { filterVariant: "range" },
    },
    {
      header: "Dibeli Sendiri",
      accessorKey: "diBeliSendiri",
      meta: { filterVariant: "range" },
    },
    {
      header: "Sumbangan",
      accessorKey: "sumbangan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Keadaan Baik",
      accessorKey: "keadaanBaik",
      meta: { filterVariant: "range" },
    },
    {
      header: "Keadaan Rusak",
      accessorKey: "keadaanRusak",
      meta: { filterVariant: "range" },
    },
    {
      header: "Penghapusan Rusak",
      accessorKey: "penghapusanRusak",
      meta: { filterVariant: "range" },
    },
    {
      header: "Penghapusan Dijual",
      accessorKey: "penghapusanDijual",
      meta: { filterVariant: "range" },
    },
    {
      header: "Penghapusan Hilang",
      accessorKey: "penghapusanHilang",
      meta: { filterVariant: "range" },
    },
    {
      header: "Penghapusan Disumbangkan",
      accessorKey: "penghapusanDisumbangkan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Tanggal Penghapusan",
      accessorKey: "tanggalPenghapusan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Keadaan Baik Akhir Tahun",
      accessorKey: "keadaanBaikAkhirTahun",
      meta: { filterVariant: "range" },
    },
    {
      header: "Keadaan Rusak Akhir Tahun",
      accessorKey: "keadaanRusakAkhirTahun",
      meta: { filterVariant: "range" },
    },
    { header: "Keterangan Tambahan", accessorKey: "keteranganTambahan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],
  ekspedisi: [
    { header: "Nomor Surat", accessorKey: "nomorSurat" },
    {
      header: "Tanggal Surat",
      accessorKey: "tanggalSurat",
      meta: { filterVariant: "range" },
    },
    { header: "Ditujukan", accessorKey: "ditujukan" },
    {
      header: "Tanggal Pengiriman",
      accessorKey: "tanggalPengiriman",
      meta: { filterVariant: "range" },
    },
    { header: "Uraian Surat", accessorKey: "uraianSurat" },
    { header: "Keterangan Tambahan", accessorKey: "keteranganTambahan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],

  tanahKas: [
    { header: "Asal", accessorKey: "asal" },
    { header: "Nomor Sertifikat", accessorKey: "nomorSertifikat" },
    {
      header: "Luas Tanah",
      accessorKey: "luasTanah",
      meta: { filterVariant: "range" },
    },
    { header: "Kelas Tanah", accessorKey: "kelasTanah" },
    {
      header: "Milik Desa",
      accessorKey: "milikDesa",
      meta: { filterVariant: "range" },
    },
    {
      header: "Milik Pemerintah",
      accessorKey: "milikPemerintah",
      meta: { filterVariant: "range" },
    },
    {
      header: "Milik Provinsi",
      accessorKey: "milikProvinsi",
      meta: { filterVariant: "range" },
    },
    {
      header: "Milik Kabupaten/Kota",
      accessorKey: "milikKabupatenAtauKota",
      meta: { filterVariant: "range" },
    },
    {
      header: "Milik Lainnya",
      accessorKey: "milikLainnya",
      meta: { filterVariant: "range" },
    },
    {
      header: "Sawah",
      accessorKey: "tanahSawa",
      meta: { filterVariant: "range" },
    },
    {
      header: "Tegal",
      accessorKey: "tanahTegal",
      meta: { filterVariant: "range" },
    },
    {
      header: "Kebun",
      accessorKey: "tanahKebun",
      meta: { filterVariant: "range" },
    },
    {
      header: "Tambak",
      accessorKey: "tanahTambak",
      meta: { filterVariant: "range" },
    },
    {
      header: "Kering",
      accessorKey: "tanahKering",
      meta: { filterVariant: "range" },
    },
    {
      header: "Patok",
      accessorKey: "tanahPatok",
      meta: { filterVariant: "range" },
    },
    {
      header: "Tidak Patok",
      accessorKey: "tanahTidakPatok",
      meta: { filterVariant: "range" },
    },
    { header: "Lokasi", accessorKey: "lokasi" },
    { header: "Mutasi", accessorKey: "mutasi" },
    { header: "Keterangan Tambahan", accessorKey: "keteranganTambahan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],

  tanah: [
    { header: "Nama Pemilik", accessorKey: "namaPemilik" },
    {
      header: "Total Luas",
      accessorKey: "totalLuas",
      meta: { filterVariant: "range" },
    },
    { header: "Hak Milik", accessorKey: "hakMilik" },
    { header: "Hak Guna Bangunan", accessorKey: "hakGunaBangunan" },
    { header: "Hak Pakai", accessorKey: "hakPakai" },
    { header: "Hak Guna Usaha", accessorKey: "hakGunaUsaha" },
    { header: "Hak Pengelolaan", accessorKey: "hakPengelolaan" },
    { header: "Hak Milik Adat", accessorKey: "hakMilikAdat" },
    { header: "Hak VI Milik Pribumi", accessorKey: "hakVIMilikPribumi" },
    {
      header: "Tanah Negara",
      accessorKey: "tanahNegara",
      meta: { filterVariant: "range" },
    },
    {
      header: "Perumahan",
      accessorKey: "perumahan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Perdagangan & Jasa",
      accessorKey: "perdaganganDanJasa",
      meta: { filterVariant: "range" },
    },
    {
      header: "Perkantoran",
      accessorKey: "perkantoran",
      meta: { filterVariant: "range" },
    },
    {
      header: "Industri",
      accessorKey: "industri",
      meta: { filterVariant: "range" },
    },
    {
      header: "Fasilitas Umum",
      accessorKey: "fasilitasUmum",
      meta: { filterVariant: "range" },
    },
    { header: "Sawah", accessorKey: "sawah", meta: { filterVariant: "range" } },
    {
      header: "Tegalan",
      accessorKey: "tegalan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Perkebunan",
      accessorKey: "perkebunan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Peternakan/Perikanan",
      accessorKey: "peternakanPerikanan",
      meta: { filterVariant: "range" },
    },
    {
      header: "Hutan Belukar",
      accessorKey: "hutanBelukar",
      meta: { filterVariant: "range" },
    },
    {
      header: "Hutan Lebat",
      accessorKey: "hutanLebat",
      meta: { filterVariant: "range" },
    },
    {
      header: "Tanah Kosong",
      accessorKey: "tanahKosong",
      meta: { filterVariant: "range" },
    },
    {
      header: "Lain-lain",
      accessorKey: "lainLain",
      meta: { filterVariant: "range" },
    },
    {
      header: "Mutasi",
      accessorKey: "mutasi",
      meta: { filterVariant: "range" },
    },
    { header: "Keterangan Tambahan", accessorKey: "keteranganTambahan" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],
  users: [
    { header: "Email", accessorKey: "email" },
    { header: "Name", accessorKey: "name" },
    { header: "Username", accessorKey: "username" },
    { header: "Image", accessorKey: "image" },
    { header: "Phone Number", accessorKey: "phoneNumber" },
    { header: "About", accessorKey: "about" },
    { header: "Role", accessorKey: "role", meta: { filterVariant: "select" } },
    {
      header: "Created At",
      accessorKey: "createdAt",
      meta: { filterVariant: "range" },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      meta: { filterVariant: "range" },
    },
  ],
} as const
