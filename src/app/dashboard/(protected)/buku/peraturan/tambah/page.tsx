import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const PeraturanForm = dynamicFn(async () => {
  const PeraturanForm = await import("./form")
  return PeraturanForm
})
export const metadata = {
  title: "Buat Peraturan",
}

export default function PeraturanPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <PeraturanForm isDialog={false} />
    </React.Suspense>
  )
}
