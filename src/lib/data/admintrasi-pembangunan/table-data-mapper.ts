import type { SelectKaderPemberdayaanMasyarakat } from "@/lib/db/schema/kader-pemberdayaan-masyarakat"
import { mapKaderPemberdayaanMasyarakatRow } from "@/lib/utils/mapper"

interface TableKeyMap {
  kaderPemberdayaanMasyarakat: ReturnType<
    typeof mapKaderPemberdayaanMasyarakatRow
  >
}

type TableDataMapperRegistry = {
  [K in keyof TableKeyMap]: (data: unknown[]) => TableKeyMap[K]
}

export const tableDataMapperRegistry: TableDataMapperRegistry = {
  kaderPemberdayaanMasyarakat: (data: unknown[]) =>
    mapKaderPemberdayaanMasyarakatRow(
      data as SelectKaderPemberdayaanMasyarakat[],
    ),
}
