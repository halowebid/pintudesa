"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@pintudesa/ui"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Icon } from "@yopem-ui/react-icons"

import { useTRPC } from "@/lib/trpc/client"

const ServerStatus = () => {
  const trpc = useTRPC()

  const { data: status } = useSuspenseQuery(trpc.healthCheck.queryOptions())

  if (!status) {
    return <Skeleton />
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {status}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Icon name="CheckCircle" className="size-5" />
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

export default ServerStatus
