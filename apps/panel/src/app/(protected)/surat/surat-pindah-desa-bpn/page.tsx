import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratPindahDesaBpnContent = dynamicFn(async () => {
  const SuratPindahDesaBpnContent = await import("./content")
  return SuratPindahDesaBpnContent
})

export const metadata = {
  title: "Surat Pindah Desa BPN",
}

export default function SuratPindahDesaBpnPage() {
  prefetch(
    trpc.suratPindahDesaBpn.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratPindahDesaBpn.count.queryOptions())

  return <SuratPindahDesaBpnContent />
}
