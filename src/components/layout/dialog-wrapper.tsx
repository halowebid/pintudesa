"use client"

import { useRouter } from "next/navigation"

import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function DialogWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <>
      <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent side="top">{children}</DialogContent>
      </Dialog>
    </>
  )
}
