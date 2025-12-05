import { mergeAttributes, Node } from "@tiptap/core"

export interface VariableOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    templateVariable: {
      insertVariable: (variableName: string) => ReturnType
    }
  }
}

export const VariableExtension = Node.create<VariableOptions>({
  name: "templateVariable",

  group: "inline",

  inline: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      variableName: {
        default: null,
        parseHTML: (element) => {
          const dataVar = element.getAttribute("data-variable")
          if (dataVar) return dataVar
          const textContent = element.textContent
          return textContent ? textContent.replace(/^{{|}}/g, "") : null
        },
        renderHTML: (attributes) => {
          return {
            "data-variable": attributes["variableName"],
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
      },
      {
        tag: "span",
        getAttrs: (node) => {
          const text = typeof node === "string" ? node : node.textContent
          const match = text ? /^{{([^}]+)}}$/.exec(text) : null
          return match ? { variableName: match[1] } : false
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-variable": node.attrs["variableName"],
        class:
          "inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      }),
      `{{${node.attrs["variableName"]}}}`,
    ]
  },

  renderText({ node }) {
    return `{{${node.attrs["variableName"]}}`
  },

  addCommands() {
    return {
      insertVariable:
        (variableName: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { variableName },
          })
        },
    }
  },
})
