"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@ark-ui/react/popover"
import { cn } from "@yopem-ui/utils"

export const Popover = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

export const PopoverTrigger = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

const PopoverPositioner = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Positioner>) => {
  return (
    <PopoverPrimitive.Positioner data-slot="popover-positioner" {...props} />
  )
}

export const PopoverContent = ({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) => {
  return (
    <PopoverPositioner>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPositioner>
  )
}

export const PopoverAnchor = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}
