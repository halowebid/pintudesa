import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const KegiatanPembangunanForm = dynamicFn(async () => {
  const KegiatanPembangunanForm = await import("./form")
  return KegiatanPembangunanForm
})
export const metadata = {
  title: "Buat Kegiatan Pembangunan",
}

export default function KegiatanPembangunanPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <KegiatanPembangunanForm isDialog={false} />
    </React.Suspense>
  )
}
