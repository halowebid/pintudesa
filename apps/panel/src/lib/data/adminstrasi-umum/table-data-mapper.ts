import type {
  SelectAgenda,
  SelectInventaris,
  SelectLembaran,
  SelectPeraturan,
} from "@pintudesa/db/schema"

import {
  mapAgendaRow,
  mapInventarisRow,
  mapLembaranRow,
  mapPeraturanRow,
} from "@/lib/utils/mapper"

interface TableKeyMap {
  agenda: ReturnType<typeof mapAgendaRow>
  inventaris: ReturnType<typeof mapInventarisRow>
  lembaran: ReturnType<typeof mapLembaranRow>
  peraturan: ReturnType<typeof mapPeraturanRow>
}

type TableDataMapperRegistry = {
  [K in keyof TableKeyMap]: (data: unknown[]) => TableKeyMap[K]
}

export const tableDataMapperRegistry: TableDataMapperRegistry = {
  agenda: (data: unknown[]) => mapAgendaRow(data as SelectAgenda[]),
  inventaris: (data: unknown[]) => mapInventarisRow(data as SelectInventaris[]),
  lembaran: (data: unknown[]) => mapLembaranRow(data as SelectLembaran[]),
  peraturan: (data: unknown[]) => mapPeraturanRow(data as SelectPeraturan[]),
}
