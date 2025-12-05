import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const InventarisHasilPembangunanForm = dynamicFn(async () => {
  const InventarisHasilPembangunanForm = await import("./form")
  return InventarisHasilPembangunanForm
})
export const metadata = {
  title: "Edit Inventaris Hasil Pembangunan",
}

export default async function InventarisHasilPembangunanPage({
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
      <InventarisHasilPembangunanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
