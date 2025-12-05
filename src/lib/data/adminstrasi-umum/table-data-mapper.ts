import type {
  SelectAgenda,
  SelectInventaris,
  SelectLembaran,
  SelectPendudukSementara,
  SelectPeraturan,
} from "@/lib/db/schema"
import {
  mapAgendaRow,
  mapInventarisRow,
  mapLembaranRow,
  mapPendudukSementaraRow,
  mapPeraturanRow,
} from "@/lib/utils/mapper"

interface TableKeyMap {
  agenda: ReturnType<typeof mapAgendaRow>
  inventaris: ReturnType<typeof mapInventarisRow>
  lembaran: ReturnType<typeof mapLembaranRow>
  peraturan: ReturnType<typeof mapPeraturanRow>
  pendudukSementara: ReturnType<typeof mapPendudukSementaraRow>
}

type TableDataMapperRegistry = {
  [K in keyof TableKeyMap]: (data: unknown[]) => TableKeyMap[K]
}

export const tableDataMapperRegistry: TableDataMapperRegistry = {
  agenda: (data: unknown[]) => mapAgendaRow(data as SelectAgenda[]),
  inventaris: (data: unknown[]) => mapInventarisRow(data as SelectInventaris[]),
  lembaran: (data: unknown[]) => mapLembaranRow(data as SelectLembaran[]),
  peraturan: (data: unknown[]) => mapPeraturanRow(data as SelectPeraturan[]),
  pendudukSementara: (data: unknown[]) =>
    mapPendudukSementaraRow(data as SelectPendudukSementara[]),
}
