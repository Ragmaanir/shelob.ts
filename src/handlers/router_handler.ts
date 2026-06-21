import type { Router } from "../api/routing/router.js"
import type { HttpContext } from "../http/context.js"
import { HttpResult } from "../http/result.js"
import { HttpStatuses } from "../http/status.js"
import { Handler } from "./handler.js"

export class RouterHandler<C extends HttpContext = HttpContext> extends Handler<C> {
  constructor(readonly router: Router<C>) {
    super()
  }

  call(context: C): Promise<HttpResult> {
    return this.router.route(context) ?? Promise.resolve(HttpResult.status(HttpStatuses.NOT_FOUND))
  }
}
