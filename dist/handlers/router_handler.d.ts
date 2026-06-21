import type { Router } from "../api/routing/router.js";
import type { HttpContext } from "../http/context.js";
import { HttpResult } from "../http/result.js";
import { Handler } from "./handler.js";
export declare class RouterHandler<C extends HttpContext = HttpContext> extends Handler<C> {
    readonly router: Router<C>;
    constructor(router: Router<C>);
    call(context: C): Promise<HttpResult>;
}
