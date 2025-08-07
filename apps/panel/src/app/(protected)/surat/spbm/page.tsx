import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratPernyataanBelumMenikahContent = dynamicFn(async () => {
  const SuratPernyataanBelumMenikahContent = await import("./content")
  return SuratPernyataanBelumMenikahContent
})

export const metadata = {
  title: "Surat Pernyataan Belum Menikah",
}

export default function SuratPernyataanBelumMenikahPage() {
  prefetch(
    trpc.suratPernyataanBelumMenikah.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratPernyataanBelumMenikah.count.queryOptions())

  return <SuratPernyataanBelumMenikahContent />
}
