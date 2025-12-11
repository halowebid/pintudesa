import * as React from "react"

import { DashboardStats } from "@/components/features/dashboard/dashboard-stats"
import { SuratTabs } from "@/components/features/surat/surat-tabs"
import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server"

export default function Page() {
  prefetch(trpc.user.count.queryOptions())
  prefetch(trpc.statistics.getSummary.queryOptions())

  return (
    <HydrateClient>
      <DashboardStats />
      <SuratTabs />
    </HydrateClient>
  )
}
