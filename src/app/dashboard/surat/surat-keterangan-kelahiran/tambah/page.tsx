import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratKeteranganKelahiranForm = dynamicFn(async () => {
  const SuratKeteranganKelahiranForm = await import("./form")
  return SuratKeteranganKelahiranForm
})
export const metadata = {
  title: "Buat Surat Keterangan Kelahiran",
}

export default function SuratKeteranganKelahiranPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganKelahiranForm isDialog={false} />
    </React.Suspense>
  )
}
