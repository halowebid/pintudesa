import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"
import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server"

const UserContent = dynamicFn(async () => {
  const UserContent = await import("./content")
  return UserContent
})

export const metadata = {
  title: "User",
}

export default function UserPage() {
  prefetch(
    trpc.user.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.user.count.queryOptions())

  return (
    <HydrateClient>
      <React.Suspense
        fallback={
          <div className="flex w-full flex-col gap-4">
            <Skeleton />
          </div>
        }
      >
        <UserContent />
      </React.Suspense>
    </HydrateClient>
  )
}
