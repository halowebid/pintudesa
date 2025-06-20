import type { ColumnDef } from "@tanstack/react-table"

import { JENIS_SURAT_AGENDA, type InsertAgenda } from "@/lib/db/schema/agenda"
import type { InsertBerita } from "@/lib/db/schema/berita"
import type { InsertEkspedisi } from "@/lib/db/schema/ekspedisi"
import type { InsertInventaris } from "@/lib/db/schema/inventaris"
import type { InsertLembaran } from "@/lib/db/schema/lembaran"
import type { InsertPendudukSementara } from "@/lib/db/schema/penduduk-sementara"
import {
  JENIS_PERATURAN,
  type InsertPeraturan,
} from "@/lib/db/schema/peraturan"
import type { InsertRAB } from "@/lib/db/schema/rab"
import type { SelectTanah } from "@/lib/db/schema/tanah"
import type { SelectTanahKas } from "@/lib/db/schema/tanah-kas"
import { formatDate } from "@/lib/utils/date"
import {
  jenisPeraturanLabelMap,
  jenisSuratAgendaLabelMap,
} from "@/lib/utils/mapper"

export const agendaColumns: ColumnDef<InsertAgenda, unknown>[] = [
  {
    accessorKey: "jenisSurat",
    header: "Jenis Surat",
    meta: {
      filterVariant: "select",
      selectOptions: JENIS_SURAT_AGENDA.map(
        (value) => jenisSuratAgendaLabelMap[value],
      ),
    },
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
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Dibuat</span>,
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
export const beritaColumns: ColumnDef<InsertBerita, unknown>[] = [
  {
    accessorKey: "judul",
    header: "Judul",
    cell: ({ getValue, row }) => {
      const judul = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{judul}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.uraian}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            {data.createdAt && (
              <span>Dibuat: {formatDate(new Date(data.createdAt), "LL")}</span>
            )}
            {data.updatedAt && (
              <span>
                Diperbarui: {formatDate(new Date(data.updatedAt), "LL")}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "uraian",
    header: () => <span className="hidden lg:inline">Uraian</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
export const rabColumns: ColumnDef<InsertRAB, unknown>[] = [
  {
    accessorKey: "bidang",
    header: "Bidang",
    cell: ({ getValue, row }) => {
      const bidang = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{bidang}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.kegiatan}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            {data.createdAt && (
              <span>Dibuat: {formatDate(new Date(data.createdAt), "LL")}</span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "waktuPelaksanaan",
    header: "Waktu Pelaksanaan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "kegiatan",
    header: () => <span className="hidden lg:inline">Kegiatan</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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

export const peraturanColumns: ColumnDef<InsertPeraturan, unknown>[] = [
  {
    accessorKey: "judul",
    header: "Judul",
    cell: ({ getValue, row }) => {
      const judul = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{judul}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.uraian}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            <span>
              Ditetapkan:{" "}
              {formatDate(new Date(data.tanggal_surat_ditetapkan), "LL")}
            </span>
            {data.tanggalSuratDiundangkan && (
              <span>
                Diundangkan:{" "}
                {formatDate(new Date(data.tanggalSuratDiundangkan), "LL")}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "jenisPeraturan",
    header: "Jenis Peraturan",
    meta: { filterVariant: "select", isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "nomorSuratDitetapkan",
    header: "No. Ditetapkan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggal_surat_ditetapkan",
    header: "Tgl. Ditetapkan",
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
    accessorKey: "nomorSuratDilaporkan",
    header: "No. Dilaporkan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggalSuratDilaporkan",
    header: "Tgl. Dilaporkan",
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
    accessorKey: "nomorSuratDiundangkan",
    header: "No. Diundangkan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggalSuratDiundangkan",
    header: "Tgl. Diundangkan",
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
    accessorKey: "keteranganTambahan",
    header: () => <span className="hidden lg:inline">Keterangan Tambahan</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
export const pendudukSementaraColumns: ColumnDef<
  InsertPendudukSementara,
  unknown
>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ getValue, row }) => {
      const nama = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.nomorIndentitas}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            <span>
              Datang: {formatDate(new Date(data.tanggalDatang), "LL")}
            </span>
            {data.tanggalPergi && (
              <span>
                Pergi: {formatDate(new Date(data.tanggalPergi), "LL")}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "nomorIndentitas",
    header: "No. Identitas",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "jenisKelamin",
    header: "Jenis Kelamin",
    meta: { filterVariant: "select", isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tempatLahir",
    header: "Tempat Lahir",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggalLahir",
    header: "Tanggal Lahir",
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
    accessorKey: "pekerjaan",
    header: "Pekerjaan",
    meta: { filterVariant: "select", isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "kebangsaan",
    header: "Kebangsaan",
    meta: { filterVariant: "select", isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "keturunan",
    header: "Keturunan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "datangDari",
    header: "Datang Dari",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tujuanKedatangan",
    header: "Tujuan Kedatangan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "namaYangDidatangi",
    header: "Nama Yang Didatangi",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "alamatYangDidatangi",
    header: "Alamat Yang Didatangi",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggalDatang",
    header: "Tanggal Datang",
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
    accessorKey: "tanggalPergi",
    header: "Tanggal Pergi",
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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
    accessorKey: "keteranganTambahan",
    header: () => <span className="hidden lg:inline">Keterangan Tambahan</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="hidden lg:inline">Dibuat</span>,
    meta: { filterVariant: "range", isHiddenOnMobile: true },
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

export const lembaranColumns: ColumnDef<InsertLembaran, unknown>[] = [
  {
    accessorKey: "jenisPeraturan",
    header: "Jenis Peraturan",
    meta: {
      filterVariant: "select",
      selectOptions: JENIS_PERATURAN.map(
        (value) => jenisPeraturanLabelMap[value],
      ),
    },

    cell: ({ getValue, row }) => {
      const jenisPeraturan = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">
            {jenisPeraturan}
          </span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.keterangan}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            <span>
              Ditetapkan: {formatDate(new Date(data.tanggalDitetapkan), "LL")}
            </span>
            <span>
              Diundangkan: {formatDate(new Date(data.tanggalDiundangkan), "LL")}
            </span>
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "nomorDitetapkan",
    header: "No. Ditetapkan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggalDitetapkan",
    header: "Tgl. Ditetapkan",
    meta: { isHiddenOnMobile: true },
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
    accessorKey: "nomorDiundangkan",
    header: "No. Diundangkan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "tanggalDiundangkan",
    header: "Tgl. Diundangkan",
    meta: { isHiddenOnMobile: true },
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
    accessorKey: "tentang",
    header: "Tentang",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="line-clamp-3 hidden max-w-[inherit] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "keterangan",
    header: () => <span className="hidden lg:inline">Keterangan</span>,
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="line-clamp-3 hidden max-w-[inherit] truncate lg:inline-block">
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
        <span className="hidden lg:inline">
          {formatDate(new Date(val), "LL")}
        </span>
      )
    },
  },
]

export const inventarisColumns: ColumnDef<InsertInventaris, unknown>[] = [
  {
    accessorKey: "jenisInventaris",
    header: "Jenis Inventaris",
    cell: ({ getValue, row }) => {
      const jenis = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[220px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{jenis}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.keteranganTambahan}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            {data.createdAt && (
              <span>
                Dibuat: {new Date(data.createdAt).toLocaleDateString()}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tahun",
    header: "Tahun",
    cell: ({ getValue }) => <span>{getValue<number>()}</span>,
  },
  {
    accessorKey: "keteranganTambahan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan Tambahan</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline">
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
        <span className="hidden lg:inline">
          {val ? new Date(val).toLocaleDateString() : ""}
        </span>
      )
    },
  },
]

export const ekspedisiColumns: ColumnDef<InsertEkspedisi, unknown>[] = [
  {
    accessorKey: "nomorSurat",
    header: "Nomor Surat",
    cell: ({ getValue, row }) => {
      const nomor = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[220px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{nomor}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.keteranganTambahan}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            {data.createdAt && (
              <span>
                Dibuat: {new Date(data.createdAt).toLocaleDateString()}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tanggalSurat",
    header: "Tanggal Surat",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden lg:inline">
          {val ? new Date(val).toLocaleDateString() : ""}
        </span>
      )
    },
  },
  {
    accessorKey: "ditujukan",
    header: "Ditujukan",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "tanggalPengiriman",
    header: "Tanggal Pengiriman",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden lg:inline">
          {val ? new Date(val).toLocaleDateString() : ""}
        </span>
      )
    },
  },
  {
    accessorKey: "uraianSurat",
    header: "Uraian Surat",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[240px] truncate lg:inline">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "keteranganTambahan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan Tambahan</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline">
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
        <span className="hidden lg:inline">
          {val ? new Date(val).toLocaleDateString() : ""}
        </span>
      )
    },
  },
]

export const tanahKasColumns: ColumnDef<SelectTanahKas, unknown>[] = [
  {
    accessorKey: "asal",
    header: "Asal",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "nomorSertifikat",
    header: "Nomor Sertifikat",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "luasTanah",
    header: "Luas Tanah",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "kelasTanah",
    header: "Kelas Tanah",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "milikDesa",
    header: "Milik Desa",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "milikPemerintah",
    header: "Milik Pemerintah",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "milikProvinsi",
    header: "Milik Provinsi",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "milikKabupatenAtauKota",
    header: "Milik Kabupaten/Kota",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "milikLainnya",
    header: "Milik Lainnya",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahSawa",
    header: "Sawah",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahTegal",
    header: "Tegal",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahKebun",
    header: "Kebun",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahTambak",
    header: "Tambak",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahKering",
    header: "Kering",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahPatok",
    header: "Patok",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "tanahTidakPatok",
    header: "Tidak Patok",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[240px] truncate lg:inline">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "mutasi",
    header: "Mutasi",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "keteranganTambahan",
    header: "Keterangan Tambahan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden lg:inline">
          {val ? new Date(val).toLocaleDateString() : ""}
        </span>
      )
    },
  },
]

export const tanahColumns: ColumnDef<SelectTanah, unknown>[] = [
  {
    accessorKey: "namaPemilik",
    header: "Nama Pemilik",
    cell: ({ getValue, row }) => {
      const nama = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 line-clamp-2 truncate text-[10px] lg:hidden">
            {data.keteranganTambahan}
          </span>
          <span className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-[10px] lg:hidden">
            {data.createdAt && (
              <span>Dibuat: {formatDate(new Date(data.createdAt), "LL")}</span>
            )}
            {data.updatedAt && (
              <span>
                Diperbarui: {formatDate(new Date(data.updatedAt), "LL")}
              </span>
            )}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalLuas",
    header: "Total Luas",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "hakMilik",
    header: "Hak Milik",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hakGunaBangunan",
    header: "Hak Guna Bangunan",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hakPakai",
    header: "Hak Pakai",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hakGunaUsaha",
    header: "Hak Guna Usaha",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hakPengelolaan",
    header: "Hak Pengelolaan",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hakMilikAdat",
    header: "Hak Milik Adat",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hakVIMilikPribumi",
    header: "Hak VI Milik Pribumi",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "tanahNegara",
    header: "Tanah Negara",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "perumahan",
    header: "Perumahan",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "perdaganganDanJasa",
    header: "Perdagangan & Jasa",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "perkantoran",
    header: "Perkantoran",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "industri",
    header: "Industri",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "fasilitasUmum",
    header: "Fasilitas Umum",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "sawah",
    header: "Sawah",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "tegalan",
    header: "Tegalan",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "perkebunan",
    header: "Perkebunan",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "peternakanPerikanan",
    header: "Peternakan/Perikanan",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hutanBelukar",
    header: "Hutan Belukar",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "hutanLebat",
    header: "Hutan Lebat",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "tanahKosong",
    header: "Tanah Kosong",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "lainLain",
    header: "Lain-lain",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "mutasi",
    header: "Mutasi",
    meta: { isHiddenOnMobile: true },
  },
  {
    accessorKey: "keteranganTambahan",
    header: "Keterangan Tambahan",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    meta: { isHiddenOnMobile: true },
    cell: ({ getValue }) => {
      const val = getValue<string | Date>()
      return (
        <span className="hidden lg:inline">
          {val ? new Date(val).toLocaleDateString() : ""}
        </span>
      )
    },
  },
]

export const tableColumnRegistry = {
  agenda: agendaColumns,
  berita: beritaColumns,
  rab: rabColumns,
  peraturan: peraturanColumns,

  pendudukSementara: pendudukSementaraColumns,

  lembaran: lembaranColumns,

  inventaris: inventarisColumns,
  ekspedisi: ekspedisiColumns,

  tanahKas: tanahKasColumns,

  tanah: tanahColumns,
  users: [
    { header: "Email", accessorKey: "email" },
    { header: "Name", accessorKey: "name" },
    { header: "Username", accessorKey: "username" },
    { header: "Image", accessorKey: "image" },
    { header: "Phone Number", accessorKey: "phoneNumber" },
    { header: "About", accessorKey: "about" },
    { header: "Role", accessorKey: "role", meta: { filterVariant: "select" } },
    {
      header: "Dibuat",
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
