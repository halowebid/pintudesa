"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@pintudesa/ui"

export default function DialogWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <>
      <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </>
  )
}
