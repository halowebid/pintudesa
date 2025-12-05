import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratKeteranganKelahiranForm = dynamicFn(async () => {
  const SuratKeteranganKelahiranForm = await import("./form")
  return SuratKeteranganKelahiranForm
})

export const metadata = {
  title: "Edit Surat Keterangan Kelahiran",
}

export default function SuratKeteranganKelahiranPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganKelahiranForm id={params.id} isDialog={false} />
    </React.Suspense>
  )
}
