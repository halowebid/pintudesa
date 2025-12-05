import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganBedaNamaEditForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Surat Keterangan Beda Nama",
}

export default async function SuratKeteranganBedaNamaEditDialogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <DialogWrapper>
      <SuratKeteranganBedaNamaEditForm id={id} isDialog />
    </DialogWrapper>
  )
}
