"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Icon } from "@yopem-ui/react-icons"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTRPC } from "@/lib/trpc/client"

/**
 * DashboardStats component
 *
 * Displays a grid of summary statistics cards for the dashboard.
 * Fetches data using trpc.statistics.getSummary.
 */
export function DashboardStats() {
  const trpc = useTRPC()

  const { data: summary } = useSuspenseQuery(
    trpc.statistics.getSummary.queryOptions(),
  )
  const { data: users } = useSuspenseQuery(trpc.user.count.queryOptions())

  const stats = [
    {
      label: "Penduduk",
      value: summary.totalPenduduk,
      icon: "Users" as const,
    },
    {
      label: "Kartu Keluarga",
      value: summary.totalKK,
      icon: "FileText" as const,
    },
    {
      label: "Pengguna Sistem",
      value: users,
      icon: "Shield" as const,
    },
    {
      label: "Dusun",
      value: summary.totalDusun,
      icon: "MapPin" as const,
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <div className="absolute top-4 right-4">
              <Icon name={stat.icon} className="size-5" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
