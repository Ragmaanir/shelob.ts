import type { HttpContext } from "../../http/context.js";
import { RequestMethod } from "../../http/request_method.js";
import type { Route, RouteAction, RouteResult } from "./route.js";
import { Router } from "./router.js";
export type EndpointConstructor<C extends HttpContext> = new (ctx: C, route: Route) => {
    call(): RouteResult;
};
export type RouteTarget<C extends HttpContext> = RouteAction<C> | EndpointConstructor<C>;
export type ResourceRoutes<C extends HttpContext> = {
    index?: RouteTarget<C> | null;
    create?: RouteTarget<C> | null;
    show?: RouteTarget<C> | null;
    update?: RouteTarget<C> | null;
    destroy?: RouteTarget<C> | null;
};
export declare class RouterBuilder<C extends HttpContext> {
    static build<C extends HttpContext>(build: (builder: RouterBuilder<C>) => void): Router<C>;
    private readonly router;
    private readonly current_path;
    scope(path: string | symbol, build: (builder: this) => void): void;
    resources(path: string | symbol, routes: ResourceRoutes<C>, build?: ((builder: this) => void) | null): void;
    match(methods: RequestMethod[], target: RouteTarget<C>): void;
    match(path: string | symbol, methods: RequestMethod[], target: RouteTarget<C>): void;
    head(target: RouteTarget<C>): void;
    head(path: string | symbol, target: RouteTarget<C>): void;
    get(target: RouteTarget<C>): void;
    get(path: string | symbol, target: RouteTarget<C>): void;
    post(target: RouteTarget<C>): void;
    post(path: string | symbol, target: RouteTarget<C>): void;
    put(target: RouteTarget<C>): void;
    put(path: string | symbol, target: RouteTarget<C>): void;
    patch(target: RouteTarget<C>): void;
    patch(path: string | symbol, target: RouteTarget<C>): void;
    delete(target: RouteTarget<C>): void;
    delete(path: string | symbol, target: RouteTarget<C>): void;
    result(): Router<C>;
    private add;
    private build_path;
}
