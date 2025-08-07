import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const LembaranForm = dynamicFn(async () => {
  const LembaranForm = await import("./form")
  return LembaranForm
})
export const metadata = {
  title: "Buat Lembaran",
}

export default function LembaranPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <LembaranForm isDialog={false} />
    </React.Suspense>
  )
}
