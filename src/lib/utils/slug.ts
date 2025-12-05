/* eslint-disable no-useless-escape */

import { transliterate as tr } from "transliteration"

/**
 * Converts text to a URL-friendly slug format
 *
 * Transliterates Unicode characters, removes accents, converts to lowercase,
 * and replaces spaces and special characters with hyphens.
 *
 * @param text - The text to slugify
 * @returns URL-friendly slug string
 */
export function slugify(text: string) {
  return tr(text)
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

/**
 * Converts text to a username-friendly format
 *
 * Similar to slugify but removes all spaces and hyphens for continuous usernames.
 * Transliterates Unicode characters, removes accents and special characters.
 *
 * @param text - The text to convert to username format
 * @returns Username-friendly string without spaces or hyphens
 */
export function slugifyUsername(text: string) {
  return tr(text)
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "") // Replace spaces with non-space-chars
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-/g, "") // Replace - with non-space-chars
    .replace(/\_/g, "") // Replace _ with non-space-chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

/**
 * Converts text to a file-friendly format
 *
 * Similar to slugify but preserves dots for file extensions.
 * Transliterates Unicode characters, removes accents, converts to lowercase.
 *
 * @param text - The text to convert to file format
 * @returns File-friendly string with preserved dots for extensions
 */
export function slugifyFile(text: string) {
  return tr(text)
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-.]+/g, "") // Remove all non-word chars except dots
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}
