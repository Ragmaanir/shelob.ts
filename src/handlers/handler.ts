import type { HttpContext } from "../http/context.js"
import type { HttpResult } from "../http/result.js"

export abstract class Handler<C extends HttpContext = HttpContext> {
  next: Handler<C> | null = null

  abstract call(context: C): Promise<HttpResult>

  set_next(next: Handler<C>): Handler<C> {
    this.next = next
    return next
  }

  protected call_next(context: C): Promise<HttpResult> {
    if (!this.next) {
      throw new Error(`${this.constructor.name}: no next handler`)
    }

    return this.next.call(context)
  }

  static chain<C extends HttpContext>(handlers: Handler<C>[], terminal: Handler<C>): Handler<C> {
    let next = terminal

    for (const handler of handlers.toReversed()) {
      handler.set_next(next)
      next = handler
    }

    return next
  }
}
