import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const KaderPemberdayaanMasyarakatContent = dynamicFn(async () => {
  const KaderPemberdayaanMasyarakatContent = await import("./content")
  return KaderPemberdayaanMasyarakatContent
})

export const metadata = {
  title: "Kader Pemberdayaan Masyarakat",
}

export default function KaderPemberdayaanMasyarakatPage() {
  prefetch(
    trpc.kaderPemberdayaanMasyarakat.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.kaderPemberdayaanMasyarakat.count.queryOptions())

  return <KaderPemberdayaanMasyarakatContent />
}
