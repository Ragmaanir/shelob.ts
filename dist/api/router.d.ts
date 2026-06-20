import type { HttpContext } from "../http/context.js";
import { RequestMethod } from "../http/request_method.js";
import type { HttpResult } from "../http/result.js";
export type HttpParams = {
    [key: string]: string | undefined;
};
type Handler<C extends HttpContext> = (ctx: C, params: HttpParams) => Promise<HttpResult>;
declare class Route<C extends HttpContext> {
    readonly method: RequestMethod;
    readonly path: string;
    readonly path_params: {
        [key: string]: string | undefined;
    };
    readonly matcher: RouteMatcher<C>;
    constructor(method: RequestMethod, path: string, path_params: {
        [key: string]: string | undefined;
    }, matcher: RouteMatcher<C>);
}
declare class RouteMatcher<C extends HttpContext> {
    readonly method: RequestMethod;
    readonly path: RegExp;
    readonly keys: string[];
    readonly handler: Handler<C>;
    static build<C extends HttpContext>(method: RequestMethod, path: string, handler: Handler<C>): RouteMatcher<C>;
    constructor(method: RequestMethod, path: RegExp, keys: string[], handler: Handler<C>);
}
export declare class Router<C extends HttpContext> {
    private routes;
    get(path: string, handler: Handler<C>): void;
    post(path: string, handler: Handler<C>): void;
    delete(path: string, handler: Handler<C>): void;
    private add;
    find_route(method: RequestMethod, url: string): Route<C> | null;
    route(ctx: C): Promise<HttpResult> | null;
}
export {};
