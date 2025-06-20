import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const InventarisContent = dynamicFn(async () => {
  const InventarisContent = await import("./content")
  return InventarisContent
})

export const metadata = {
  title: "Inventaris",
}

export default function InventarisPage() {
  prefetch(
    trpc.inventaris.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.inventaris.count.queryOptions())

  return <InventarisContent />
}
