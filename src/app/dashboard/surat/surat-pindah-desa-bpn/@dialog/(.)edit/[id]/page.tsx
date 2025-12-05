import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const FeatureForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Surat Pindah Desa BPN",
}

export default async function SuratPindahDesaBpnEditDialog({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <DialogWrapper>
      <FeatureForm id={id} isDialog />
    </DialogWrapper>
  )
}
