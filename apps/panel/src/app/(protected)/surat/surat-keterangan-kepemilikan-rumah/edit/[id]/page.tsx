import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratKeteranganKepemilikanRumahForm = dynamicFn(async () => {
  const SuratKeteranganKepemilikanRumahForm = await import("./form")
  return SuratKeteranganKepemilikanRumahForm
})

export const metadata = {
  title: "Edit Surat Keterangan Kepemilikan Rumah",
}

export default async function EditSuratKeteranganKepemilikanRumahPage({
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
      <SuratKeteranganKepemilikanRumahForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
