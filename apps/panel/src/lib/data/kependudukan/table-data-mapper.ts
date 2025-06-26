import type { SelectPenduduk } from "@pintudesa/db/schema"

import { mapPendudukRow } from "@/lib/utils/mapper"

interface TableKeyMap {
  penduduk: ReturnType<typeof mapPendudukRow>
}

type TableDataMapperRegistry = {
  [K in keyof TableKeyMap]: (data: unknown[]) => TableKeyMap[K]
}

export const tableDataMapperRegistry: TableDataMapperRegistry = {
  penduduk: (data: unknown[]) => mapPendudukRow(data as SelectPenduduk[]),
}
