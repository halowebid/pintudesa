"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@ark-ui/react/dialog"
import { Portal } from "@ark-ui/react/portal"
import { Icon } from "@yopem-ui/react-icons"
import { cn } from "@yopem-ui/utils"

export const Dialog = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

export const DialogTrigger = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

export const DialogPortal = ({
  ...props
}: React.ComponentProps<typeof Portal>) => {
  return <Portal data-slot="dialog-portal" {...props} />
}

export const DialogCloseTrigger = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.CloseTrigger>) => {
  return (
    <DialogPrimitive.CloseTrigger data-slot="dialog-close-trigger" {...props} />
  )
}

export const DialogPositioner = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Positioner>) => {
  return <DialogPrimitive.Positioner data-slot="dialog-positioner" {...props} />
}

export const DialogBackDrop = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) => {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  )
}

export const DialogContent = ({
  className,
  children,
  mode = "portal",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  mode?: "inline" | "portal"
}) => {
  const content = (
    <>
      <DialogBackDrop />
      <DialogPositioner>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "bg-background fixed z-50 gap-4 overflow-y-auto p-6 shadow-lg transition ease-in-out",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 top-1/2 left-1/2 max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border data-[state=closed]:duration-300 data-[state=open]:duration-500 lg:max-w-2xl",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.CloseTrigger className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
            <Icon name="X" className="size-4 cursor-pointer" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.CloseTrigger>
        </DialogPrimitive.Content>
      </DialogPositioner>
    </>
  )

  return mode === "portal" ? <DialogPortal>{content}</DialogPortal> : content
}

export const DialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  )
}

export const DialogFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  )
}

export const DialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-foreground text-lg font-semibold", className)}
      {...props}
    />
  )
}

export const DialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}
