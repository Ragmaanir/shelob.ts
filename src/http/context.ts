import { ReadStream } from "node:fs"
import type { HttpRequest, HttpResponse } from "./http.js"
import type { HttpResult } from "./result.js"

export class HttpContext {
  constructor(
    readonly request: HttpRequest,
    readonly response: HttpResponse
  ) { }

  get method() {
    return this.request.method
  }

  get url() {
    return this.request.url
  }

  apply_result(r: HttpResult, on_error: (error: Error) => void) {
    const res = this.response.raw

    res.setHeaders(r.headers)
    res.statusCode = r.status.code

    const c = r.content

    if (c instanceof ReadStream) {
      c.pipe(res)

      c.on("error", (e) => {
        on_error(e)
        res.statusCode = 500
        res.end("Error piping stream")
      })
    } else {
      res.end(c)
    }
  }
}
