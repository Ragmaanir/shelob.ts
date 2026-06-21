import { raise } from "pimpanzee"
import type { HttpContext } from "../../http/context.js"
import { RequestMethod } from "../../http/request_method.js"
import type { Route, RouteAction, RouteResult } from "./route.js"
import { Router } from "./router.js"

export type EndpointConstructor<C extends HttpContext> = new (ctx: C, route: Route) => { call(): RouteResult }
export type RouteTarget<C extends HttpContext> = RouteAction<C> | EndpointConstructor<C>
export type ResourceRoutes<C extends HttpContext> = {
  index?: RouteTarget<C> | null
  create?: RouteTarget<C> | null
  show?: RouteTarget<C> | null
  update?: RouteTarget<C> | null
  destroy?: RouteTarget<C> | null
}

export class RouterBuilder<C extends HttpContext> {
  static build<C extends HttpContext>(build: (builder: RouterBuilder<C>) => void): Router<C> {
    const builder = new RouterBuilder<C>()
    build(builder)

    return builder.result()
  }

  private readonly router = new Router<C>()
  private readonly current_path: string[] = []

  scope(path: string | symbol, build: (builder: this) => void) {
    this.current_path.push(path.toString())

    try {
      build(this)
    } finally {
      this.current_path.pop()
    }
  }

  resources(path: string | symbol, routes: ResourceRoutes<C>, build: ((builder: this) => void) | null = null) {
    this.scope(path, () => {
      if (routes.index) {
        this.get(routes.index)
      }

      if (routes.create) {
        this.post(routes.create)
      }

      if (routes.show) {
        this.get(":id", routes.show)
      }

      if (routes.update) {
        this.put(":id", routes.update)
      }

      if (routes.destroy) {
        this.delete(":id", routes.destroy)
      }

      if (build) {
        build(this)
      }
    })
  }

  match(methods: RequestMethod[], target: RouteTarget<C>): void
  match(path: string | symbol, methods: RequestMethod[], target: RouteTarget<C>): void
  match(path_or_methods: string | symbol | RequestMethod[], methods_or_target: RequestMethod[] | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    if (Array.isArray(path_or_methods)) {
      this.router.match(path_or_methods, this.build_path(null), route_action(methods_or_target as RouteTarget<C>))
    } else {
      this.router.match(methods_or_target as RequestMethod[], this.build_path(path_or_methods.toString()), route_action(target ?? raise("RouterBuilder: missing route target")))
    }
  }

  head(target: RouteTarget<C>): void
  head(path: string | symbol, target: RouteTarget<C>): void
  head(path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    this.add(RequestMethod.HEAD, path_or_target, target)
  }

  get(target: RouteTarget<C>): void
  get(path: string | symbol, target: RouteTarget<C>): void
  get(path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    this.add(RequestMethod.GET, path_or_target, target)
  }

  post(target: RouteTarget<C>): void
  post(path: string | symbol, target: RouteTarget<C>): void
  post(path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    this.add(RequestMethod.POST, path_or_target, target)
  }

  put(target: RouteTarget<C>): void
  put(path: string | symbol, target: RouteTarget<C>): void
  put(path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    this.add(RequestMethod.PUT, path_or_target, target)
  }

  patch(target: RouteTarget<C>): void
  patch(path: string | symbol, target: RouteTarget<C>): void
  patch(path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    this.add(RequestMethod.PATCH, path_or_target, target)
  }

  delete(target: RouteTarget<C>): void
  delete(path: string | symbol, target: RouteTarget<C>): void
  delete(path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null = null) {
    this.add(RequestMethod.DELETE, path_or_target, target)
  }

  result(): Router<C> {
    return this.router
  }

  private add(method: RequestMethod, path_or_target: string | symbol | RouteTarget<C>, target: RouteTarget<C> | null) {
    if (target) {
      this.router.match([method], this.build_path(path_or_target.toString()), route_action(target))
    } else {
      this.router.match([method], this.build_path(null), route_action(path_or_target as RouteTarget<C>))
    }
  }

  private build_path(path: string | null): string {
    return Router.normalize_path([...this.current_path, path].filter((segment) => segment !== null).join("/"))
  }
}

function route_action<C extends HttpContext>(target: RouteTarget<C>): RouteAction<C> {
  if (is_endpoint_constructor(target)) {
    return (ctx, route) => new target(ctx, route).call()
  }

  return target
}

function is_endpoint_constructor<C extends HttpContext>(target: RouteTarget<C>): target is EndpointConstructor<C> {
  return "prototype" in target && "call" in target.prototype
}
