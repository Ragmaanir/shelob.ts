import type { HttpContext } from "../http/context.js";
import { HttpResult } from "../http/result.js";
import { Handler } from "./handler.js";
export declare class ErrorHandler<C extends HttpContext = HttpContext> extends Handler<C> {
    readonly options: {
        verbose?: boolean;
    };
    constructor(options?: {
        verbose?: boolean;
    });
    call(context: C): Promise<HttpResult>;
    log(e: unknown): void;
    result(e: unknown): HttpResult;
}
