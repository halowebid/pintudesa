import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const KeputusanKepalaDesaForm = dynamicFn(async () => {
  const KeputusanKepalaDesaForm = await import("./form")
  return KeputusanKepalaDesaForm
})
export const metadata = {
  title: "Edit Keputusan Kepala Desa",
}

export default async function KeputusanKepalaDesaPage({
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
      <KeputusanKepalaDesaForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
