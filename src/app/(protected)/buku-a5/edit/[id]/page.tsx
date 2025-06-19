import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const TanahKasForm = dynamicFn(async () => {
  const TanahKasForm = await import("./form")
  return TanahKasForm
})
export const metadata = {
  title: "Edit TanahKas",
}

export default async function TanahKasPage({
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
      <TanahKasForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
