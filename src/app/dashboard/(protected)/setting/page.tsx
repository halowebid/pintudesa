import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const SettingForm = dynamicFn(async () => {
  const SettingForm = await import("./form")
  return SettingForm
})
export const metadata = {
  title: "Pengaturan",
}

export default function SettingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <SettingForm />
    </React.Suspense>
  )
}
