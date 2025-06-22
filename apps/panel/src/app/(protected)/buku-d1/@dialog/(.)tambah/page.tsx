import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const RencanaKerjaPembangunanForm = dynamicFn(async () => {
  const RencanaKerjaPembangunanForm = await import("../../tambah/form")
  return RencanaKerjaPembangunanForm
})
export const metadata = {
  title: "Buat RencanaKerjaPembangunan",
}

export default function RencanaKerjaPembangunanPage() {
  return (
    <DialogWrapper>
      <RencanaKerjaPembangunanForm isDialog />
    </DialogWrapper>
  )
}
