import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const KeputusanKepalaDesaForm = dynamicFn(async () => {
  const KeputusanKepalaDesaForm = await import("./form")
  return KeputusanKepalaDesaForm
})
export const metadata = {
  title: "Buat Keputusan Kepala Desa",
}

export default function KeputusanKepalaDesaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <KeputusanKepalaDesaForm isDialog={false} />
    </React.Suspense>
  )
}
