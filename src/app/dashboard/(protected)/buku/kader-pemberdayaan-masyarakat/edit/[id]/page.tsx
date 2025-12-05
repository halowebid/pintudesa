import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const KaderPemberdayaanMasyarakatForm = dynamicFn(async () => {
  const KaderPemberdayaanMasyarakatForm = await import("./form")
  return KaderPemberdayaanMasyarakatForm
})
export const metadata = {
  title: "Edit Kader Pemberdayaan Masyarakat",
}

export default async function KaderPemberdayaanMasyarakatPage({
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
      <KaderPemberdayaanMasyarakatForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
