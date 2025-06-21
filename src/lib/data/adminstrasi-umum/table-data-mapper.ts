import type { SelectAgenda } from "@/lib/db/schema/agenda"
import type { SelectInventaris } from "@/lib/db/schema/inventaris"
import type { SelectLembaran } from "@/lib/db/schema/lembaran"
import {
  mapAgendaRow,
  mapInventarisRow,
  mapLembaranRow,
} from "@/lib/utils/mapper"

interface TableKeyMap {
  agenda: ReturnType<typeof mapAgendaRow>
  inventaris: ReturnType<typeof mapInventarisRow>
  lembaran: ReturnType<typeof mapLembaranRow>
}

type TableDataMapperRegistry = {
  [K in keyof TableKeyMap]: (data: unknown[]) => TableKeyMap[K]
}

export const tableDataMapperRegistry: TableDataMapperRegistry = {
  agenda: (data: unknown[]) => mapAgendaRow(data as SelectAgenda[]),
  inventaris: (data: unknown[]) => mapInventarisRow(data as SelectInventaris[]),
  lembaran: (data: unknown[]) => mapLembaranRow(data as SelectLembaran[]),
}
