import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratKeteranganAhliWarisForm = dynamicFn(async () => {
  const SuratKeteranganAhliWarisForm = await import("../tambah/form")
  return SuratKeteranganAhliWarisForm
})

export default function SuratKeteranganAhliWarisDialog() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganAhliWarisForm isDialog={true} />
    </React.Suspense>
  )
}
