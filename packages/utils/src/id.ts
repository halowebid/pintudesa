import { customAlphabet } from "nanoid"

/**
 * Generates a custom 40-character ID using alphanumeric characters
 *
 * Uses nanoid to create unique identifiers with uppercase, lowercase letters and digits.
 * The generated IDs are 40 characters long and URL-safe.
 *
 * @returns A function that generates a 40-character unique ID string
 */
export const createCustomId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  40,
)

/**
 * Generates a short 5-character unique identifier using lowercase alphanumeric characters
 *
 * Uses nanoid to create compact unique identifiers with digits and lowercase letters.
 * Useful for short codes, tokens, or display identifiers.
 *
 * @returns A function that generates a 5-character unique ID string
 */
export const uniqueCharacter = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  5,
)
