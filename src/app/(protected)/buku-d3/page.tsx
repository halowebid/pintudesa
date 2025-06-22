import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const InventarisHasilPembangunanContent = dynamicFn(async () => {
  const InventarisHasilPembangunanContent = await import("./content")
  return InventarisHasilPembangunanContent
})

export const metadata = {
  title: "Buku Inventaris Hasil Pembangunan",
}

export default function InventarisHasilPembangunanPage() {
  prefetch(
    trpc.inventarisHasilPembangunan.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.inventarisHasilPembangunan.count.queryOptions())

  return <InventarisHasilPembangunanContent />
}
