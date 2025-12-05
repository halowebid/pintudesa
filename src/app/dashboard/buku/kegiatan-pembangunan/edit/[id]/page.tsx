import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const KegiatanPembangunanForm = dynamicFn(async () => {
  const KegiatanPembangunanForm = await import("./form")
  return KegiatanPembangunanForm
})
export const metadata = {
  title: "Edit Kegiatan Pembangunan",
}

export default async function KegiatanPembangunanPage({
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
      <KegiatanPembangunanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
