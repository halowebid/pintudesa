import * as React from "react"
import dynamicFn from "next/dynamic"

import { prefetch, trpc } from "@/lib/trpc/server"

const SuratKeteranganKelahiranContent = dynamicFn(async () => {
  const SuratKeteranganKelahiranContent = await import("./content")
  return SuratKeteranganKelahiranContent
})

export const metadata = {
  title: "Surat Keterangan Kelahiran",
}

export default function SuratKeteranganKelahiranPage() {
  prefetch(
    trpc.suratKeteranganKelahiran.all.queryOptions({
      page: 1,
      perPage: 10,
    }),
  )

  prefetch(trpc.suratKeteranganKelahiran.count.queryOptions())

  return <SuratKeteranganKelahiranContent />
}
