import * as React from "react"
import dynamicFn from "next/dynamic"

const TemplateSuratForm = dynamicFn(async () => {
  const TemplateSuratForm = await import("./form")
  return TemplateSuratForm
})

export const metadata = {
  title: "Buat Template Surat",
}

export default function TambahTemplateSuratPage() {
  return <TemplateSuratForm isDialog={false} />
}
