import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const KaderPemberdayaanMasyarakatForm = dynamicFn(async () => {
  const KaderPemberdayaanMasyarakatForm = await import("./form")
  return KaderPemberdayaanMasyarakatForm
})
export const metadata = {
  title: "Buat Kader Pemberdayaan Masyarakat",
}

export default function KaderPemberdayaanMasyarakatPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <KaderPemberdayaanMasyarakatForm isDialog={false} />
    </React.Suspense>
  )
}
