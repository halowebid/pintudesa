import * as React from "react"

import StatisticCard from "@/components/statistic-card"
import { SuratTabs } from "@/components/surat-tabs"
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
