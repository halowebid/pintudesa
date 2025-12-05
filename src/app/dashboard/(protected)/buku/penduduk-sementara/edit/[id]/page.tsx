import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const PendudukSementaraForm = dynamicFn(async () => {
  const PendudukSementaraForm = await import("./form")
  return PendudukSementaraForm
})
export const metadata = {
  title: "Edit Penduduk Sementara",
}

export default async function PendudukSementaraPage({
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
      <PendudukSementaraForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
