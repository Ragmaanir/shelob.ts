import type { HttpContext } from "../http/context.js";
import type { HttpResult } from "../http/result.js";
export declare abstract class Handler<C extends HttpContext = HttpContext> {
    next: Handler<C> | null;
    abstract call(context: C): Promise<HttpResult>;
    set_next(next: Handler<C>): Handler<C>;
    protected call_next(context: C): Promise<HttpResult>;
    static chain<C extends HttpContext>(handlers: Handler<C>[], terminal: Handler<C>): Handler<C>;
}
