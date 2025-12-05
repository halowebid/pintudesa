import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const AgendaForm = dynamicFn(async () => {
  const AgendaForm = await import("./form")
  return AgendaForm
})
export const metadata = {
  title: "Buat Agenda",
}

export default function AgendaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full flex-col gap-4">
          <Skeleton />
        </div>
      }
    >
      <AgendaForm isDialog={false} />
    </React.Suspense>
  )
}
