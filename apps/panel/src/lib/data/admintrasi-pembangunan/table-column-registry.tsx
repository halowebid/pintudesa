import type {
  InsertInventarisHasilPembangunan,
  InsertKaderPemberdayaanMasyarakat,
  InsertKegiatanPembangunan,
  InsertRencanaKerjaPembangunan,
} from "@pintudesa/db"
import { formatDate } from "@pintudesa/utils"
import type { ColumnDef } from "@tanstack/react-table"

export const rencanaKerjaPembangunanColumns: ColumnDef<
  InsertRencanaKerjaPembangunan,
  unknown
>[] = [
  {
    accessorKey: "namaKegiatan",
    header: "Kegiatan",
    cell: ({ getValue, row }) => {
      const kegiatan = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{kegiatan}</span>
          <span className="text-muted-foreground mt-1 line-clamp-1 text-[10px] lg:hidden">
            Lokasi: {data.lokasi}
          </span>
          <span className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px] lg:hidden">
            Tahun: {data.tahunPerencanaan} | Pelaksana: {data.pelaksana}
          </span>
          <span className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px] lg:hidden">
            Dibuat:{" "}
            {data.createdAt ? formatDate(new Date(data.createdAt), "LL") : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "lokasi",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Lokasi</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[160px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "tahunPerencanaan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tahun</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "pelaksana",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Pelaksana</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "jumlah",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Jumlah</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "manfaat",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Manfaat</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "keterangan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan</span>,
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
          {val ? formatDate(new Date(val), "LL") : "-"}
        </span>
      )
    },
  },
]

export const inventarisHasilPembangunanColumns: ColumnDef<
  InsertInventarisHasilPembangunan,
  unknown
>[] = [
  {
    accessorKey: "namaHasilPembangunan",
    header: "Hasil Pembangunan",
    cell: ({ getValue, row }) => {
      const nama = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 text-[10px] lg:hidden">
            Lokasi: {data.lokasi}
          </span>
          <span className="text-muted-foreground text-[10px] lg:hidden">
            Volume: {data.volume} | Biaya: {data.biaya}
          </span>
          <span className="text-muted-foreground mt-0.5 text-[10px] lg:hidden">
            Dibuat:{" "}
            {data.createdAt ? formatDate(new Date(data.createdAt), "LL") : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "lokasi",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Lokasi</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "volume",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Volume</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "biaya",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Biaya</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "keteranganTambahan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>() || "-"}
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
          {val ? formatDate(new Date(val), "LL") : "-"}
        </span>
      )
    },
  },
]

export const kegiatanPembangunanColumns: ColumnDef<
  InsertKegiatanPembangunan,
  unknown
>[] = [
  {
    accessorKey: "namaKegiatan",
    header: "Kegiatan",
    cell: ({ getValue, row }) => {
      const nama = getValue<string>()
      const data = row.original
      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="line-clamp-2 truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 line-clamp-1 text-[10px] lg:hidden">
            Tahun: {data.tahunKegiatan} | Pelaksana: {data.pelaksana}
          </span>
          <span className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px] lg:hidden">
            Jumlah: {data.jumlah}
          </span>
          <span className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px] lg:hidden">
            Dibuat:{" "}
            {data.createdAt ? formatDate(new Date(data.createdAt), "LL") : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tahunKegiatan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Tahun</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "pelaksana",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Pelaksana</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[180px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "jumlah",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Jumlah</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "volume",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Volume</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>() || "-"}</span>
    ),
  },
  {
    accessorKey: "waktuPengerjaan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Waktu</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "baru",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Baru</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>() || "-"}</span>
    ),
  },
  {
    accessorKey: "lanjutan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Lanjutan</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>() || "-"}</span>
    ),
  },
  {
    accessorKey: "keteranganTambahan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>() || "-"}
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
          {val ? formatDate(new Date(val), "LL") : "-"}
        </span>
      )
    },
  },
]
export const kaderPemberdayaanMasyarakatColumns: ColumnDef<
  InsertKaderPemberdayaanMasyarakat,
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
          <span className="truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 text-[10px] lg:hidden">
            Umur: {data.umur} | {data.jenisKelamin}
          </span>
          <span className="text-muted-foreground text-[10px] lg:hidden">
            Bidang: {data.bidang}
          </span>
          <span className="text-muted-foreground mt-0.5 text-[10px] lg:hidden">
            Dibuat:{" "}
            {data.createdAt ? formatDate(new Date(data.createdAt), "LL") : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "umur",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Umur</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "jenisKelamin",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Jenis Kelamin</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "pendidikan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Pendidikan</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "bidang",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Bidang</span>,
    cell: ({ getValue }) => (
      <span className="hidden lg:inline">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "alamat",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Alamat</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "keteranganTambahan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Keterangan</span>,
    cell: ({ getValue }) => (
      <span className="hidden max-w-[200px] truncate lg:inline-block">
        {getValue<string>() || "-"}
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
          {val ? formatDate(new Date(val), "LL") : "-"}
        </span>
      )
    },
  },
]

export const tableColumnRegistry = {
  rencanaKerjaPembangunan: rencanaKerjaPembangunanColumns,
  kegiatanPembangunan: kegiatanPembangunanColumns,
  inventarisHasilPembangunan: inventarisHasilPembangunanColumns,
  kaderPemberdayaanMasyarakat: kaderPemberdayaanMasyarakatColumns,
} as const
