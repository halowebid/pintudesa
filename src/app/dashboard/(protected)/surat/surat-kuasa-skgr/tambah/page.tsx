import * as React from "react"
import dynamicFn from "next/dynamic"

import { Skeleton } from "@/lib/ui"

const SuratKuasaSKGRForm = dynamicFn(async () => {
  const SuratKuasaSKGRForm = await import("./form")
  return SuratKuasaSKGRForm
})
export const metadata = {
  title: "Buat Surat Kuasa SKGR",
}

export default function SuratKuasaSKGRPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratKuasaSKGRForm isDialog={false} />
    </React.Suspense>
  )
}
