import * as React from "react"
import dynamicFn from "next/dynamic"
import { Skeleton } from "@/lib/ui"

const AgendaForm = dynamicFn(async () => {
  const AgendaForm = await import("./form")
  return AgendaForm
})
export const metadata = {
  title: "Edit Agenda",
}

export default async function AgendaPage({
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
      <AgendaForm id={id} isDialog={false} />
    </React.Suspense>
  )
}
