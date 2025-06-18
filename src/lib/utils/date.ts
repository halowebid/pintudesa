import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"

export function formatDate(data: string | Date | null, format: string) {
  dayjs.extend(LocalizedFormat)

  return dayjs(data).format(format)
}

export function formatStringToDate(value: string | Date): Date {
  if (value instanceof Date && !isNaN(value.getTime())) return value

  if (typeof value === "string") {
    const parsed = dayjs(value, "MM/DD/YYYY", true)
    if (parsed.isValid()) return parsed.toDate()
  }

  return new Date()
}

export function formatDateToString(date?: Date): string {
  if (!date || isNaN(date.getTime())) return ""
  return dayjs(date).format("MM/DD/YYYY")
}
