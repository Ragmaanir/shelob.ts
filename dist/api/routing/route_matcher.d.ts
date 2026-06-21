import type { HttpContext } from "../../http/context.js";
import type { RequestMethod } from "../../http/request_method.js";
import { Route, type RouteAction } from "./route.js";
import { RoutePattern } from "./route_pattern.js";
export declare class RouteMatch<C extends HttpContext> {
    readonly route: Route;
    readonly matcher: RouteMatcher<C>;
    constructor(route: Route, matcher: RouteMatcher<C>);
}
export declare class RouteMatcher<C extends HttpContext> {
    readonly method: RequestMethod;
    readonly pattern: RoutePattern;
    readonly action: RouteAction<C>;
    static build<C extends HttpContext>(method: RequestMethod, path: string, action: RouteAction<C>): RouteMatcher<C>;
    constructor(method: RequestMethod, pattern: RoutePattern, action: RouteAction<C>);
    match(method: RequestMethod, pathname: string): RouteMatch<C> | null;
}
