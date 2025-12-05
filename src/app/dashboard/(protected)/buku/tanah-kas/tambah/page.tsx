import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const TanahKasForm = dynamicFn(async () => {
  const TanahKasForm = await import("./form")
  return TanahKasForm
})
export const metadata = {
  title: "Buat Tanah Kas",
}

export default function TanahKasPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <TanahKasForm isDialog={false} />
    </React.Suspense>
  )
}
