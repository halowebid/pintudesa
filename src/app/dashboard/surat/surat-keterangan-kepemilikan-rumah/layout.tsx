export default function SuratKeteranganKepemilikanRumahLayout({
  children,
  dialog,
}: {
  children: React.ReactNode
  dialog: React.ReactNode
}) {
  return (
    <>
      {children}
      {dialog}
    </>
  )
}
