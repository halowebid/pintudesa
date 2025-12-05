import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const RABForm = dynamicFn(async () => {
  const RABForm = await import("./form")
  return RABForm
})
export const metadata = {
  title: "Edit Rencana Anggaran Biaya",
}

export default async function RABPage({
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
      <RABForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
