import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratKeteranganKematianForm = dynamicFn(async () => {
  const SuratKeteranganKematianForm = await import("./form")
  return SuratKeteranganKematianForm
})
export const metadata: Metadata = {
  title: "Edit Surat Keterangan Kematian",
}

export default async function SuratKeteranganKematianPage({
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
      <SuratKeteranganKematianForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
