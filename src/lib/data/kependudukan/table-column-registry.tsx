import { type ColumnDef } from "@tanstack/react-table"

import { type SelectKartuKeluarga, type SelectPenduduk } from "@/lib/db/schema"
import { formatDate } from "@/lib/utils"
import {
  jenisKelaminLabelMap,
  pendidikanTerakhirLabelMap,
} from "@/lib/utils/mapper"

export const kartuKeluargaColumns: ColumnDef<SelectKartuKeluarga, unknown>[] = [
  {
    accessorKey: "nomorKartuKeluarga",
    header: "No. KK",
    cell: ({ getValue, row }) => {
      const noKK = getValue<string>()
      const data = row.original

      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{noKK}</span>

          <span className="text-muted-foreground mt-1 text-[10px] lg:hidden">
            Alamat: {data.alamat}
          </span>
          <span className="text-muted-foreground text-[10px] lg:hidden">
            {data.desa_kelurahan}, {data.kecamatan}
          </span>
          <span className="text-muted-foreground text-[10px] lg:hidden">
            RT/RW: {data.rt}/{data.rw}
          </span>
          <span className="text-muted-foreground mt-0.5 text-[10px] lg:hidden">
            Dibuat: {formatDate(data.createdAt, "LL")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "alamat",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Alamat</span>,
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
        <span className="hidden lg:inline">
          {val ? formatDate(val, "LL") : "-"}
        </span>
      )
    },
  },
]

export const pendudukColumns: ColumnDef<SelectPenduduk, unknown>[] = [
  {
    accessorKey: "namaLengkap",
    header: "Nama",
    cell: ({ getValue, row }) => {
      const nama = getValue<string>()
      const data = row.original
      const hasNik = Boolean(data.nik)

      return (
        <div className="flex max-w-[240px] flex-col">
          <span className="truncate font-medium">{nama}</span>
          <span className="text-muted-foreground mt-1 text-[10px] lg:hidden">
            NIK:{" "}
            {hasNik ? (
              data.nik
            ) : (
              <span className="font-semibold text-red-500">Tidak Ada</span>
            )}
          </span>
          <span className="text-muted-foreground text-[10px] lg:hidden">
            {jenisKelaminLabelMap[data.jenisKelamin]} |{" "}
            {pendidikanTerakhirLabelMap[data.pendidikanTerakhir]}
          </span>
          <span className="text-muted-foreground mt-0.5 text-[10px] lg:hidden">
            Lahir: {formatDate(data.tanggalLahir, "LL")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "nik",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">NIK</span>,
    cell: ({ getValue }) => {
      const nik = getValue<string>()
      return (
        <span
          className={`hidden lg:inline ${
            nik ? "" : "text-destructive/80 font-semibold"
          }`}
        >
          {nik || "Tidak Ada"}
        </span>
      )
    },
  },
  {
    accessorKey: "jenisKelamin",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Jenis Kelamin</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "pendidikanTerakhir",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Pendidikan</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "agama",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Agama</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "statusPerkawinan",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Status Kawin</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "alamat",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Alamat</span>,
    cell: ({ getValue }) => (
      <span className="hidden text-ellipsis lg:line-clamp-2">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "asalPenduduk",
    meta: { isHiddenOnMobile: true },
    header: () => <span className="hidden lg:inline">Asal</span>,
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
        <span className="hidden lg:inline">
          {val ? formatDate(val, "LL") : "-"}
        </span>
      )
    },
  },
]

export const tableColumnRegistry = {
  penduduk: pendudukColumns,
  kartuKeluarga: kartuKeluargaColumns,
} as const
