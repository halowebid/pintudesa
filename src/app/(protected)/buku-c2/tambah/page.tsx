import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const RABForm = dynamicFn(async () => {
  const RABForm = await import("./form")
  return RABForm
})
export const metadata = {
  title: "Buat Rencana Anggaran Biaya",
}

export default function RABPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <RABForm isDialog={false} />
    </React.Suspense>
  )
}
