import type { HttpResult } from "../http/result.js";
import type { ApiContext } from "./context.js";
import type { HttpParams } from "./router.js";
export declare abstract class Endpoint {
    readonly ctx: ApiContext;
    readonly params: HttpParams;
    constructor(ctx: ApiContext, params: HttpParams);
    abstract call(): Promise<HttpResult>;
    protected fetch_param(param_name: string): string;
    protected fetch_int(param_name: string): number | null;
}
