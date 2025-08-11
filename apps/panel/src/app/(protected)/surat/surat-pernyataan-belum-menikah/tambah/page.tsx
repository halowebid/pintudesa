import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratPernyataanBelumMenikahForm = dynamicFn(async () => {
  const SuratPernyataanBelumMenikahForm = await import("./form")
  return SuratPernyataanBelumMenikahForm
})
export const metadata = {
  title: "Buat Surat Pernyataan Belum Menikah",
}

export default function SuratPernyataanBelumMenikahPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratPernyataanBelumMenikahForm isDialog={false} />
    </React.Suspense>
  )
}
