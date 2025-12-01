"use client"

import { createContext, useContext } from "react"
import { toast as showToast, Toaster } from "@pintudesa/ui"
import type { Options } from "@zag-js/toast"

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
