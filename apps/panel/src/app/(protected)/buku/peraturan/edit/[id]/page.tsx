import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const PeraturanForm = dynamicFn(async () => {
  const PeraturanForm = await import("./form")
  return PeraturanForm
})
export const metadata = {
  title: "Edit Peraturan",
}

export default async function PeraturanPage({
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
      <PeraturanForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
