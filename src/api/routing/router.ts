import type { HttpContext } from "../../http/context.js"
import { RequestMethod } from "../../http/request_method.js"
import type { HttpResult } from "../../http/result.js"
import type { Route, RouteAction } from "./route.js"
import { type RouteMatch, RouteMatcher } from "./route_matcher.js"

export class Router<C extends HttpContext> {
  static normalize_path(path: string): string {
    const segments = path.split("/").filter((segment) => segment.length > 0)

    if (segments.length === 0) {
      return "/"
    }

    return `/${segments.join("/")}`
  }

  private routes: Array<RouteMatcher<C>> = []

  head(path: string, action: RouteAction<C>) {
    this.add(RequestMethod.HEAD, path, action)
  }

  get(path: string, action: RouteAction<C>) {
    this.add(RequestMethod.GET, path, action)
  }

  post(path: string, action: RouteAction<C>) {
    this.add(RequestMethod.POST, path, action)
  }

  put(path: string, action: RouteAction<C>) {
    this.add(RequestMethod.PUT, path, action)
  }

  patch(path: string, action: RouteAction<C>) {
    this.add(RequestMethod.PATCH, path, action)
  }

  delete(path: string, action: RouteAction<C>) {
    this.add(RequestMethod.DELETE, path, action)
  }

  match(methods: RequestMethod[], path: string, action: RouteAction<C>) {
    for (const method of methods) {
      this.add(method, path, action)
    }
  }

  private add(method: RequestMethod, path: string, action: RouteAction<C>) {
    this.routes.push(RouteMatcher.build(method, Router.normalize_path(path), action))
  }

  find_route(method: RequestMethod, url: string): Route | null {
    return this.find_route_match(method, url)?.route ?? null
  }

  route(ctx: C): Promise<HttpResult> | null {
    const match = this.find_route_match(ctx.request.method, ctx.request.url ?? "")

    if (match) {
      return Promise.resolve(match.matcher.action(ctx, match.route))
    }

    return null
  }

  private find_route_match(method: RequestMethod, url: string): RouteMatch<C> | null {
    const pathname = url.split("?").at(0) ?? ""
    const path = Router.normalize_path(pathname)

    for (const route of this.routes) {
      const match = route.match(method, path)

      if (match) {
        return match
      }
    }

    return null
  }
}
