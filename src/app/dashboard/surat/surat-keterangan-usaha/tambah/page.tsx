import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratKeteranganUsahaForm = dynamicFn(async () => {
  const SuratKeteranganUsahaForm = await import("./form")
  return SuratKeteranganUsahaForm
})
export const metadata = {
  title: "Buat Surat Keterangan Usaha",
}

export default function SuratKeteranganUsahaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganUsahaForm isDialog={false} />
    </React.Suspense>
  )
}
