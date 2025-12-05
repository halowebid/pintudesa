import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const SuratIzinKeramaianForm = dynamicFn(async () => {
  const SuratIzinKeramaianForm = await import("./form")
  return SuratIzinKeramaianForm
})
export const metadata = {
  title: "Buat Surat Izin Keramaian",
}

export default function SuratIzinKeramaianPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratIzinKeramaianForm isDialog={false} />
    </React.Suspense>
  )
}
