import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const InventarisHasilPembangunanForm = dynamicFn(async () => {
  const InventarisHasilPembangunanForm = await import("./form")
  return InventarisHasilPembangunanForm
})
export const metadata = {
  title: "Buat Inventaris Hasil Pembangunan",
}

export default function InventarisHasilPembangunanPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <InventarisHasilPembangunanForm isDialog={false} />
    </React.Suspense>
  )
}
