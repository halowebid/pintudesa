import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratKeteranganAhliWarisForm = dynamicFn(async () => {
  const SuratKeteranganAhliWarisForm = await import("./form")
  return SuratKeteranganAhliWarisForm
})

export const metadata: Metadata = {
  title: "Edit Surat Keterangan Ahli Waris",
}

export default function SuratKeteranganAhliWarisEditPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganAhliWarisForm isDialog={false} />
    </React.Suspense>
  )
}
