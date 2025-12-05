import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const RencanaKerjaPembangunanForm = dynamicFn(async () => {
  const RencanaKerjaPembangunanForm = await import("./form")
  return RencanaKerjaPembangunanForm
})
export const metadata = {
  title: "Edit RencanaKerjaPembangunan",
}

export default async function RencanaKerjaPembangunanPage({
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
      <RencanaKerjaPembangunanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
