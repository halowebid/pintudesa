import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const TemplateSuratForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Template Surat",
}

export default async function EditTemplateSuratDialogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <TemplateSuratForm id={id} isDialog />
    </DialogWrapper>
  )
}
