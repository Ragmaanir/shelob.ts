import { raise } from "pimpanzee"

export class RoutePattern {
  static compile(path: string): RoutePattern {
    const keys: string[] = []
    const source = RoutePattern.compile_path(path, keys)

    return new RoutePattern(path, new RegExp(`^${source}$`), keys)
  }

  private constructor(
    readonly path: string,
    readonly regex: RegExp,
    readonly keys: string[]
  ) { }

  match(pathname: string): RegExpExecArray | null {
    return this.regex.exec(pathname)
  }

  private static compile_path(path: string, keys: string[]): string {
    let pattern = ""

    for (let index = 0; index < path.length; index++) {
      const char = path[index] ?? raise("RoutePattern: missing character")

      if (char === ":") {
        const result = RoutePattern.read_key(path, index + 1)
        keys.push(result.key)
        pattern += "([^/]+)"
        index = result.index - 1
      } else if (char === "*") {
        const result = RoutePattern.read_key(path, index + 1)
        keys.push(result.key)
        pattern += "(.*)"
        index = result.index - 1
      } else {
        pattern += RoutePattern.escape_regex(char)
      }
    }

    return pattern
  }

  private static read_key(path: string, start: number): { key: string, index: number } {
    let index = start
    let key = ""

    while (index < path.length) {
      const char = path[index] ?? raise("RoutePattern: missing character")

      if (!/[A-Za-z0-9_]/.test(char)) {
        break
      }

      key += char
      index++
    }

    if (key.length === 0) {
      raise(`Route path contains an unnamed parameter: ${path}`)
    }

    return { key, index }
  }

  private static escape_regex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
}
