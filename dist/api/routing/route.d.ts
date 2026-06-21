import type { HttpContext } from "../../http/context.js";
import type { RequestMethod } from "../../http/request_method.js";
import type { HttpResult } from "../../http/result.js";
export type HttpParams = Record<string, string>;
export type RouteResult = HttpResult | Promise<HttpResult>;
export type RouteAction<C extends HttpContext> = (ctx: C, route: Route) => RouteResult;
export declare class Route {
    readonly method: RequestMethod;
    readonly path: string;
    readonly path_params: HttpParams;
    constructor(method: RequestMethod, path: string, path_params: HttpParams);
    param(param_name: string): string | null;
    fetch_param(param_name: string): string;
    fetch_int(param_name: string): number | null;
}
