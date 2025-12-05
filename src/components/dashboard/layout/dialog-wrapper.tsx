"use client"

import { useRouter } from "next/navigation"

import { Dialog, DialogContent } from "@/lib/ui"

export default function DialogWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <>
      <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl !min-w-7xl">
          {children}
        </DialogContent>
      </Dialog>
    </>
  )
}
