import type { ApiContext } from "./context.js"
import type { Route, RouteResult } from "./routing/route.js"

export abstract class Endpoint<C extends ApiContext> {
  constructor(
    readonly ctx: C,
    readonly route: Route
  ) { }

  abstract call(): RouteResult

  protected fetch_param(param_name: string): string {
    return this.route.fetch_param(param_name)
  }

  protected fetch_int(param_name: string): number | null {
    return this.route.fetch_int(param_name)
  }
}
