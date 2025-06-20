import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const InventarisForm = dynamicFn(async () => {
  const InventarisForm = await import("./form")
  return InventarisForm
})
export const metadata = {
  title: "Edit Inventaris",
}

export default async function InventarisPage({
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
      <InventarisForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
