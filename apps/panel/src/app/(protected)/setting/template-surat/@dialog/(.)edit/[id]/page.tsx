import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const TemplateSuratForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Template Surat",
}

export default function EditTemplateSuratDialogPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <TemplateSuratForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
