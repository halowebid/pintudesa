import SuratKeteranganGaibEditForm from "./form"

export default async function EditSuratKeteranganGaibPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  return <SuratKeteranganGaibEditForm id={id} isDialog={false} />
}
