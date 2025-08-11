import {
  type InsertSuratIzinKeramaian,
  type InsertSuratKeteranganDomisili,
  type InsertSuratKeteranganKelahiran,
  type InsertSuratKeteranganKematian,
  type InsertSuratKuasaAhliWaris,
  type InsertSuratKuasaSKGR,
  type InsertSuratPengantarSKCK,
  type InsertSuratPernyataanBelumMenikah,
  type SelectPenduduk,
} from "@pintudesa/db/schema"
import { formatDate } from "@pintudesa/utils"
import { type ColumnDef } from "@tanstack/react-table"

interface SuratIzinKeramaianColumns extends InsertSuratIzinKeramaian {
  pemohon: SelectPenduduk
}

export const suratIzinKeramaianColumns: ColumnDef<
  SuratIzinKeramaianColumns,
  unknown
>[] = [
  {
    accessorKey: "pemohon",
    header: "Nama",
    cell: ({ row }) => {
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">
            {data.pemohon.namaLengkap}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tujuanPembuatan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tujuan Pembuatan</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "waktuAcara",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Waktu Acara</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LLL")}
        </span>
      )
    },
  },
  {
    accessorKey: "waktuSelesai",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Waktu Selesai</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LLL")}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Diubah</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const suratKeteranganKelahiranColumns: ColumnDef<
  InsertSuratKeteranganKelahiran,
  unknown
>[] = [
  {
    accessorKey: "namaAnak",
    header: "Nama Anak",
    cell: ({ getValue, row }) => {
      const nama = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 text-[10px] lg:hidden">
            {data.jenisKelaminAnak} | {data.tempatLahirAnak}
          </span>
          <span className="text-muted-foreground text-[10px] lg:hidden">
            Tanggal Lahir:{" "}
            {data.tanggalLahirAnak
              ? formatDate(new Date(data.tanggalLahirAnak), "LL")
              : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "jenisKelaminAnak",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Jenis Kelamin</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "tempatLahirAnak",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tempat Lahir Anak</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "tanggalLahirAnak",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tanggal Lahir Anak</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "namaAyah",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Nama Ayah</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "namaIbu",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Nama Ibu</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "nikPemohon",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">NIK Pemohon</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const suratKeteranganKematianColumns: ColumnDef<
  InsertSuratKeteranganKematian,
  unknown
>[] = [
  {
    accessorKey: "nik",
    header: "NIK Penduduk",
    cell: ({ getValue }) => {
      const nik = getValue<string>()
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{nik}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "tanggalMeninggal",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tanggal Meninggal</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "lokasiMeninggal",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Lokasi Meninggal</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "sebabMeninggal",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Sebab Meninggal</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "lokasiPemakaman",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Lokasi Pemakaman</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "tanggalPemakaman",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tanggal Pemakaman</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Diperbarui</span>,
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const suratKuasaSKGRColumns: ColumnDef<InsertSuratKuasaSKGR, unknown>[] =
  [
    {
      accessorKey: "yangDiberiKuasaNama",
      header: "Penerima Kuasa",
      cell: ({ getValue, row }) => {
        const nama = getValue<string>()
        const data = row.original
        return (
          <div className="flex max-w-[240px] flex-col">
            <span className="truncate font-medium">{nama}</span>
            <span className="text-muted-foreground mt-1 text-[10px] lg:hidden">
              {data.yangDiberiKuasaTempatLahir},{" "}
              {data.yangDiberiKuasaTanggalLahir
                ? formatDate(new Date(data.yangDiberiKuasaTanggalLahir), "LL")
                : "-"}
            </span>
            <span className="text-muted-foreground text-[10px] lg:hidden">
              {data.yangDiberiKuasaAlamat}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "yangDiberiKuasaPekerjaan",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Pekerjaan</span>,
      cell: ({ getValue }) => (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "kuasaUntuk",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Kuasa Untuk</span>,
      cell: ({ getValue }) => (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "kuasaAtas",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Kuasa Atas</span>,
      cell: ({ getValue }) => (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "tujuanKuasa",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Tujuan Kuasa</span>,
      cell: ({ getValue }) => (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "lokasiTanah",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Lokasi Tanah</span>,
      cell: ({ getValue }) => (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "luasTanah",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Luas Tanah</span>,
      cell: ({ getValue }) => (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "tanggalSurat",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Tanggal Surat</span>,
      cell: ({ getValue }) => {
        const val = getValue<string | Date>()
        return (
          <span className="hidden text-ellipsis lg:line-clamp-2">
            {formatDate(new Date(val), "LL")}
          </span>
        )
      },
    },
    {
      accessorKey: "createdAt",
      meta: { isHiddenOnMobile: true },
      header: () => <span className="hidden lg:inline">Dibuat</span>,
      cell: ({ getValue }) => {
        const val = getValue<string | Date>()
        return (
          <span className="hidden text-ellipsis lg:line-clamp-2">
            {formatDate(new Date(val), "LL")}
          </span>
        )
      },
    },
  ]

export const suratPengantarSKCKColumns: ColumnDef<
  InsertSuratPengantarSKCK,
  unknown
>[] = [
  {
    accessorKey: "pemohonNIK",
    header: "NIK Pemohon",
    cell: ({ getValue }) => {
      const nik = getValue<string>()
      return <span className="font-medium">{nik}</span>
    },
  },
  {
    accessorKey: "tujuanPembuatan",
    header: () => <span className="hidden lg:inline">Tujuan Pembuatan</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const suratKeteranganDomisiliColumns: ColumnDef<
  InsertSuratKeteranganDomisili,
  unknown
>[] = [
  {
    accessorKey: "pemohonNIK",
    header: "NIK Pemohon",
    cell: ({ getValue }) => {
      const nik = getValue<string>()
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{nik}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "jumlahTahunDomisili",
    header: () => (
      <span className="hidden lg:inline">Jumlah Tahun Domisili</span>
    ),
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <span className="hidden lg:inline">Diubah</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const suratKuasaAhliWarisColumns: ColumnDef<
  InsertSuratKuasaAhliWaris,
  unknown
>[] = [
  {
    accessorKey: "pemohonNIK",
    header: "NIK Pemohon",
    cell: ({ getValue }) => {
      const nik = getValue<string>()
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{nik}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "yangDiberiKuasaNama",
    header: () => (
      <span className="hidden lg:inline">Nama yang Diberi Kuasa</span>
    ),
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "yangMeninggalNIK",
    header: () => <span className="hidden lg:inline">NIK yang Meninggal</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "tanggalMeninggal",
    header: () => <span className="hidden lg:inline">Tanggal Meninggal</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "lokasiMeninggal",
    header: () => <span className="hidden lg:inline">Lokasi Meninggal</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <span className="hidden lg:inline">Diubah</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const suratPernyataanBelumMenikahColumns: ColumnDef<
  InsertSuratPernyataanBelumMenikah,
  unknown
>[] = [
  {
    accessorKey: "pemohonNIK",
    header: "NIK Pemohon",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "namaSaksi1",
    header: () => <span className="hidden lg:inline">Nama Saksi 1</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "hubunganSaksi1",
    header: () => <span className="hidden lg:inline">Hubungan Saksi 1</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "namaSaksi2",
    header: () => <span className="hidden lg:inline">Nama Saksi 2</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | null>()
      return <span className="hidden text-ellipsis lg:line-clamp-2">{val}</span>
    },
  },
  {
    accessorKey: "hubunganSaksi2",
    header: () => <span className="hidden lg:inline">Hubungan Saksi 2</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | null>()
      return <span className="hidden text-ellipsis lg:line-clamp-2">{val}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden text-ellipsis lg:line-clamp-2">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const tableColumnRegistry = {
  suratIzinKeramaian: suratIzinKeramaianColumns,
  suratKeteranganKelahiran: suratKeteranganKelahiranColumns,
  suratKeteranganKematian: suratKeteranganKematianColumns,
  suratKeteranganDomisili: suratKeteranganDomisiliColumns,
  suratKuasaAhliWaris: suratKuasaAhliWarisColumns,
  suratKuasaSKGR: suratKuasaSKGRColumns,
  suratPengantarSKCK: suratPengantarSKCKColumns,
  suratPernyataanBelumMenikah: suratPernyataanBelumMenikahColumns,
} as const
