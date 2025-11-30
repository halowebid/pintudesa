"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"

import "prismjs/components/prism-markup"

interface HtmlCodeEditorProps {
  content: string
  onChange: (html: string) => void
  className?: string
}

/**
 * Format HTML with proper indentation and line breaks
 */
function formatHtml(html: string): string {
  let formatted = ""
  let indent = 0
  const indentSize = 2

  // Remove extra whitespace and newlines
  const cleanHtml = html.replace(/>\s+</g, "><").trim()

  // Split by tags
  const tags = cleanHtml.match(/<[^>]+>|[^<]+/g) ?? []

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]

    if (!tag || tag.trim() === "") continue

    // Check if it's a closing tag
    if (tag.startsWith("</")) {
      indent = Math.max(0, indent - 1)
      formatted += " ".repeat(indent * indentSize) + tag + "\n"
    }
    // Check if it's a self-closing tag or single tag
    else if (
      tag.startsWith("<") &&
      (tag.endsWith("/>") || tag.match(/<(br|hr|img|input|meta|link)/i))
    ) {
      formatted += " ".repeat(indent * indentSize) + tag + "\n"
    }
    // Check if it's an opening tag
    else if (tag.startsWith("<")) {
      formatted += " ".repeat(indent * indentSize) + tag + "\n"
      // Don't increase indent for inline/void elements
      if (
        !tag.match(
          /<(br|hr|img|input|meta|link|area|base|col|embed|param|source|track|wbr)/i,
        )
      ) {
        indent++
      }
    }
    // Text content
    else {
      const trimmed = tag.trim()
      if (trimmed) {
        formatted += " ".repeat(indent * indentSize) + trimmed + "\n"
      }
    }
  }

  return formatted.trim()
}

/**
 * Minify HTML by removing unnecessary whitespace
 */
function minifyHtml(html: string): string {
  return html
    .replace(/\n\s*/g, "") // Remove newlines and indentation
    .replace(/>\s+</g, "><") // Remove whitespace between tags
    .trim()
}

export function HtmlCodeEditor({
  content,
  onChange,
  className = "",
}: HtmlCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  // Format the content for display
  const formattedContent = formatHtml(content)

  useEffect(() => {
    if (preRef.current) {
      const highlighted = Prism.highlight(
        formattedContent,
        Prism.languages["markup"],
        "markup",
      )
      preRef.current.innerHTML = highlighted
    }
  }, [formattedContent])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Minify the HTML before saving (remove formatting)
    const minified = minifyHtml(e.target.value)
    onChange(minified)
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
          className="pointer-events-none absolute top-0 left-0 m-0 h-full w-full overflow-auto p-4 font-mono text-sm leading-relaxed text-white"
          style={{
            whiteSpace: "pre",
          }}
        />
        <textarea
          ref={textareaRef}
          value={formattedContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="relative m-0 h-full min-h-[400px] w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-transparent caret-white outline-none"
          style={{
            caretColor: "#fff",
            whiteSpace: "pre",
          }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
