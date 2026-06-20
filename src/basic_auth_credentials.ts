import type { HttpRequest } from "./http/http.js"

const BASE_64_CHARSET = /^[a-zA-Z0-9+/]*={0,2}$/

export class BasicAuthCredentials {
  static from_request(request: HttpRequest): BasicAuthCredentials | null {
    return BasicAuthCredentials.from_header(request.basic_auth_header())
  }

  static from_header(header: string | null): BasicAuthCredentials | null {
    if (!header) {
      return null
    }

    const match = /^Basic (.+)$/.exec(header)

    if (!match || !BASE_64_CHARSET.test(match[1] ?? "")) {
      return null
    }

    const decoded = Buffer.from(match[1] ?? "", "base64").toString("utf8")
    const separator = decoded.indexOf(":")

    if (separator < 0) {
      return null
    }

    return new BasicAuthCredentials(decoded.slice(0, separator), decoded.slice(separator + 1))
  }

  constructor(readonly user: string, readonly password: string) { }

  equals(other: BasicAuthCredentials | null): boolean {
    return other !== null && this.user === other.user && this.password === other.password
  }

  authenticated(request: HttpRequest): boolean {
    return this.equals(BasicAuthCredentials.from_request(request))
  }
}
