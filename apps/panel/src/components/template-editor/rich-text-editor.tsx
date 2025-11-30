"use client"

import { useEffect } from "react"
import { Button } from "@pintudesa/ui"
import { Link } from "@tiptap/extension-link"
import { Table } from "@tiptap/extension-table"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableRow } from "@tiptap/extension-table-row"
import TextAlign from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Icon } from "@yopem-ui/react-icons"

import { VariableExtension } from "./variable-extension"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  onInsertVariable?: () => void
}

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  onInsertVariable?: () => void
}

function EditorToolbar({
  editor,
  onInsertVariable,
}: {
  editor: Editor | null
  onInsertVariable?: () => void
}) {
  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    icon,
    title,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    icon:
      | "Bold"
      | "Italic"
      | "Underline"
      | "Strikethrough"
      | "Heading1"
      | "Heading2"
      | "Heading3"
      | "List"
      | "ListOrdered"
      | "AlignLeft"
      | "AlignCenter"
      | "AlignRight"
      | "AlignJustify"
      | "Table"
      | "Trash"
      | "Link"
      | "Unlink"
      | "RemoveFormatting"
    title: string
  }) => (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      <Icon name={icon} className="h-4 w-4" />
    </Button>
  )

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      {/* Text formatting */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          icon="Bold"
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          icon="Italic"
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          icon="Underline"
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          icon="Strikethrough"
          title="Strikethrough"
        />
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          icon="Heading1"
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          icon="Heading2"
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          icon="Heading3"
          title="Heading 3"
        />
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          icon="List"
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          icon="ListOrdered"
          title="Numbered List"
        />
      </div>

      {/* Alignment - PROMINENT */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          icon="AlignLeft"
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          icon="AlignCenter"
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          icon="AlignRight"
          title="Align Right"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          icon="AlignJustify"
          title="Justify"
        />
      </div>

      {/* Table */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          icon="Table"
          title="Insert Table"
        />
        {editor.isActive("table") && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              icon="Trash"
              title="Delete Table"
            />
          </>
        )}
      </div>

      {/* Link */}
      <div className="flex gap-1 border-r pr-2">
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter URL:")
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          active={editor.isActive("link")}
          icon="Link"
          title="Insert Link"
        />
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            icon="Unlink"
            title="Remove Link"
          />
        )}
      </div>

      {/* Variable insertion */}
      <div className="flex gap-1 border-r pr-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onInsertVariable}
          title="Insert Variable"
          className="h-8"
        >
          <Icon name="Braces" className="mr-1 h-4 w-4" />
          Variabel
        </Button>
      </div>

      {/* Clear formatting */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          icon="RemoveFormatting"
          title="Clear Formatting"
        />
      </div>
    </div>
  )
}

export function RichTextEditor({
  content,
  onChange,
  onInsertVariable,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      VariableExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  })

  useEffect(() => {
    if (!editor) return

    const currentContent = editor.getHTML()
    if (content !== currentContent) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="overflow-hidden rounded-md border">
      <EditorToolbar editor={editor} onInsertVariable={onInsertVariable} />
      <EditorContent editor={editor} />
    </div>
  )
}

export function useEditorCommands(editor: Editor | null) {
  return {
    insertVariable: (variableName: string) => {
      editor?.chain().focus().insertVariable(variableName).run()
    },
  }
}
