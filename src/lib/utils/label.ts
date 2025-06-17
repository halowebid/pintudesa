export function createLabelMap<T extends readonly string[]>(
  arr: T,
): Record<T[number], string> {
  return Object.fromEntries(
    arr.map((val) => [val, toTitleCase(val)]),
  ) as Record<T[number], string>
}

export function toTitleCase(input: string): string {
  return input
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}
