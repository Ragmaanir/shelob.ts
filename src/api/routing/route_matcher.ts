import { raise } from "pimpanzee"
import type { HttpContext } from "../../http/context.js"
import type { RequestMethod } from "../../http/request_method.js"
import { type HttpParams, Route, type RouteAction } from "./route.js"
import { RoutePattern } from "./route_pattern.js"

export class RouteMatch<C extends HttpContext> {
  constructor(
    readonly route: Route,
    readonly matcher: RouteMatcher<C>
  ) { }
}

export class RouteMatcher<C extends HttpContext> {
  static build<C extends HttpContext>(method: RequestMethod, path: string, action: RouteAction<C>) {
    return new RouteMatcher(method, RoutePattern.compile(path), action)
  }

  constructor(
    readonly method: RequestMethod,
    readonly pattern: RoutePattern,
    readonly action: RouteAction<C>
  ) { }

  match(method: RequestMethod, pathname: string): RouteMatch<C> | null {
    if (method !== this.method) {
      return null
    }

    const match = this.pattern.match(pathname)

    if (!match) {
      return null
    }

    const path_params: HttpParams = {}

    for (let index = 0; index < this.pattern.keys.length; index++) {
      const key = this.pattern.keys.at(index) ?? raise("RouteMatcher: missing key")
      const value = match.at(index + 1) ?? null

      if (value !== null) {
        path_params[key] = decodeURIComponent(value)
      }
    }

    return new RouteMatch(new Route(method, pathname, path_params), this)
  }
}
