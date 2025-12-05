import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const EkspedisiForm = dynamicFn(async () => {
  const EkspedisiForm = await import("./form")
  return EkspedisiForm
})
export const metadata = {
  title: "Buat Ekspedisi",
}

export default function EkspedisiPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <EkspedisiForm isDialog={false} />
    </React.Suspense>
  )
}
