import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const SuratIzinKeramaianForm = dynamicFn(async () => {
  const SuratIzinKeramaianForm = await import("./form")
  return SuratIzinKeramaianForm
})
export const metadata = {
  title: "Edit Surat Izin Keramaian",
}

export default async function SuratIzinKeramaianPage({
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
      <SuratIzinKeramaianForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
