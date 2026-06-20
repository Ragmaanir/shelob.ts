import { raise } from "pimpanzee"

export enum RequestMethod {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export namespace RequestMethod {
  export function parse(s: string) {
    if (!Object.keys(RequestMethod).includes(s))
      raise(`RequestMethod: cannot parse: ${s}`)
    return s as RequestMethod
  }
}
