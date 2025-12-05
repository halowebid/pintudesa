import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const PisahKartuKeluargaForm = dynamicFn(async () => {
  const PisahKartuKeluargaForm = await import("./form")
  return PisahKartuKeluargaForm
})
export const metadata = {
  title: "Pisah Kartu Keluarga",
}

export default async function PisahKartuKeluargaPage({
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
      <PisahKartuKeluargaForm originalKkId={id} isDialog={false} />
    </React.Suspense>
  )
}
