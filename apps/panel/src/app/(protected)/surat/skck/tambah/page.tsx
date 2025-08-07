import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@pintudesa/ui"

const SuratPengantarSKCKForm = dynamicFn(async () => {
  const SuratPengantarSKCKForm = await import("./form")
  return SuratPengantarSKCKForm
})
export const metadata = {
  title: "Buat Surat Pengantar SKCK",
}

export default function SuratPengantarSKCKPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SuratPengantarSKCKForm isDialog={false} />
    </React.Suspense>
  )
}
