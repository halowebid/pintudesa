import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const TanahForm = dynamicFn(async () => {
  const TanahForm = await import("./form")
  return TanahForm
})
export const metadata = {
  title: "Buat Tanah",
}

export default function TanahPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <TanahForm isDialog={false} />
    </React.Suspense>
  )
}
