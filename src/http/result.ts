import type { ReadStream } from "node:fs"
import { type JSONValue, MIMES, type Mime } from "pimpanzee"
import { type HttpStatus, HttpStatuses } from "./status.js"

export type ErrorJson = {
  exception: {
    name: string
    message: string
    backtrace?: string | undefined
  }
}


export class HttpResult {
  static ok() {
    return new HttpResult(HttpStatuses.OK, "", new Map())
  }

  static status(s: HttpStatus) {
    return new HttpResult(s, "", new Map())
  }

  static json(json: JSONValue, status: HttpStatus = HttpStatuses.OK) {
    return new HttpResult(status, JSON.stringify(json), new Map([["Content-Type", MIMES.JSON.value]]))
  }

  static raw_json(json: string | ReadStream, status: HttpStatus = HttpStatuses.OK) {
    return new HttpResult(status, json, new Map([["Content-Type", MIMES.JSON.value]]))
  }

  static error_json(json: ErrorJson, status: HttpStatus) {
    return new HttpResult(status, JSON.stringify(json), new Map([["Content-Type", MIMES.JSON.value]]))
  }

  static html(s: string | ReadStream) {
    return new HttpResult(HttpStatuses.OK, s, new Map([["Content-Type", MIMES.HTML.value]]))
  }

  static file(s: ReadStream, mime: Mime) {
    return new HttpResult(HttpStatuses.OK, s, new Map([["Content-Type", mime.value]]))
  }

  constructor(
    readonly status: HttpStatus,
    readonly content: string | ReadStream,
    readonly headers: Headers | Map<string, number | string | readonly string[]>
  ) {
  }
}
