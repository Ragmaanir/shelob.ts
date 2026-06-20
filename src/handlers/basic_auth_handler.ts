import type { BasicAuthCredentials } from "../basic_auth_credentials.js"
import type { HttpContext } from "../http/context.js"
import { HttpResult } from "../http/result.js"
import { HttpStatuses } from "../http/status.js"
import { Handler } from "./handler.js"

export class BasicAuthHandler<C extends HttpContext = HttpContext> extends Handler<C> {
  constructor(
    readonly basic_auth: BasicAuthCredentials | null,
    readonly realm: string
  ) {
    super()
  }

  call(context: C): Promise<HttpResult> {
    if (!this.basic_auth || this.basic_auth.authenticated(context.request)) {
      return this.call_next(context)
    }

    return Promise.resolve(new HttpResult(
      HttpStatuses.UNAUTHORIZED,
      "HTTP 401 Unauthorized",
      new Map([["WWW-Authenticate", `Basic realm="${this.realm}"`]])
    ))
  }
}
