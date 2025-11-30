"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"

import "prismjs/components/prism-markup"
import "prismjs/themes/prism-tomorrow.css"

interface HtmlCodeEditorProps {
  content: string
  onChange: (html: string) => void
  className?: string
}

export function HtmlCodeEditor({
  content,
  onChange,
  className = "",
}: HtmlCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (preRef.current) {
      const highlighted = Prism.highlight(
        content,
        Prism.languages["markup"],
        "markup",
      )
      preRef.current.innerHTML = highlighted
    }
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue =
        textarea.value.substring(0, start) +
        "  " +
        textarea.value.substring(end)
      onChange(newValue)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-md border bg-gray-900">
        <pre
          ref={preRef}
          className="pointer-events-none absolute top-0 left-0 m-0 h-full w-full overflow-hidden p-4 font-mono text-sm leading-relaxed"
          style={{
            color: "transparent",
            caretColor: "#fff",
          }}
        />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="relative m-0 h-full min-h-[400px] w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-transparent caret-white outline-none"
          style={{
            caretColor: "#fff",
          }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
