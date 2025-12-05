"use client"

import type React from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useMobile,
} from "@/lib/ui"

interface EditorLayoutProps {
  editor: React.ReactNode
  preview: React.ReactNode
}

export default function EditorLayout({ editor, preview }: EditorLayoutProps) {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <Tabs defaultValue="editor" className="flex h-full flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent
          value="editor"
          className="flex-1 overflow-hidden px-4 pb-4"
        >
          <div className="h-full overflow-hidden rounded-lg border">
            {editor}
          </div>
        </TabsContent>

        <TabsContent
          value="preview"
          className="flex-1 overflow-hidden px-4 pb-4"
        >
          <div className="h-full overflow-hidden rounded-lg border">
            {preview}
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="grid h-full grid-cols-2 gap-4 p-4">
      <div className="flex flex-col overflow-hidden rounded-lg border">
        {editor}
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border">
        {preview}
      </div>
    </div>
  )
}
