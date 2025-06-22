import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const RABContent = dynamicFn(async () => {
  const RABContent = await import("./content")
  return RABContent
})

export const metadata = {
  title: "Buku Rencana Anggaran Biaya",
}

export default function RABPage() {
  prefetch(
    trpc.rab.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.rab.count.queryOptions())

  return <RABContent />
}
