import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const SuratKeteranganPenyaksianTanahForm = dynamicFn(async () => {
  const SuratKeteranganPenyaksianTanahForm = await import("./form")
  return SuratKeteranganPenyaksianTanahForm
})

export const metadata = {
  title: "Edit Surat Keterangan Penyaksian Tanah",
}

export default async function EditSuratKeteranganPenyaksianTanahPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKeteranganPenyaksianTanahForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
