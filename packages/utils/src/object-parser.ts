/**
 * Utility class for safely navigating and extracting typed values from unknown objects
 */
export class ObjectParser {
  private value: unknown

  constructor(value: unknown) {
    this.value = value
  }

  /**
   * Checks if a nested path exists in the object
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the path exists, false otherwise
   * @throws {TypeError} If path is empty
   */
  public has(...path: string[]): boolean {
    if (path.length < 1) {
      throw new TypeError("Invalid path")
    }

    let value = this.value

    for (const key of path) {
      if (typeof value !== "object" || value === null) {
        return false
      }
      if (!(key in value)) {
        return false
      }
      value = value[key as keyof typeof value]
    }

    return true
  }

  /**
   * Gets the value at the specified nested path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The value at the specified path
   * @throws {TypeError} If path is empty
   * @throws {Error} If path does not exist or value is not an object
   */
  public get(...path: string[]): unknown {
    if (path.length < 1) {
      throw new TypeError("Invalid path")
    }
    let value = this.value
    for (let i = 0; i < path.length; i++) {
      if (typeof value !== "object" || value === null) {
        throw new Error(
          `Value in path ${path.slice(0, i + 1).join(".")} is not an object`,
        )
      }
      if (!(path[i] in value)) {
        throw new Error(`Path ${path.slice(0, i + 1).join(".")} does not exist`)
      }
      value = value[path[i] as keyof typeof value]
    }
    return value
  }

  /**
   * Checks if the value at the specified path is a string
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is a string, false otherwise
   */
  public isString(...path: string[]): boolean {
    return typeof this.get(...path) === "string"
  }

  /**
   * Gets the string value at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The string value at the specified path
   * @throws {Error} If the value is not a string
   */
  public getString(...path: string[]): string {
    const value = this.get(...path)
    if (typeof value !== "string") {
      throw new Error(`Value in path ${path.join(".")} is not a string`)
    }
    return value
  }

  /**
   * Checks if the value at the specified path is a number
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is a number, false otherwise
   */
  public isNumber(...path: string[]): boolean {
    return typeof this.get(...path) === "number"
  }

  /**
   * Gets the number value at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The number value at the specified path
   * @throws {Error} If the value is not a number
   */
  public getNumber(...path: string[]): number {
    const value = this.get(...path)
    if (typeof value !== "number") {
      throw new Error(`Value in path ${path.join(".")} is not a string`)
    }
    return value
  }

  /**
   * Checks if the value at the specified path is a boolean
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is a boolean, false otherwise
   */
  public isBoolean(...path: string[]): boolean {
    return typeof this.get(...path) === "boolean"
  }

  /**
   * Gets the boolean value at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The boolean value at the specified path
   * @throws {Error} If the value is not a boolean
   */
  public getBoolean(...path: string[]): boolean {
    const value = this.get(...path)
    if (typeof value !== "boolean") {
      throw new Error(`Value in path ${path.join(".")} is not a boolean`)
    }
    return value
  }

  /**
   * Checks if the value at the specified path is a bigint
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is a bigint, false otherwise
   */
  public isBigInt(...path: string[]): boolean {
    return typeof this.get(...path) === "bigint"
  }

  /**
   * Gets the bigint value at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The bigint value at the specified path
   * @throws {Error} If the value is not a bigint
   */
  public getBigInt(...path: string[]): bigint {
    const value = this.get(...path)
    if (typeof value !== "bigint") {
      throw new Error(`Value in path ${path.join(".")} is not a bigint`)
    }
    return value
  }

  /**
   * Checks if the value at the specified path is an object
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is an object (not null), false otherwise
   */
  public isObject(...path: string[]): boolean {
    const value = this.get(...path)
    return typeof value === "object" && value !== null
  }

  /**
   * Gets the object value at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The object value at the specified path
   * @throws {Error} If the value is not an object
   */
  public getObject(...path: string[]): object {
    const value = this.get(...path)
    if (typeof value !== "object" || value === null) {
      throw new Error(`Value in path ${path.join(".")} is not a object`)
    }
    return value
  }

  /**
   * Checks if the value at the specified path is an array
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is an array, false otherwise
   */
  public isArray(...path: string[]): boolean {
    return Array.isArray(this.get(...path))
  }

  /**
   * Gets the array value at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns The array value at the specified path
   * @throws {Error} If the value is not an array
   */
  public getArray(...path: string[]): unknown[] {
    const value = this.get(...path)
    if (!Array.isArray(value)) {
      throw new Error(`Value in path ${path.join(".")} is not a object`)
    }
    return value
  }

  /**
   * Checks if the value at the specified path is null
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is null, false otherwise
   */
  public isNull(...path: string[]): boolean {
    const value = this.get(...path)
    return value === null
  }

  /**
   * Checks if the value at the specified path is undefined
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns True if the value is undefined, false otherwise
   */
  public isUndefined(...path: string[]): boolean {
    const value = this.get(...path)
    return value === undefined
  }

  /**
   * Creates a new ObjectParser instance for the object at the specified path
   *
   * @param path - Dot-separated property path as rest parameters
   * @returns New ObjectParser instance wrapping the nested object
   * @throws {Error} If the value at path is not an object
   */
  public createParser(...path: string[]): ObjectParser {
    return new ObjectParser(this.getObject(...path))
  }
}
