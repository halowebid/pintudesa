import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const SuratKeteranganPenghasilanForm = dynamicFn(async () => {
  const SuratKeteranganPenghasilanForm = await import("./form")
  return SuratKeteranganPenghasilanForm
})

export const metadata = {
  title: "Edit Surat Keterangan Penghasilan",
}

export default async function EditSuratKeteranganPenghasilanPage({
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
      <SuratKeteranganPenghasilanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
