/**
 * Template rendering utilities for surat templates
 * Supports {{variable}} syntax for variable substitution
 */

/**
 * Renders a template string by replacing {{variable}} placeholders with actual values
 * @param template - HTML template string with {{variable}} placeholders
 * @param variables - Object containing variable values
 * @returns Rendered HTML string
 */
export function renderTemplate(
  template: string,
  variables: Record<string, unknown>,
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_match, key) => {
    const trimmedKey = key.trim()
    const value = getNestedValue(variables, trimmedKey)

    if (value === null || value === undefined) {
      return ""
    }

    if (typeof value === "object") {
      return JSON.stringify(value)
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(value)
  })
}

/**
 * Gets a nested value from an object using dot notation
 * e.g., "penduduk.namaLengkap" -> variables.penduduk.namaLengkap
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj as unknown)
}

/**
 * Escapes HTML special characters to prevent XSS
 * Note: For now we trust the admin-created templates
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
