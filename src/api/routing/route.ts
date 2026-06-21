import { raise } from "pimpanzee"
import type { HttpContext } from "../../http/context.js"
import type { RequestMethod } from "../../http/request_method.js"
import type { HttpResult } from "../../http/result.js"

export type HttpParams = Record<string, string>
export type RouteResult = HttpResult | Promise<HttpResult>
export type RouteAction<C extends HttpContext> = (ctx: C, route: Route) => RouteResult

export class Route {
  constructor(
    readonly method: RequestMethod,
    readonly path: string,
    readonly path_params: HttpParams
  ) { }

  param(param_name: string): string | null {
    return this.path_params[param_name] ?? null
  }

  fetch_param(param_name: string): string {
    return this.param(param_name) ?? raise(`Param missing: ${param_name}`)
  }

  fetch_int(param_name: string): number | null {
    const value = this.fetch_param(param_name)

    if (!/^[+-]?\d+$/.test(value)) {
      return null
    }

    return Number.parseInt(value, 10)
  }
}
