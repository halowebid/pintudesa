import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganBelumMemilikiRumahEditForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Surat Keterangan Belum Memiliki Rumah",
}

export default async function EditSuratKeteranganBelumMemilikiRumahDialogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <DialogWrapper>
      <SuratKeteranganBelumMemilikiRumahEditForm id={id} isDialog />
    </DialogWrapper>
  )
}
