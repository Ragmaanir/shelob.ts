import type { IncomingMessage, ServerResponse } from "node:http"
import { type JSONValue, raise } from "pimpanzee"
import { RequestMethod } from "./request_method.js"

const BASIC_AUTH_HEADER = "authorization"

export class HttpRequest {
  method: RequestMethod
  readonly started_at = Date.now()

  constructor(readonly req: IncomingMessage) {
    this.method = RequestMethod.parse(req.method ?? raise("No HTTP method specified"))

    // res.on("finish", () => {
    //   console.log(`${req.method} ${duration}ms ${res.statusCode} ${req.url}`)
    // })
  }

  get url() {
    return this.req.url
  }

  basic_auth_header(): string | null {
    const header = this.req.headers[BASIC_AUTH_HEADER]

    if (Array.isArray(header)) {
      return header[0] ?? null
    }

    return header ?? null
  }

  get body(): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = ""

      this.req.on("data", (chunk) => { data += chunk })
      this.req.on("end", () => resolve(data))
      this.req.on("error", (err) => reject(err))
    })
  }

  get body_as_json(): Promise<JSONValue> {
    return new Promise((resolve, reject) => {
      let data = ""

      this.req.on("data", (chunk) => { data += chunk })
      this.req.on("end", () => resolve(JSON.parse(data)))
      this.req.on("error", (err) => reject(err))
    })
  }

  time_passed() {
    return Date.now() - this.started_at
  }
}

export class HttpResponse {
  constructor(readonly raw: ServerResponse) {

  }
}
