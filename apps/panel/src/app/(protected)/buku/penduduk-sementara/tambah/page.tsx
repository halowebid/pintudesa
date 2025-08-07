import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const PendudukSementaraForm = dynamicFn(async () => {
  const PendudukSementaraForm = await import("./form")
  return PendudukSementaraForm
})
export const metadata = {
  title: "Buat Penduduk Sementara",
}

export default function PendudukSementaraPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <PendudukSementaraForm isDialog={false} />
    </React.Suspense>
  )
}
