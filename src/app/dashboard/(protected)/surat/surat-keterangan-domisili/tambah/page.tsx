import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const SuratKeteranganDomisiliForm = dynamicFn(async () => {
  const SuratKeteranganDomisiliForm = await import("./form")
  return SuratKeteranganDomisiliForm
})

export const metadata: Metadata = {
  title: "Buat Surat Keterangan Domisili",
}

export default function SuratKeteranganDomisiliPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganDomisiliForm isDialog={false} />
    </React.Suspense>
  )
}
