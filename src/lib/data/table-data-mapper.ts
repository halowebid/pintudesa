import { mapAgendaRow, mapInventarisRow } from "@/lib/utils/mapper"
import type { SelectAgenda } from "../db/schema/agenda"
import type { SelectInventaris } from "../db/schema/inventaris"

interface TableKeyMap {
  agenda: ReturnType<typeof mapAgendaRow>
  inventaris: ReturnType<typeof mapInventarisRow>
}

type TableDataMapperRegistry = {
  [K in keyof TableKeyMap]: (data: unknown[]) => TableKeyMap[K]
}

export const tableDataMapperRegistry: TableDataMapperRegistry = {
  agenda: (data: unknown[]) => mapAgendaRow(data as SelectAgenda[]),
  inventaris: (data: unknown[]) => mapInventarisRow(data as SelectInventaris[]),
}
