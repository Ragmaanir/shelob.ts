import type { ApiContext } from "./context.js";
import type { Route, RouteResult } from "./routing/route.js";
export declare abstract class Endpoint<C extends ApiContext> {
    readonly ctx: C;
    readonly route: Route;
    constructor(ctx: C, route: Route);
    abstract call(): RouteResult;
    protected fetch_param(param_name: string): string;
    protected fetch_int(param_name: string): number | null;
}
