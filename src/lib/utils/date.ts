import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

/**
 * Formats a date value into a string using the specified format
 *
 * @param data - The date to format (string, Date object, or null)
 * @param format - The desired output format (dayjs format string)
 * @returns Formatted date string
 */
export function formatDate(data: string | Date | null, format: string) {
  dayjs.extend(LocalizedFormat)

  return dayjs(data).format(format)
}

/**
 * Converts a string or Date value to a Date object with Jakarta timezone
 *
 * Parses MM/DD/YYYY format strings. If the value is invalid or cannot be parsed,
 * returns the current date in Asia/Jakarta timezone.
 *
 * @param value - The string or Date to convert
 * @returns Date object in Asia/Jakarta timezone
 */
export function formatStringToDate(value: string | Date): Date {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  if (value instanceof Date && !isNaN(value.getTime())) return value

  if (typeof value === "string") {
    const parsed = dayjs(value, "MM/DD/YYYY", true)
    if (parsed.isValid()) return parsed.toDate()
  }

  return dayjs().tz("Asia/Jakarta").toDate()
}

/**
 * Converts a Date object to MM/DD/YYYY format string
 *
 * @param date - The date to format (optional)
 * @returns Formatted date string in MM/DD/YYYY format, or empty string if date is invalid
 */
export function formatDateToString(date?: Date): string {
  if (!date || isNaN(date.getTime())) return ""
  return dayjs(date).format("MM/DD/YYYY")
}
