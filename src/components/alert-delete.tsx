"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AlertDeleteProps extends React.ComponentProps<"div"> {
  title?: string
  description?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

const AlertDelete = (props: AlertDeleteProps) => {
  const { description, isOpen, onClose, className, onDelete } = props

  function handleDeleteAndClose() {
    onDelete()
    onClose()
  }

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {description}</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus {description}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogCloseTrigger asChild>
              <div className="justify-betweem flex flex-row gap-4">
                <Button onClick={handleDeleteAndClose}>Ya</Button>
                <Button variant="outline" onClick={onClose}>
                  Tidak
                </Button>
              </div>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AlertDelete
