import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKuasaSKGRContent = dynamicFn(async () => {
  const SuratKuasaSKGRContent = await import("./content")
  return SuratKuasaSKGRContent
})

export const metadata = {
  title: "Surat Kuasa SKGR",
}

export default function SuratKuasaSKGRPage() {
  prefetch(
    trpc.suratKuasaSKGR.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKuasaSKGR.count.queryOptions())

  return <SuratKuasaSKGRContent />
}
