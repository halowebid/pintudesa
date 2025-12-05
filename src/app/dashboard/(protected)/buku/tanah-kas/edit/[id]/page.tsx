import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const TanahKasForm = dynamicFn(async () => {
  const TanahKasForm = await import("./form")
  return TanahKasForm
})
export const metadata = {
  title: "Edit Tanah Kas",
}

export default async function TanahKasPage({
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
      <TanahKasForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
