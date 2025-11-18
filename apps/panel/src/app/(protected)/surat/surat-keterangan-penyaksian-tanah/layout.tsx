export default function Layout({
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
