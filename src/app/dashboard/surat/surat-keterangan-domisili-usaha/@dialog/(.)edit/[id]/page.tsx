import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganDomisiliUsahaEditForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Surat Keterangan Domisili Usaha",
}

export default async function EditSuratKeteranganDomisiliUsahaDialogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <DialogWrapper>
      <SuratKeteranganDomisiliUsahaEditForm id={id} isDialog />
    </DialogWrapper>
  )
}
