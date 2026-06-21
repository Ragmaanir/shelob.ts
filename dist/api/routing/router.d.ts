import type { HttpContext } from "../../http/context.js";
import { RequestMethod } from "../../http/request_method.js";
import type { HttpResult } from "../../http/result.js";
import type { Route, RouteAction } from "./route.js";
export declare class Router<C extends HttpContext> {
    static normalize_path(path: string): string;
    private routes;
    head(path: string, action: RouteAction<C>): void;
    get(path: string, action: RouteAction<C>): void;
    post(path: string, action: RouteAction<C>): void;
    put(path: string, action: RouteAction<C>): void;
    patch(path: string, action: RouteAction<C>): void;
    delete(path: string, action: RouteAction<C>): void;
    match(methods: RequestMethod[], path: string, action: RouteAction<C>): void;
    private add;
    find_route(method: RequestMethod, url: string): Route | null;
    route(ctx: C): Promise<HttpResult> | null;
    private find_route_match;
}
