"use client"

import {
  createToaster,
  Toaster as ToasterPrimitive,
  Toast as ToastPrimitive,
} from "@ark-ui/react/toast"
import { Icon } from "@yopem-ui/react-icons"
import { cn } from "@yopem-ui/utils"
import type { Options } from "@zag-js/toast"

export const toaster = createToaster({
  placement: "bottom-end",
  overlap: false,
  gap: 16,
})

export function toast(options: Options) {
  if (options.id) toaster.remove(options.id)
  return toaster.create({
    duration: 5000,
    removeDelay: 300,
    ...options,
  })
}

const getToastTypeStyles = (type?: string) => {
  if (type === "destructive") {
    return {
      bg: "bg-destructive",
      title: "text-white",
      description: "text-white",
    }
  }

  return {
    bg: "bg-background",
    title: "text-foreground",
    description: "text-foreground",
  }
}

export const Toaster = () => (
  <ToasterPrimitive toaster={toaster}>
    {(t) => {
      const styles = getToastTypeStyles(t.type)

      return (
        <ToastPrimitive.Root
          key={t.id}
          className={cn(
            "group pointer-events-auto relative flex w-lg max-w-sm items-start gap-4 rounded-lg px-4 py-3 pr-10 shadow-lg transition-all ease-in-out sm:max-w-md sm:px-6 sm:py-4 md:max-w-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-4",
            styles.bg,
          )}
        >
          <div className="flex flex-1 flex-col">
            {t.title && (
              <ToastPrimitive.Title
                className={cn("text-sm font-semibold", styles.title)}
              >
                {t.title}
              </ToastPrimitive.Title>
            )}
            {t.description && (
              <ToastPrimitive.Description
                className={cn("mt-1 text-sm", styles.description)}
              >
                {t.description}
              </ToastPrimitive.Description>
            )}
          </div>

          {t.action && (
            <ToastPrimitive.ActionTrigger className="text-primary self-end text-sm font-medium hover:underline">
              {t.action.label}
            </ToastPrimitive.ActionTrigger>
          )}

          <ToastPrimitive.CloseTrigger
            className={cn(
              "absolute top-2 right-2 rounded-md p-1 transition-opacity duration-200 group-hover:opacity-100 hover:scale-105",
              t.type === "destructive"
                ? "hover:text-white"
                : "hover:text-foreground",
            )}
          >
            <Icon
              name="X"
              className={cn(
                "size-4 transition-all duration-150",
                t.type === "destructive"
                  ? "text-white"
                  : "text-muted-foreground",
              )}
            />
          </ToastPrimitive.CloseTrigger>
        </ToastPrimitive.Root>
      )
    }}
  </ToasterPrimitive>
)
