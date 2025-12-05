import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS class names with clsx and tailwind-merge
 *
 * Combines multiple class values using clsx for conditional classes,
 * then merges Tailwind classes intelligently to resolve conflicts.
 *
 * @param inputs - Variable number of class values (strings, arrays, objects)
 * @returns Merged and deduplicated Tailwind class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
