import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const InventarisForm = dynamicFn(async () => {
  const InventarisForm = await import("./form")
  return InventarisForm
})
export const metadata = {
  title: "Buat Inventaris",
}

export default function InventarisPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <InventarisForm isDialog={false} />
    </React.Suspense>
  )
}
