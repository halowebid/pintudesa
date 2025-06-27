"use client"

import * as React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

interface ThemeProviderProps
  extends React.ComponentProps<typeof NextThemeProvider> {
  children: React.ReactNode
}

const ThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  )
}

export default ThemeProvider
