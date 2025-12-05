import * as React from "react"

export default function ProtectedLayout({
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
