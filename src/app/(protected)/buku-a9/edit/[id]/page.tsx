import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const LembaranForm = dynamicFn(async () => {
  const LembaranForm = await import("./form")
  return LembaranForm
})
export const metadata = {
  title: "Edit Lembaran",
}

export default async function LembaranPage({
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
      <LembaranForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
