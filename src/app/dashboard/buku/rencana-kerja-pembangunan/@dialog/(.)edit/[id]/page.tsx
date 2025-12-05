import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const RencanaKerjaPembangunanForm = dynamicFn(async () => {
  const RencanaKerjaPembangunanForm = await import("../../../edit/[id]/form")
  return RencanaKerjaPembangunanForm
})
export const metadata = {
  title: "Edit RencanaKerjaPembangunan",
}

export default async function RencanaKerjaPembangunanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <RencanaKerjaPembangunanForm id={id} isDialog />
    </DialogWrapper>
  )
}
