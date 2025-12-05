import * as React from "react"

import { SuratTabs } from "@/components/features/surat/surat-tabs"
import StatisticCard from "@/components/ui/statistic-card"
import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server"

export default function Page() {
  prefetch(trpc.user.count.queryOptions())

  return (
    <HydrateClient>
      <StatisticCard />
      <SuratTabs />
    </HydrateClient>
  )
}
