import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratKeteranganDomisiliForm = dynamicFn(async () => {
  const SuratKeteranganDomisiliForm = await import("../tambah/form")
  return SuratKeteranganDomisiliForm
})

export default function SuratKeteranganDomisiliDialog() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganDomisiliForm isDialog={true} />
    </React.Suspense>
  )
}
