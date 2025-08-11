import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratKeteranganDomisiliForm = dynamicFn(async () => {
  const SuratKeteranganDomisiliForm = await import("./form")
  return SuratKeteranganDomisiliForm
})

export const metadata: Metadata = {
  title: "Edit Surat Keterangan Domisili",
}

export default function SuratKeteranganDomisiliEditPage() {
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
