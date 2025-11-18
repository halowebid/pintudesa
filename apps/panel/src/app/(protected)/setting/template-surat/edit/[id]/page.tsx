import * as React from "react"
import dynamicFn from "next/dynamic"

const TemplateSuratForm = dynamicFn(async () => {
  const TemplateSuratForm = await import("./form")
  return TemplateSuratForm
})

export const metadata = {
  title: "Edit Template Surat",
}

export default function EditTemplateSuratPage({
  params,
}: {
  params: { id: string }
}) {
  return <TemplateSuratForm id={params.id} isDialog={false} />
}
