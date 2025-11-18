import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const TemplateSuratForm = dynamicFn(async () => {
  return await import("../../tambah/form")
})

export const metadata = {
  title: "Buat Template Surat",
}

export default function TambahTemplateSuratDialogPage() {
  return (
    <DialogWrapper>
      <TemplateSuratForm isDialog />
    </DialogWrapper>
  )
}
