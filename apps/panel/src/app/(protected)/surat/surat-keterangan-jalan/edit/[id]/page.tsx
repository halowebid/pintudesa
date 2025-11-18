import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratKeteranganJalanForm = dynamicFn(async () => {
  const SuratKeteranganJalanForm = await import("./form")
  return SuratKeteranganJalanForm
})

export const metadata = {
  title: "Edit Surat Keterangan Jalan",
}

export default async function EditSuratKeteranganJalanPage({
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
      <SuratKeteranganJalanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
