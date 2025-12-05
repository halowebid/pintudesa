import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const SuratIzinMendirikanBangunanForm = dynamicFn(async () => {
  const SuratIzinMendirikanBangunanForm = await import("./form")
  return SuratIzinMendirikanBangunanForm
})

export const metadata = {
  title: "Edit Surat Izin Mendirikan Bangunan",
}

export default async function EditSuratIzinMendirikanBangunanPage({
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
      <SuratIzinMendirikanBangunanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
