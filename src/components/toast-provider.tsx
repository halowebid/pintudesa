"use client"

import { createContext, useContext } from "react"
import type { Options } from "@zag-js/toast"

import { toast as showToast, Toaster } from "@/lib/ui"

const ToastContext = createContext<{
  toast: (options: Options) => string
}>({
  toast: () => "",
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
