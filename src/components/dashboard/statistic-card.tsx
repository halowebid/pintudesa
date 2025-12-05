"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/lib/ui"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Icon } from "@yopem-ui/react-icons"

import { useTRPC } from "@/lib/trpc/client"

const StatisticCard = () => {
  const trpc = useTRPC()

  const { data: users } = useSuspenseQuery(trpc.user.count.queryOptions())

  if (!users) {
    return <Skeleton />
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* User */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Pengguna</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {users}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="Users" className="size-5" />
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

export default StatisticCard
