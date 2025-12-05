import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const TanahForm = dynamicFn(async () => {
  const TanahForm = await import("./form")
  return TanahForm
})
export const metadata = {
  title: "Edit Tanah",
}

export default async function TanahPage({
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
      <TanahForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
