import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const PendudukForm = dynamicFn(async () => {
  const PendudukForm = await import("./form")
  return PendudukForm
})
export const metadata = {
  title: "Buat Kartu Keluarga",
}

export default function PendudukPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <PendudukForm isDialog={false} />
    </React.Suspense>
  )
}
