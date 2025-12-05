import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const PendudukForm = dynamicFn(async () => {
  const PendudukForm = await import("./form")
  return PendudukForm
})
export const metadata = {
  title: "Edit Penduduk",
}

export default async function PendudukPage({
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
      <PendudukForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
