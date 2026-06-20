import type { HttpContext } from "../http/context.js"
import { RequestMethod } from "../http/request_method.js"
import type { HttpResult } from "../http/result.js"


export type HttpParams = { [key: string]: string | undefined }
type Handler<C extends HttpContext> = (ctx: C, params: HttpParams) => Promise<HttpResult>

class Route<C extends HttpContext> {
  constructor(
    readonly method: RequestMethod,
    readonly path: string,
    // readonly path_params: Map<string, string | null>
    readonly path_params: { [key: string]: string | undefined },
    readonly matcher: RouteMatcher<C>
  ) { }
}

class RouteMatcher<C extends HttpContext> {
  static build<C extends HttpContext>(method: RequestMethod, path: string, handler: Handler<C>) {
    // Convert "/users/:id" to regex and extract keys
    const keys: string[] = []
    const pattern = path.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
      keys.push(key)
      return "([^/]+)"
    })
    const regex = new RegExp(`^${pattern}$`)

    return new RouteMatcher(method, regex, keys, handler)
  }

  constructor(
    readonly method: RequestMethod,
    readonly path: RegExp,
    readonly keys: string[],
    readonly handler: Handler<C>
  ) { }

  // match(path: string) {
  // }
}

export class Router<C extends HttpContext> {
  private routes: Array<RouteMatcher<C>> = []

  get(path: string, handler: Handler<C>) {
    this.add(RequestMethod.GET, path, handler)
  }

  post(path: string, handler: Handler<C>) {
    this.add(RequestMethod.POST, path, handler)
  }

  delete(path: string, handler: Handler<C>) {
    this.add(RequestMethod.DELETE, path, handler)
  }

  private add(method: RequestMethod, path: string, handler: Handler<C>) {
    this.routes.push(RouteMatcher.build(method, path, handler))
  }

  find_route(method: RequestMethod, url: string): Route<C> | null {
    const pathname = url.split("?")[0] ?? ""

    for (const r of this.routes) {
      if (method === r.method) {
        const match = r.path.exec(pathname)
        if (match) {
          const path_params = Object.fromEntries(r.keys.map((k, i) => [k, match[i + 1]]))
          return new Route(method, pathname, path_params, r)
        }
      }
    }

    return null
  }

  route(ctx: C): Promise<HttpResult> | null {
    const r = this.find_route(ctx.request.method, ctx.request.url ?? "")

    if (r) {
      return r.matcher.handler(ctx, r.path_params)
    }

    return null
  }
}
