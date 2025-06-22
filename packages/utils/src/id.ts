import { customAlphabet } from "nanoid"

export const createCustomId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  40,
)

export const uniqueCharacter = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  5,
)
