import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratKeteranganKematianForm = dynamicFn(async () => {
  const SuratKeteranganKematianForm = await import("./form")
  return SuratKeteranganKematianForm
})

export const metadata: Metadata = {
  title: "Buat Surat Keterangan Kematian",
}

export default function SuratKeteranganKematianPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganKematianForm isDialog={false} />
    </React.Suspense>
  )
}
