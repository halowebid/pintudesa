import * as React from "react"
import dynamicFn from "next/dynamic"

const TemplateSuratForm = dynamicFn(async () => {
  const TemplateSuratForm = await import("./form")
  return TemplateSuratForm
})

export const metadata = {
  title: "Edit Template Surat",
}

export default async function EditTemplateSuratPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TemplateSuratForm id={id} isDialog={false} />
}
