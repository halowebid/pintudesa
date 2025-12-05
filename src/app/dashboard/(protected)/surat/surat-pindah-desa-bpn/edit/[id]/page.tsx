import dynamicFn from "next/dynamic"

const SuratPindahDesaBpnEditForm = dynamicFn(async () => {
  return await import("./form")
})

export const metadata = {
  title: "Edit Surat Pindah Desa BPN",
}

export default async function SuratPindahDesaBpnEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-8 text-lg font-bold">Edit Surat Pindah Desa BPN</h1>
      <SuratPindahDesaBpnEditForm id={id} isDialog={false} />
    </div>
  )
}
