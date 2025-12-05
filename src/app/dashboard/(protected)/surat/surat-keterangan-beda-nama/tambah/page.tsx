import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const SuratKeteranganBedaNamaForm = dynamicFn(async () => {
  const SuratKeteranganBedaNamaForm = await import("./form")
  return SuratKeteranganBedaNamaForm
})
export const metadata = {
  title: "Buat Surat Keterangan Beda Nama",
}

export default function SuratKeteranganBedaNamaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganBedaNamaForm isDialog={false} />
    </React.Suspense>
  )
}
