import dynamicFn from "next/dynamic"

const SuratPindahDesaBpnForm = dynamicFn(async () => {
  return await import("./form")
})

export const metadata = {
  title: "Buat Surat Pindah Desa BPN",
}

export default function SuratPindahDesaBpnTambahPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-8 text-lg font-bold">Buat Surat Pindah Desa BPN</h1>
      <SuratPindahDesaBpnForm isDialog={false} />
    </div>
  )
}
