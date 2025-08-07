import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const EkspedisiForm = dynamicFn(async () => {
  const EkspedisiForm = await import("./form")
  return EkspedisiForm
})
export const metadata = {
  title: "Edit Ekspedisi",
}

export default async function EkspedisiPage({
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
      <EkspedisiForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
