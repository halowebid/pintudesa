import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const RencanaKerjaPembangunanForm = dynamicFn(async () => {
  const RencanaKerjaPembangunanForm = await import("./form")
  return RencanaKerjaPembangunanForm
})
export const metadata = {
  title: "Buat RencanaKerjaPembangunan",
}

export default function RencanaKerjaPembangunanPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <RencanaKerjaPembangunanForm isDialog={false} />
    </React.Suspense>
  )
}
